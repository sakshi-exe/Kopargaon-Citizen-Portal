import React, { useEffect, useState } from 'react';

import {
  MapContainer,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';

import L from 'leaflet';

import { useApp } from '../../context/AppContext.jsx';

import Header from '../../components/ui/Header.jsx';

import { ISSUE_CATEGORIES } from '../../data/issues.js';

import {
  wards,
  KOPARGAON_CENTER,
} from '../../data/wards.js';

import {
  CheckCircle,
  MapPin,
  Upload,
  X,
} from 'lucide-react';

import { supabase } from '../../lib/supabase.js';

const CITY_CENTER = KOPARGAON_CENTER;

// ======================================================
// REPORT ISSUE
// ======================================================

export default function ReportIssue() {
  const { dispatch } = useApp();

  // ==================================================
  // FORM STATE
  // ==================================================

  const [form, setForm] = useState({
    category: '',
    description: '',
    wardId: '',
    citizenName: '',
    isAnonymous: false,
    photo: null,
  });

  const [pickedLoc, setPickedLoc] = useState(null);

  const [photoPreview, setPhotoPreview] =
    useState(null);

  const [submitted, setSubmitted] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [uploading, setUploading] =
    useState(false);

  // ==================================================
  // PHOTO SELECTION
  // ==================================================

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // --------------------------------------------------
    // CHECK IMAGE TYPE
    // --------------------------------------------------

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // --------------------------------------------------
    // MAX 5 MB
    // --------------------------------------------------

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5 MB.');
      return;
    }

    // --------------------------------------------------
    // SAVE FILE
    // --------------------------------------------------

    setForm((f) => ({
      ...f,
      photo: file,
    }));

    // --------------------------------------------------
    // PREVIEW
    // --------------------------------------------------

    const reader = new FileReader();

    reader.onload = (event) => {
      setPhotoPreview(event.target.result);
    };

    reader.readAsDataURL(file);
  };

  // ==================================================
  // VALIDATION
  // ==================================================

  const validate = () => {
    const errs = {};

    // CATEGORY
    if (!form.category) {
      errs.category =
        'Please select a category';
    }

    // DESCRIPTION
    if (
      !form.description ||
      form.description.trim().length < 10
    ) {
      errs.description =
        'Please provide a description (min 10 chars)';
    }

    // WARD
    if (!form.wardId) {
      errs.wardId =
        'Please select your ward';
    }

    // LOCATION
    if (!pickedLoc) {
      errs.loc =
        'Please click on the map to select a location';
    }

    // CITIZEN NAME
    if (
      !form.isAnonymous &&
      !form.citizenName.trim()
    ) {
      errs.citizenName =
        'Please enter your name or submit anonymously';
    }

    return errs;
  };

  // ==================================================
  // GET WARD NAME
  // ==================================================

  const getWardName = () => {
    const selectedWard = wards.find(
      (ward) =>
        String(ward.id) ===
        String(form.wardId)
    );

    return (
      selectedWard?.name ||
      form.wardId
    );
  };

  // ==================================================
  // UPLOAD PHOTO TO SUPABASE
  // ==================================================

  const uploadPhoto = async (
    file,
    userId
  ) => {
    if (!file) {
      return null;
    }

    try {
      // ------------------------------------------------
      // FILE EXTENSION
      // ------------------------------------------------

      const fileExtension =
        file.name
          .split('.')
          .pop()
          ?.toLowerCase() || 'jpg';

      // ------------------------------------------------
      // UNIQUE FILE NAME
      // ------------------------------------------------

      const fileName =
        `${crypto.randomUUID()}.${fileExtension}`;

      // ------------------------------------------------
      // FILE PATH
      // ------------------------------------------------

      const filePath =
        `${userId}/${fileName}`;

      console.log(
        'Uploading issue photo:',
        filePath
      );

      // =================================================
      // IMPORTANT:
      // YOUR SUPABASE BUCKET IS "issue-images"
      // =================================================

      const {
        error: uploadError,
      } = await supabase.storage
        .from('issue-images')
        .upload(
          filePath,
          file,
          {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          }
        );

      // ------------------------------------------------
      // UPLOAD ERROR
      // ------------------------------------------------

      if (uploadError) {
        console.error(
          'PHOTO UPLOAD ERROR:',
          uploadError
        );

        throw uploadError;
      }

      console.log(
        'Photo uploaded successfully.'
      );

      // ------------------------------------------------
      // GET PUBLIC URL
      // ------------------------------------------------

      const {
        data: publicUrlData,
      } = supabase.storage
        .from('issue-images')
        .getPublicUrl(filePath);

      const publicUrl =
        publicUrlData?.publicUrl;

      if (!publicUrl) {
        throw new Error(
          'Could not generate photo URL.'
        );
      }

      console.log(
        'Photo public URL:',
        publicUrl
      );

      return publicUrl;

    } catch (error) {
      console.error(
        'Photo upload failed:',
        error
      );

      throw error;
    }
  };

  // ==================================================
  // SUBMIT REPORT
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --------------------------------------------------
    // VALIDATE
    // --------------------------------------------------

    const validationErrors =
      validate();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setUploading(true);

    try {
      // =================================================
      // GET CURRENT USER
      // =================================================

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      // --------------------------------------------------
      // AUTH ERROR
      // --------------------------------------------------

      if (userError) {
        console.error(
          'Failed to get current user:',
          userError
        );

        alert(
          `Authentication error:

${userError.message}`
        );

        setUploading(false);
        return;
      }

      // --------------------------------------------------
      // USER NOT LOGGED IN
      // --------------------------------------------------

      if (!user) {
        alert(
          'Please sign in before submitting a report.'
        );

        setUploading(false);
        return;
      }

      console.log(
        'Current authenticated user:',
        user.id
      );

      // =================================================
      // PREPARE ISSUE DATA
      // =================================================

      const wardName =
        getWardName();

      // --------------------------------------------------
      // CREATE TITLE
      // --------------------------------------------------

      const title =
        form.description.trim().length > 60
          ? `${form.description
              .trim()
              .slice(0, 60)}…`
          : form.description.trim();

      // --------------------------------------------------
      // CITIZEN NAME
      // --------------------------------------------------

      const citizenName =
        form.isAnonymous
          ? 'Anonymous'
          : form.citizenName.trim();

      // =================================================
      // UPLOAD PHOTO
      // =================================================

      let photoUrl = null;

      if (form.photo) {
        console.log(
          'Starting photo upload...'
        );

        photoUrl =
          await uploadPhoto(
            form.photo,
            user.id
          );

        console.log(
          'Uploaded photo URL:',
          photoUrl
        );
      }

      // =================================================
      // INSERT ISSUE INTO SUPABASE
      // =================================================

      console.log(
        'Saving issue to Supabase...'
      );

      const {
        data,
        error,
      } = await supabase
        .from('issues')
        .insert([
          {
            // ------------------------------------------
            // BASIC INFO
            // ------------------------------------------

            title: title,

            description:
              form.description.trim(),

            category:
              form.category,

            priority:
              'medium',

            status:
              'pending',

            // ------------------------------------------
            // LOCATION
            // ------------------------------------------

            location:
              wardName,

            latitude:
              pickedLoc[0],

            longitude:
              pickedLoc[1],

            // ------------------------------------------
            // CITIZEN
            // ------------------------------------------

            citizen_name:
              citizenName,

            user_id:
              user.id,

            // ------------------------------------------
            // PHOTO
            // ------------------------------------------

            photo_url:
              photoUrl,
          },
        ])
        .select()
        .single();

      // =================================================
      // DATABASE ERROR
      // =================================================

      if (error) {
        console.error(
          'SUPABASE ERROR:',
          JSON.stringify(
            error,
            null,
            2
          )
        );

        alert(
          `Failed to submit report:

${error.message}

Details:
${error.details || 'None'}

Hint:
${error.hint || 'None'}`
        );

        setUploading(false);
        return;
      }

      // =================================================
      // SUCCESS
      // =================================================

      console.log(
        'Issue successfully saved to Supabase:',
        data
      );

      console.log(
        'Saved photo URL:',
        photoUrl
      );

      // =================================================
      // KEEP LOCAL APP STATE WORKING
      // =================================================

      dispatch({
        type: 'SUBMIT_ISSUE',

        payload: {
          ...form,

          id:
            data?.id,

          title:
            title,

          priority:
            'medium',

          status:
            'pending',

          location:
            wardName,

          lat:
            pickedLoc[0],

          lng:
            pickedLoc[1],

          citizenName:
            citizenName,

          user_id:
            user.id,

          // IMPORTANT:
          // Keep uploaded photo URL
          photo_url:
            photoUrl,
        },
      });

      // --------------------------------------------------
      // FINISH
      // --------------------------------------------------

      setUploading(false);

      setSubmitted(true);

    } catch (error) {
      // =================================================
      // UNEXPECTED ERROR
      // =================================================

      console.error(
        'Unexpected submission error:',
        error
      );

      alert(
        `Something went wrong while submitting the report.

${error?.message || ''}`
      );

      setUploading(false);
    }
  };

  // ==================================================
  // RESET FORM
  // ==================================================

  const resetForm = () => {
    setForm({
      category: '',
      description: '',
      wardId: '',
      citizenName: '',
      isAnonymous: false,
      photo: null,
    });

    setPickedLoc(null);

    setPhotoPreview(null);

    setErrors({});

    setUploading(false);
  };

  // ==================================================
  // SUCCESS SCREEN
  // ==================================================

  if (submitted) {
    return (
      <div className="flex flex-col h-full">

        <Header
          title="Report Issue"
        />

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">

          {/* SUCCESS ICON */}

          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-4">

            <CheckCircle
              size={32}
              className="text-green-600 dark:text-green-400"
            />

          </div>

          {/* TITLE */}

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Issue Reported Successfully
          </h2>

          {/* DESCRIPTION */}

          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            Your report has been submitted
            and is now visible on the city
            map. You can track its status
            under{' '}
            <strong>My Reports</strong>.
          </p>

          {/* BUTTONS */}

          <div className="flex gap-3">

            <button
              onClick={() => {
                setSubmitted(false);
                resetForm();
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
            >
              Report Another Issue
            </button>

            <a
              href="/citizen/my-reports"
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              View My Reports
            </a>

          </div>

        </div>

      </div>
    );
  }

  // ==================================================
  // MAIN FORM
  // ==================================================

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* =================================================
          HEADER
      ================================================= */}

      <Header
        title="Report a Civic Issue"
        subtitle="Help us improve the city by reporting problems in your area"
      />

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="flex-1 overflow-y-auto p-6">

        <form
          onSubmit={handleSubmit}
          className="max-w-6xl mx-auto space-y-6"
        >

          {/* =================================================
              TWO COLUMN LAYOUT
          ================================================= */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="space-y-5">

              {/* =================================================
                  CATEGORY
              ================================================= */}

              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">

                  Issue Category{' '}

                  <span className="text-red-500">
                    *
                  </span>

                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      category:
                        e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm"
                >

                  <option value="">
                    Select category
                  </option>

                  {ISSUE_CATEGORIES.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}

                </select>

                {errors.category && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.category}
                  </p>
                )}

              </div>

              {/* =================================================
                  WARD
              ================================================= */}

              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">

                  Ward / Area{' '}

                  <span className="text-red-500">
                    *
                  </span>

                </label>

                <select
                  value={form.wardId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      wardId:
                        e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm"
                >

                  <option value="">
                    Select ward / area
                  </option>

                  {wards.map(
                    (ward) => (
                      <option
                        key={ward.id}
                        value={ward.id}
                      >
                        {ward.name}
                      </option>
                    )
                  )}

                </select>

                {errors.wardId && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.wardId}
                  </p>
                )}

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">

                  Description{' '}

                  <span className="text-red-500">
                    *
                  </span>

                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      description:
                        e.target.value,
                    }))
                  }
                  placeholder="Describe the civic issue..."
                  rows={5}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm resize-none"
                />

                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}

              </div>

              {/* =================================================
                  ANONYMOUS
              ================================================= */}

              <div className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={
                    form.isAnonymous
                  }
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      isAnonymous:
                        e.target.checked,
                    }))
                  }
                  className="w-4 h-4"
                />

                <label className="text-sm text-slate-600 dark:text-slate-300">
                  Submit anonymously
                </label>

              </div>

              {/* =================================================
                  CITIZEN NAME
              ================================================= */}

              {!form.isAnonymous && (
                <div>

                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">

                    Your Name{' '}

                    <span className="text-red-500">
                      *
                    </span>

                  </label>

                  <input
                    type="text"
                    value={
                      form.citizenName
                    }
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        citizenName:
                          e.target.value,
                      }))
                    }
                    placeholder="Enter your name"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm"
                  />

                  {errors.citizenName && (
                    <p className="text-xs text-red-500 mt-1">
                      {
                        errors.citizenName
                      }
                    </p>
                  )}

                </div>
              )}

              {/* =================================================
                  PHOTO UPLOAD
              ================================================= */}

              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">

                  Photo{' '}

                  <span className="text-slate-400">
                    (optional)
                  </span>

                </label>

                {photoPreview ? (

                  /* ==========================================
                     PHOTO PREVIEW
                  ========================================== */

                  <div className="relative">

                    <img
                      src={photoPreview}
                      alt="Issue preview"
                      className="w-full h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                    />

                    {/* REMOVE PHOTO */}

                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview(
                          null
                        );

                        setForm(
                          (f) => ({
                            ...f,
                            photo:
                              null,
                          })
                        );
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
                    >
                      <X size={15} />
                    </button>

                    {/* FILE NAME */}

                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs rounded px-2 py-1 truncate">
                      {form.photo?.name}
                    </div>

                  </div>

                ) : (

                  /* ==========================================
                     UPLOAD BOX
                  ========================================== */

                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-teal-400 dark:hover:border-teal-600 transition-colors">

                    <Upload
                      size={22}
                      className="text-slate-400 mb-1"
                    />

                    <span className="text-sm text-slate-500">
                      Click to upload photo
                    </span>

                    <span className="text-xs text-slate-400 mt-1">
                      JPG, PNG, WEBP • Max 5 MB
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handlePhoto
                      }
                      className="sr-only"
                    />

                  </label>

                )}

              </div>

            </div>

            {/* =================================================
                RIGHT SIDE — MAP
            ================================================= */}

            <div>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">

                Pin Location on Map{' '}

                <span className="text-red-500">
                  *
                </span>

              </label>

              {/* MAP */}

              <div className="relative h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">

                <MapContainer
                  center={
                    CITY_CENTER
                  }
                  zoom={13}
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                  zoomControl={true}
                >

                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <ClickHandler
                    onPick={
                      setPickedLoc
                    }
                    picked={
                      pickedLoc
                    }
                  />

                </MapContainer>

              </div>

              {/* LOCATION STATUS */}

              {pickedLoc ? (

                <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">

                  <MapPin size={12} />

                  Location selected:{' '}

                  {pickedLoc[0].toFixed(5)}

                  ,{' '}

                  {pickedLoc[1].toFixed(5)}

                </div>

              ) : (

                <p className="mt-2 text-xs text-slate-500">
                  Click on the map to mark
                  the exact issue location
                </p>

              )}

              {/* LOCATION ERROR */}

              {errors.loc && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.loc}
                </p>
              )}

            </div>

          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="flex justify-end gap-3 pt-2">

            {/* RESET */}

            <button
              type="button"
              onClick={resetForm}
              disabled={uploading}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              Reset
            </button>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {uploading
                ? 'Submitting...'
                : 'Submit Report'}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

// ======================================================
// MAP CLICK HANDLER
// ======================================================

function ClickHandler({
  onPick,
  picked,
}) {
  const map = useMapEvents({
    click(e) {
      onPick([
        e.latlng.lat,
        e.latlng.lng,
      ]);
    },
  });

  // ==================================================
  // CREATE / REMOVE MARKER
  // ==================================================

  useEffect(() => {
    if (!picked) {
      return;
    }

    // --------------------------------------------------
    // RED MARKER
    // --------------------------------------------------

    const icon =
      L.divIcon({
        html: `
          <div
            style="
              width:18px;
              height:18px;
              border-radius:50%;
              background:#ef4444;
              border:3px solid white;
              box-shadow:0 0 0 3px rgba(239,68,68,0.3);
            "
          ></div>
        `,
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

    // --------------------------------------------------
    // ADD MARKER
    // --------------------------------------------------

    const marker =
      L.marker(
        picked,
        {
          icon,
        }
      ).addTo(map);

    // --------------------------------------------------
    // CLEANUP OLD MARKER
    // --------------------------------------------------

    return () => {
      map.removeLayer(
        marker
      );
    };

  }, [picked, map]);

  return null;
}