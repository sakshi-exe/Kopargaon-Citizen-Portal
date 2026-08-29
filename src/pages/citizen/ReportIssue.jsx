import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { ISSUE_CATEGORIES } from '../../data/issues.js';
import { wards, KOPARGAON_CENTER } from '../../data/wards.js';
import { CheckCircle, MapPin, Upload, X } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';

const CITY_CENTER = KOPARGAON_CENTER;

export default function ReportIssue() {
  const { dispatch } = useApp();

  const [form, setForm] = useState({
    category: '',
    description: '',
    wardId: '',
    citizenName: '',
    isAnonymous: false,
    photo: null,
  });

  const [pickedLoc, setPickedLoc] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setForm((f) => ({
      ...f,
      photo: file,
    }));

    const reader = new FileReader();

    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result);
    };

    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};

    if (!form.category) {
      errs.category = 'Please select a category';
    }

    if (!form.description || form.description.trim().length < 10) {
      errs.description =
        'Please provide a description (min 10 chars)';
    }

    if (!form.wardId) {
      errs.wardId = 'Please select your ward';
    }

    if (!pickedLoc) {
      errs.loc =
        'Please click on the map to select a location';
    }

    if (!form.isAnonymous && !form.citizenName.trim()) {
      errs.citizenName =
        'Please enter your name or submit anonymously';
    }

    return errs;
  };

  const getWardName = () => {
    const selectedWard = wards.find(
      (ward) => String(ward.id) === String(form.wardId)
    );

    return selectedWard?.name || form.wardId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      /*
       * issues table:
       *
       * id
       * title
       * description
       * category
       * priority
       * status
       * location
       * citizen_name
       * latitude
       * longitude
       * created_at
       *
       * Photo is kept locally for now because the issues table
       * does not contain a photo URL column.
       */

      const wardName = getWardName();

      const title =
        form.description.trim().length > 60
          ? `${form.description.trim().slice(0, 60)}…`
          : form.description.trim();

      const citizenName = form.isAnonymous
        ? 'Anonymous'
        : form.citizenName.trim();

      const { data, error } = await supabase
        .from('issues')
        .insert([
          {
            title,
            description: form.description.trim(),
            category: form.category,
            priority: 'Medium',
            status: 'Reported',
            location: wardName,
            citizen_name: citizenName,
            latitude: pickedLoc[0],
            longitude: pickedLoc[1],
          },
        ])
        .select()
        .single();

      if (error) {
        console.error(
          'SUPABASE ERROR:',
          JSON.stringify(error, null, 2)
        );

        alert(
          `Failed to submit report:\n\n${error.message}\n\nDetails: ${
            error.details || 'None'
          }\n\nHint: ${error.hint || 'None'}`
        );

        return;
      }

      console.log(
        'Issue successfully saved to Supabase:',
        data
      );

      /*
       * Keep existing local app state working.
       */
      dispatch({
        type: 'SUBMIT_ISSUE',
        payload: {
          ...form,
          id: data?.id,
          title,
          priority: 'Medium',
          status: 'Reported',
          location: wardName,
          lat: pickedLoc[0],
          lng: pickedLoc[1],
          citizenName,
        },
      });

      setSubmitted(true);
    } catch (error) {
      console.error(
        'Unexpected error:',
        error
      );

      alert(
        'Something went wrong while submitting the report.'
      );
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Report Issue" />

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">

          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-4">
            <CheckCircle
              size={32}
              className="text-green-600 dark:text-green-400"
            />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Issue Reported Successfully
          </h2>

          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            Your report has been submitted and is now visible
            on the city map. You can track its status under{' '}
            <strong>My Reports</strong>.
          </p>

          <div className="flex gap-3">

            <button
              onClick={() => {
                setSubmitted(false);

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

  return (
    <div className="flex flex-col h-full overflow-hidden">

      <Header
        title="Report a Civic Issue"
        subtitle="Help us improve the city by reporting problems in your area"
      />

      <div className="flex-1 overflow-y-auto">

        <div className="max-w-4xl mx-auto p-6">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div className="grid md:grid-cols-2 gap-6">

              {/* LEFT: FORM */}

              <div className="space-y-4">

                {/* CATEGORY */}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Issue Category{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        category: e.target.value,
                      }));
                    }}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">
                      Select a category…
                    </option>

                    {ISSUE_CATEGORIES.map((c) => (
                      <option
                        key={c}
                        value={c}
                      >
                        {c}
                      </option>
                    ))}
                  </select>

                  {errors.category && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* WARD */}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Ward / Area{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={form.wardId}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        wardId: e.target.value,
                      }));
                    }}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">
                      Select your ward…
                    </option>

                    {wards.map((w) => (
                      <option
                        key={w.id}
                        value={w.id}
                      >
                        {w.name}
                      </option>
                    ))}
                  </select>

                  {errors.wardId && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.wardId}
                    </p>
                  )}
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Description{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }));
                    }}
                    placeholder="Describe the issue in detail — location, severity, how long it has existed…"
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />

                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* REPORTER */}

                <div>

                  <label className="flex items-center gap-2 mb-2 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={form.isAnonymous}
                      onChange={(e) => {
                        setForm((f) => ({
                          ...f,
                          isAnonymous: e.target.checked,
                        }));
                      }}
                      className="rounded"
                    />

                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Submit anonymously
                    </span>

                  </label>

                  {!form.isAnonymous && (
                    <input
                      type="text"
                      value={form.citizenName}
                      onChange={(e) => {
                        setForm((f) => ({
                          ...f,
                          citizenName: e.target.value,
                        }));
                      }}
                      placeholder="Your name"
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  )}

                  {errors.citizenName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.citizenName}
                    </p>
                  )}

                </div>

                {/* PHOTO */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Photo (optional)
                  </label>

                  {photoPreview ? (

                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">

                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null);

                          setForm((f) => ({
                            ...f,
                            photo: null,
                          }));
                        }}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                      >
                        <X size={14} />
                      </button>

                    </div>

                  ) : (

                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-teal-400 dark:hover:border-teal-600 transition-colors">

                      <Upload
                        size={20}
                        className="text-slate-400 mb-1"
                      />

                      <span className="text-sm text-slate-500">
                        Click to upload photo
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhoto}
                        className="sr-only"
                      />

                    </label>

                  )}

                </div>

              </div>

              {/* RIGHT: MAP */}

              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Pin Location on Map{' '}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">

                  <MapContainer
                    center={CITY_CENTER}
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
                      onPick={setPickedLoc}
                      picked={pickedLoc}
                    />

                  </MapContainer>

                </div>

                {pickedLoc ? (

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">

                    <MapPin size={12} />

                    Location selected:{' '}
                    {pickedLoc[0].toFixed(5)},{' '}
                    {pickedLoc[1].toFixed(5)}

                  </div>

                ) : (

                  <p className="mt-2 text-xs text-slate-500">
                    Click on the map to mark the exact issue location
                  </p>

                )}

                {errors.loc && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.loc}
                  </p>
                )}

              </div>

            </div>

            {/* ACTION BUTTONS */}

            <div className="flex justify-end gap-3 pt-2">

              <button
                type="button"
                onClick={() => {
                  setForm({
                    category: '',
                    description: '',
                    wardId: '',
                    citizenName: '',
                    isAnonymous: false,
                    photo: null,
                  });

                  setPickedLoc(null);
                  setErrors({});
                  setPhotoPreview(null);
                }}
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Reset
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Submit Report
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

function ClickHandler({ onPick, picked }) {
  const map = useMapEvents({
    click(e) {
      onPick([
        e.latlng.lat,
        e.latlng.lng,
      ]);
    },
  });

  React.useEffect(() => {
    if (!picked) return;

    const icon = L.divIcon({
      html: `
        <div style="
          width:18px;
          height:18px;
          border-radius:50%;
          background:#ef4444;
          border:3px solid white;
          box-shadow:0 0 0 3px rgba(239,68,68,0.3)
        "></div>
      `,
      className: '',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    const marker = L.marker(
      picked,
      { icon }
    ).addTo(map);

    return () => {
      map.removeLayer(marker);
    };
  }, [picked, map]);

  return null;
}