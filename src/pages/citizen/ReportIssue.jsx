import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { ISSUE_CATEGORIES } from '../../data/issues.js';
import { wards } from '../../data/wards.js';
import { CheckCircle2, MapPin, Upload, X, ShieldCheck, AlertCircle, FileText, Send } from 'lucide-react';
import { KOPARGAON_CENTER } from '../../data/wards.js';

const CITY_CENTER = KOPARGAON_CENTER;

export default function ReportIssue() {
  const { dispatch } = useApp();
  const [form, setForm] = useState({
    category: '', description: '', wardId: '', citizenName: '', isAnonymous: false, photo: null,
  });
  const [pickedLoc, setPickedLoc] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, photo: file.name }));
    const reader = new FileReader();
    reader.onload = ev => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.category) errs.category = 'Please select a category';
    if (!form.description || form.description.length < 10) errs.description = 'Please provide a description (min 10 chars)';
    if (!form.wardId) errs.wardId = 'Please select your ward';
    if (!pickedLoc) errs.loc = 'Please click on the map to mark the exact location';
    if (!form.isAnonymous && !form.citizenName) errs.citizenName = 'Please enter your name or check anonymous';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    dispatch({
      type: 'SUBMIT_ISSUE',
      payload: {
        ...form,
        lat: pickedLoc[0],
        lng: pickedLoc[1],
        citizenName: form.isAnonymous ? 'Anonymous Citizen' : form.citizenName,
      }
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-full bg-[#F8FAFC] dark:bg-[#090D16]">
        <Header title="Report Civic Issue" subtitle="Submission Confirmation" />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-3xl flex items-center justify-center mb-4 border border-emerald-300 dark:border-emerald-700 shadow-sm">
            <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Grievance Registered Successfully
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-medium">
            Your ticket has been logged into the Kopargaon Municipal Council GIS registry. Field engineers and municipal ward officers will review and inspect the location.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({ category: '', description: '', wardId: '', citizenName: '', isAnonymous: false, photo: null });
                setPickedLoc(null);
                setPhotoPreview(null);
              }}
              className="px-5 py-2.5 bg-navy-700 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Report Another Issue
            </button>
            <Link
              to="/citizen/my-reports"
              className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              View My Reports & Tracking
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Report a Civic Issue"
        subtitle="Submit potholes, water supply, drainage, or street light problems directly to Kopargaon Municipal Council"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Form fields */}
              <div className="space-y-4 bg-white dark:bg-[#0F172A] p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <FileText size={16} className="text-navy-600 dark:text-saffron-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Issue Details
                  </h3>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500"
                  >
                    <option value="">Select an issue category…</option>
                    {ISSUE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.category}</p>}
                </div>

                {/* Ward */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Ward / Locality <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.wardId}
                    onChange={e => setForm(f => ({ ...f, wardId: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-500"
                  >
                    <option value="">Select administrative ward…</option>
                    {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                  {errors.wardId && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.wardId}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Description & Landmarks <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Provide specific details (e.g. Near Bus Stand, deep pothole causing traffic slowdown)..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none font-medium"
                  />
                  {errors.description && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.description}</p>}
                </div>

                {/* Reporter */}
                <div>
                  <label className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isAnonymous}
                      onChange={e => setForm(f => ({ ...f, isAnonymous: e.target.checked }))}
                      className="rounded text-navy-600 focus:ring-navy-500"
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Submit anonymously</span>
                  </label>
                  {!form.isAnonymous && (
                    <input
                      type="text"
                      value={form.citizenName}
                      onChange={e => setForm(f => ({ ...f, citizenName: e.target.value }))}
                      placeholder="Your Full Name"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-500 font-medium"
                    />
                  )}
                  {errors.citizenName && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.citizenName}</p>}
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Photo Evidence (Optional)
                  </label>
                  {photoPreview ? (
                    <div className="relative w-full h-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setPhotoPreview(null); setForm(f => ({ ...f, photo: null })); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-navy-400 dark:hover:border-navy-600 transition-colors bg-slate-50/50 dark:bg-slate-900/40">
                      <Upload size={18} className="text-slate-400 mb-1" />
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Click to upload photo evidence</span>
                      <input type="file" accept="image/*" onChange={handlePhoto} className="sr-only" />
                    </label>
                  )}
                </div>
              </div>

              {/* Right: Map picker */}
              <div className="bg-white dark:bg-[#0F172A] p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-red-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Pin Location on GIS Map <span className="text-red-500">*</span>
                      </h3>
                    </div>
                    {pickedLoc && (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        ✓ Point Selected
                      </span>
                    )}
                  </div>

                  <div className="relative h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <MapContainer
                      center={CITY_CENTER}
                      zoom={14}
                      style={{ height: '100%', width: '100%' }}
                      zoomControl={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <ClickHandler onPick={setPickedLoc} picked={pickedLoc} />
                    </MapContainer>
                  </div>

                  {pickedLoc ? (
                    <div className="mt-2.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <MapPin size={13} className="text-emerald-600" />
                      GPS Coords: {pickedLoc[0].toFixed(5)}, {pickedLoc[1].toFixed(5)} · Kopargaon
                    </div>
                  ) : (
                    <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Click anywhere on the map to place an accurate GPS pin for municipal field workers.
                    </p>
                  )}
                  {errors.loc && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.loc}</p>}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ category:'', description:'', wardId:'', citizenName:'', isAnonymous:false, photo:null });
                      setPickedLoc(null);
                      setErrors({});
                    }}
                    className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-saffron-500 hover:bg-saffron-400 text-slate-950 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2"
                  >
                    <Send size={14} /> Submit Issue Report
                  </button>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

function ClickHandler({ onPick, picked }) {
  const map = useMapEvents({ click(e) { onPick([e.latlng.lat, e.latlng.lng]); } });
  React.useEffect(() => {
    if (!picked) return;
    const icon = L.divIcon({
      html: `<div style="width:20px;height:20px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 0 0 3px rgba(239,68,68,0.4)"></div>`,
      className: '', iconSize: [20, 20], iconAnchor: [10, 10],
    });
    const m = L.marker(picked, { icon }).addTo(map);
    return () => map.removeLayer(m);
  }, [picked, map]);
  return null;
}

