import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { ISSUE_CATEGORIES } from '../../data/issues.js';
import { wards } from '../../data/wards.js';
import { CheckCircle, MapPin, Upload, X, Navigation, Video, Image, AlertCircle, ShieldCheck } from 'lucide-react';
import { KOPARGAON_CENTER } from '../../data/wards.js';

const CITY_CENTER = KOPARGAON_CENTER;

const markerIcon = L.divIcon({
  html: `<div style="width:22px;height:22px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 0 0 3px rgba(239,68,68,0.4);animation:pulse 2s infinite"></div>`,
  className: 'custom-map-pin',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function ReportIssue() {
  const { user, profile, submitCitizenReport } = useApp();
  const [form, setForm] = useState({
    category: '',
    description: '',
    wardId: 'W1',
    citizenName: '',
    isAnonymous: false,
    priority: 'Medium',
  });
  const [pickedLoc, setPickedLoc] = useState(null);
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState('image');
  const [submitting, setSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [errors, setErrors] = useState({});
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (user && profile?.full_name) {
      setForm(f => ({ ...f, citizenName: profile.full_name }));
    }
  }, [user, profile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEvidenceFile(file);
    const isVid = file.type.startsWith('video');
    setFileType(isVid ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = ev => setFilePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors(err => ({ ...err, loc: 'Geolocation is not supported by your browser' }));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPickedLoc([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setPickedLoc(CITY_CENTER);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const validate = () => {
    const errs = {};
    if (!form.category) errs.category = 'Please select a category';
    if (!form.description || form.description.length < 10) errs.description = 'Please provide a detailed description (min 10 characters)';
    if (!form.wardId) errs.wardId = 'Please select your ward in Kopargaon';
    if (!pickedLoc) errs.loc = 'Please pin the exact issue location on the map or use GPS';
    if (!form.isAnonymous && !form.citizenName) errs.citizenName = 'Please enter your name or check "Submit anonymously"';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    const payload = {
      ...form,
      lat: pickedLoc[0],
      lng: pickedLoc[1],
      photoUrl: filePreview,
    };

    try {
      const result = await submitCitizenReport(payload, evidenceFile);
      setSubmittedReport({
        id: result?.data?.id || result?.fallbackId || `CF-KPG-${Math.floor(1000 + Math.random() * 9000)}`,
        category: form.category,
        wardId: form.wardId,
        isSupabase: !result?.isMock,
      });
    } catch (err) {
      console.error('Submit issue failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedReport) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <Header title="Report a Civic Issue" subtitle="Kopargaon Civic Infrastructure Monitoring" />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <CheckCircle size={36} className="text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 mb-2">
            Ticket ID: {submittedReport.id}
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Civic Issue Successfully Logged
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            Your complaint for <strong>{submittedReport.category}</strong> has been registered in the Kopargaon municipal triage queue. It is now mapped on the GIS Command Center.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => {
                setSubmittedReport(null);
                setForm({ category: '', description: '', wardId: 'W1', citizenName: '', isAnonymous: false, priority: 'Medium' });
                setPickedLoc(null);
                setFilePreview(null);
                setEvidenceFile(null);
              }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow transition-all"
            >
              Report Another Issue
            </button>
            <a
              href="/citizen/my-reports"
              className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all"
            >
              Track in My Reports →
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
        subtitle="Help Kopargaon Municipal Council identify, verify, and resolve infrastructure issues"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">

              {/* Left Column: Form details */}
              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                    Issue Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select an infrastructure category…</option>
                    {ISSUE_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                </div>

                {/* Ward */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                    Kopargaon Ward / Area <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.wardId}
                    onChange={e => setForm(f => ({ ...f, wardId: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {wards.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                  {errors.wardId && <p className="text-xs text-red-500 mt-1">{errors.wardId}</p>}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                    Reported Severity / Priority
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Low', 'Medium', 'High', 'Critical'].map(p => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setForm(f => ({ ...f, priority: p }))}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                          form.priority === p
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                    Description & Observations <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the problem — landmarks, road hazards, duration of issue, severity…"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none font-medium"
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </div>

                {/* Citizen Reporter */}
                <div>
                  <label className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isAnonymous}
                      onChange={e => setForm(f => ({ ...f, isAnonymous: e.target.checked }))}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Submit anonymously</span>
                  </label>
                  {!form.isAnonymous && (
                    <input
                      type="text"
                      value={form.citizenName}
                      onChange={e => setForm(f => ({ ...f, citizenName: e.target.value }))}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  )}
                  {errors.citizenName && <p className="text-xs text-red-500 mt-1">{errors.citizenName}</p>}
                </div>

                {/* Evidence Upload (Photo / Video to Supabase Storage) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                    Photographic or Video Evidence (Supabase Storage)
                  </label>
                  {filePreview ? (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950">
                      {fileType === 'video' ? (
                        <video src={filePreview} controls className="w-full h-full object-contain" />
                      ) : (
                        <img src={filePreview} alt="Evidence Preview" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => { setFilePreview(null); setEvidenceFile(null); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-850 transition-colors p-4 text-center">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Image size={18} />
                        <Video size={18} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click to upload photo or video</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, MP4 up to 25MB</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Right Column: Map pin picker & GPS location */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Issue Location on Kopargaon Map <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    <Navigation size={12} className={locating ? 'animate-spin' : ''} />
                    {locating ? 'Locating…' : 'Use My GPS'}
                  </button>
                </div>

                <div className="relative flex-1 min-h-[320px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
                  <MapContainer
                    center={CITY_CENTER}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ClickHandler onPick={setPickedLoc} />
                    {pickedLoc && <Marker position={pickedLoc} icon={markerIcon} />}
                  </MapContainer>
                </div>

                {pickedLoc ? (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <MapPin size={13} />
                    Location pinned: {pickedLoc[0].toFixed(5)}, {pickedLoc[1].toFixed(5)}
                  </div>
                ) : (
                  <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                    Click anywhere on the map to pin the exact pothole, water leak, or street light location.
                  </p>
                )}
                {errors.loc && <p className="text-xs text-red-500 mt-1">{errors.loc}</p>}
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setForm({ category: '', description: '', wardId: 'W1', citizenName: '', isAnonymous: false, priority: 'Medium' });
                  setPickedLoc(null);
                  setFilePreview(null);
                  setEvidenceFile(null);
                  setErrors({});
                }}
                className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <span>Syncing with Supabase…</span>
                ) : (
                  <span>Submit Complaint to Kopargaon Queue</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
