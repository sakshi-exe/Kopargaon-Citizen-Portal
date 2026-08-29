import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { ISSUE_CATEGORIES } from '../../data/issues.js';
import { wards, KOPARGAON_CENTER } from '../../data/wards.js';
import { CheckCircle, MapPin, Upload, X, Map, ClipboardList, Camera, Send, PencilLine } from 'lucide-react';

const CITY_CENTER = KOPARGAON_CENTER;
const steps = [
  { number: '01', label: 'Identify Issue', icon: ClipboardList },
  { number: '02', label: 'Add Location', icon: Map },
  { number: '03', label: 'Add Evidence', icon: Camera },
  { number: '04', label: 'Submit Report', icon: Send },
];

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
    if (!pickedLoc) errs.loc = 'Please click on the map to select a location';
    if (!form.isAnonymous && !form.citizenName) errs.citizenName = 'Please enter your name or submit anonymously';
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
        citizenName: form.isAnonymous ? 'Anonymous' : form.citizenName,
      }
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Report issue" />
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF9ED]">
            <CheckCircle size={32} className="text-[#138808]" />
          </div>
          <h2 className="mb-2 text-2xl font-black text-[#0B1324]">Issue reported successfully</h2>
          <p className="mb-6 max-w-sm text-sm leading-relaxed text-[#52627A]">
            Your report has been submitted and is now visible on the city map. You can track its status under My Reports.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setSubmitted(false)} className="rounded-xl bg-[#0B1324] px-4 py-2.5 text-sm font-bold text-white">Report another issue</button>
            <a href="/citizen/my-reports" className="rounded-xl border border-[#E8EDF2] px-4 py-2.5 text-sm font-bold text-[#0B1324]">View my reports</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Header title="Report a civic issue" subtitle="Submit and track the problem that needs attention" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="grid gap-3 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.number} className={`rounded-[22px] border p-4 ${index === 0 ? 'border-[#FF9933]/20 bg-[#FFF7F0]' : 'border-[#E8EDF2] bg-white'}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${index === 0 ? 'bg-[#FF9933] text-white' : 'bg-[#F3F6FA] text-[#0B1324]'}`}>
                    <step.icon size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52627A]">{step.number}</div>
                    <div className="text-sm font-black text-[#0B1324]">{step.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="rounded-[30px] border border-[#E8EDF2] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#0B1324]">Issue category <span className="text-[#D93025]">*</span></label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full rounded-2xl border border-[#E8EDF2] bg-[#FFFDF9] px-3 py-3 text-sm text-[#0B1324] focus:outline-none focus:ring-2 focus:ring-[#FF9933]/30">
                    <option value="">Select a category…</option>
                    {ISSUE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-[#D93025]">{errors.category}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#0B1324]">Ward / area <span className="text-[#D93025]">*</span></label>
                  <select value={form.wardId} onChange={e => setForm(f => ({ ...f, wardId: e.target.value }))} className="w-full rounded-2xl border border-[#E8EDF2] bg-[#FFFDF9] px-3 py-3 text-sm text-[#0B1324] focus:outline-none focus:ring-2 focus:ring-[#FF9933]/30">
                    <option value="">Select your ward…</option>
                    {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                  {errors.wardId && <p className="mt-1 text-xs text-[#D93025]">{errors.wardId}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#0B1324]">Description <span className="text-[#D93025]">*</span></label>
                  <textarea rows={5} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the location, urgency, and the impact this issue is causing…" className="w-full resize-none rounded-2xl border border-[#E8EDF2] bg-[#FFFDF9] px-3 py-3 text-sm text-[#0B1324] focus:outline-none focus:ring-2 focus:ring-[#FF9933]/30" />
                  {errors.description && <p className="mt-1 text-xs text-[#D93025]">{errors.description}</p>}
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#0B1324]">
                    <input type="checkbox" checked={form.isAnonymous} onChange={e => setForm(f => ({ ...f, isAnonymous: e.target.checked }))} className="h-4 w-4 rounded border-[#C7D3E4] text-[#138808] focus:ring-[#138808]" />
                    Submit anonymously
                  </label>
                  {!form.isAnonymous && (
                    <input type="text" value={form.citizenName} onChange={e => setForm(f => ({ ...f, citizenName: e.target.value }))} placeholder="Your name" className="w-full rounded-2xl border border-[#E8EDF2] bg-[#FFFDF9] px-3 py-3 text-sm text-[#0B1324] focus:outline-none focus:ring-2 focus:ring-[#FF9933]/30" />
                  )}
                  {errors.citizenName && <p className="mt-1 text-xs text-[#D93025]">{errors.citizenName}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#0B1324]">Proof / evidence</label>
                  {photoPreview ? (
                    <div className="relative h-32 overflow-hidden rounded-2xl border border-[#E8EDF2] bg-[#FFFDF9]">
                      <img src={photoPreview} alt="Evidence preview" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => { setPhotoPreview(null); setForm(f => ({ ...f, photo: null })); }} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-[#E8EDF2] bg-[#FFFDF9] text-center text-[#52627A] hover:border-[#FF9933]/40">
                      <Upload size={20} className="mb-2 text-[#FF9933]" />
                      <span className="text-sm font-semibold">Upload photo evidence</span>
                      <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#0B1324]">Pin location on map <span className="text-[#D93025]">*</span></label>
                  <div className="h-[400px] overflow-hidden rounded-[26px] border border-[#E8EDF2] bg-[#EEF6F9]">
                    <MapContainer center={CITY_CENTER} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl>
                      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <ClickHandler onPick={setPickedLoc} picked={pickedLoc} />
                    </MapContainer>
                  </div>
                </div>

                {pickedLoc ? (
                  <div className="flex items-center gap-2 rounded-2xl border border-[#DFF3E2] bg-[#F1FFF5] px-3 py-2 text-xs font-semibold text-[#117A27]">
                    <MapPin size={12} /> Location selected: {pickedLoc[0].toFixed(5)}, {pickedLoc[1].toFixed(5)}
                  </div>
                ) : (
                  <div className="text-xs text-[#52627A]">Click on the map to mark the exact location.</div>
                )}
                {errors.loc && <p className="text-xs text-[#D93025]">{errors.loc}</p>}

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setForm({ category:'',description:'',wardId:'',citizenName:'',isAnonymous:false,photo:null }); setPickedLoc(null); setErrors({}); }} className="rounded-xl border border-[#E8EDF2] bg-white px-5 py-2.5 text-sm font-bold text-[#0B1324]">Reset</button>
                  <button type="submit" className="rounded-xl bg-[#0B1324] px-5 py-2.5 text-sm font-bold text-white">Submit report</button>
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
      html: `<div style="width:18px;height:18px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 0 0 3px rgba(239,68,68,0.3)"></div>`,
      className: '', iconSize: [18, 18], iconAnchor: [9, 9],
    });
    const m = L.marker(picked, { icon }).addTo(map);
    return () => map.removeLayer(m);
  }, [map, picked]);

  return null;
}
