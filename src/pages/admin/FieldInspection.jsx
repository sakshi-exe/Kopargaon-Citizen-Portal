import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import Header from '../../components/ui/Header.jsx';
import { QRCodeSVG } from '../../components/ui/QRCodeView.jsx';
import { CompactVideoEvidenceCard } from '../../components/ui/VideoEvidencePlayer.jsx';
import { formatDate } from '../../utils/formatters.js';
import { getWardName } from '../../data/wards.js';
import { getConditionColor } from '../../data/infrastructure.js';
import {
  Wrench,
  Camera,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Clock,
  X,
} from 'lucide-react';

export default function FieldInspection() {
  const { state, dispatch } = useApp();

  const [selectedAssetId, setSelectedAssetId] =
    useState('ROAD-KPG-1028');

  const [inspectorName, setInspectorName] =
    useState('Er. Sandeep Patil');

  const [conditionLevel, setConditionLevel] =
    useState('Poor');

  const [conditionScore, setConditionScore] =
    useState(4);

  const [remarks, setRemarks] = useState('');

  const [photoPreview, setPhotoPreview] =
    useState(null);

  const [photoFile, setPhotoFile] =
    useState(null);

  const [successBanner, setSuccessBanner] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const selectedAsset =
    state.infrastructure.find(
      (item) => item.id === selectedAssetId
    ) || state.infrastructure[0];

  // ─────────────────────────────────────────────
  // PHOTO UPLOAD
  // ─────────────────────────────────────────────

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // 10 MB validation
    if (file.size > 10 * 1024 * 1024) {
      alert('Photo must be smaller than 10MB.');
      return;
    }

    setPhotoFile(file);

    const reader = new FileReader();

    reader.onload = (event) => {
      setPhotoPreview(event.target.result);
    };

    reader.readAsDataURL(file);
  };

  // ─────────────────────────────────────────────
  // SUBMIT INSPECTION
  // ─────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAsset) {
      alert('Please select an infrastructure asset.');
      return;
    }

    if (!inspectorName.trim()) {
      alert('Please enter inspector name.');
      return;
    }

    if (!conditionLevel || !conditionScore) {
      alert('Please select a condition rating.');
      return;
    }

    setSubmitting(true);
    setSuccessBanner(false);

    try {
      dispatch({
        type: 'SUBMIT_INSPECTION',
        payload: {
          assetId: selectedAsset.id,

          inspectorName:
            inspectorName.trim(),

          condition:
            conditionLevel,

          conditionLabel:
            conditionLevel,

          conditionScore:
            conditionScore,

          remarks:
            remarks.trim(),

          evidencePhoto:
            photoPreview || null,

          status: 'Verified',
        },
      });

      setSuccessBanner(true);

      // Reset inspection-specific fields
      setRemarks('');
      setPhotoPreview(null);
      setPhotoFile(null);

      // Scroll to top so success banner is visible
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

    } catch (error) {
      console.error(
        'Inspection submission error:',
        error
      );

      alert(
        'Failed to submit field inspection.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────
  // CONDITION OPTIONS
  // ─────────────────────────────────────────────

  const conditionOptions = [
    {
      label: 'Good',
      score: 8,
      color:
        'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    {
      label: 'Moderate',
      score: 6,
      color:
        'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    },
    {
      label: 'Poor',
      score: 4,
      color:
        'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    },
    {
      label: 'Critical',
      score: 2,
      color:
        'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
    },
  ];

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full overflow-hidden">

      <Header
        title="Field Inspection & QR Verification Hub"
        subtitle="Municipal field-worker interface — inspect, record condition score, and upload photographic evidence"
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* SUCCESS BANNER */}

        {successBanner && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm">

            <div className="flex items-center gap-2.5">

              <CheckCircle2
                size={20}
                className="text-emerald-600 dark:text-emerald-400"
              />

              <div>

                <strong className="block text-sm font-bold">
                  Field Inspection Certified & Recorded!
                </strong>

                <span className="text-xs">
                  Asset {selectedAssetId} condition updated in GIS Command Center and public transparency record.
                </span>

              </div>

            </div>

            <button
              onClick={() =>
                dispatch({
                  type: 'OPEN_ASSET_MODAL',
                  payload: selectedAsset,
                })
              }
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              View Updated QR Profile
            </button>

          </div>
        )}

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT — FORM */}

          <div className="lg:col-span-7 space-y-6">

            <form
              onSubmit={handleSubmit}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-5"
            >

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">

                <div className="flex items-center gap-2">

                  <Wrench
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                    Record On-Site Asset Inspection
                  </h3>

                </div>

                <span className="text-xs font-mono font-bold text-slate-500">
                  {new Date().toLocaleDateString(
                    'en-IN',
                    {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }
                  )}
                </span>

              </div>

              {/* STEP 1 */}

              <div>

                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                  1. Target Infrastructure Asset{' '}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  value={selectedAssetId}
                  onChange={(e) =>
                    setSelectedAssetId(
                      e.target.value
                    )
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >

                  {state.infrastructure.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.id} — {item.name}{' '}
                        (
                        {getWardName(
                          item.wardId
                        )}
                        )
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* STEP 2 */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                    2. Inspector Name
                  </label>

                  <input
                    type="text"
                    value={inspectorName}
                    onChange={(e) =>
                      setInspectorName(
                        e.target.value
                      )
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Inspector name..."
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                    Ward / Sector
                  </label>

                  <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {selectedAsset
                      ? getWardName(
                          selectedAsset.wardId
                        )
                      : '—'}
                  </div>

                </div>

              </div>

              {/* STEP 3 */}

              <div>

                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                  3. Assessed Condition Rating
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

                  {conditionOptions.map(
                    (condition) => (
                      <button
                        type="button"
                        key={condition.label}
                        onClick={() => {
                          setConditionLevel(
                            condition.label
                          );

                          setConditionScore(
                            condition.score
                          );
                        }}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          conditionLevel ===
                          condition.label
                            ? `${condition.color} font-bold shadow-sm`
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >

                        <div className="text-sm">
                          {condition.label}
                        </div>

                        <div className="text-[10px] opacity-75 mt-0.5">
                          {condition.score} / 10
                        </div>

                      </button>
                    )
                  )}

                </div>

              </div>

              {/* STEP 4 */}

              <div>

                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                  4. Photographic Field Evidence
                </label>

                {photoPreview ? (

                  <div className="relative h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">

                    <img
                      src={photoPreview}
                      alt="Field evidence"
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhotoFile(null);
                      }}
                      className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded bg-black/60 text-white text-xs font-bold hover:bg-black/80"
                    >
                      <X size={12} />
                      Change Photo
                    </button>

                  </div>

                ) : (

                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-slate-50 dark:bg-slate-900/40">

                    <Camera
                      size={24}
                      className="text-slate-400 mb-1"
                    />

                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Click to upload geo-tagged field photo
                    </span>

                    <span className="text-[10px] text-slate-400 mt-0.5">
                      JPEG, PNG, HEIC up to 10MB
                    </span>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/heic,image/heif"
                      onChange={
                        handlePhotoUpload
                      }
                      className="sr-only"
                    />

                  </label>

                )}

              </div>

              {/* STEP 5 */}

              <div>

                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                  5. Technical Findings & Action Recommended
                </label>

                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) =>
                    setRemarks(
                      e.target.value
                    )
                  }
                  placeholder="Record observed structural damage, wear and tear, maintenance requirements..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />

              </div>

              {/* SUBMIT */}

              <div className="pt-2">

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >

                  {submitting ? (
                    <>
                      <Clock
                        size={18}
                        className="animate-spin"
                      />
                      Recording Inspection...
                    </>
                  ) : (
                    <>
                      <ShieldCheck
                        size={18}
                      />
                      Certify & Submit Field Inspection
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

          {/* RIGHT */}

          <div className="lg:col-span-5 space-y-6">

            {/* ASSET CARD */}

            {selectedAsset && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">

                <div className="flex items-start justify-between gap-3 mb-3">

                  <div>

                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                      {selectedAsset.id}
                    </span>

                    <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1 leading-snug">
                      {selectedAsset.name}
                    </h4>

                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedAsset.type} ·{' '}
                      {getWardName(
                        selectedAsset.wardId
                      )}
                    </div>

                  </div>

                  <div className="p-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex-shrink-0">

                    <QRCodeSVG
                      value={`https://civicfix.kopargaon.gov.in/asset/${selectedAsset.id}`}
                      size={64}
                    />

                  </div>

                </div>

                <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-700/80 pt-3">

                  <div className="flex justify-between">

                    <span className="text-slate-500">
                      Current Rating:
                    </span>

                    <span
                      className="font-bold"
                      style={{
                        color:
                          getConditionColor(
                            selectedAsset.condition
                          ),
                      }}
                    >
                      {selectedAsset.condition}/10
                      {' '}
                      (
                      {selectedAsset.condition >= 8
                        ? 'Excellent'
                        : selectedAsset.condition >= 7
                        ? 'Good'
                        : selectedAsset.condition >= 5
                        ? 'Moderate'
                        : selectedAsset.condition >= 3
                        ? 'Poor'
                        : 'Critical'}
                      )
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-500">
                      Last Inspection:
                    </span>

                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {formatDate(
                        selectedAsset.lastInspection
                      )}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-500">
                      Contractor:
                    </span>

                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {selectedAsset.contractor ||
                        'KMC PWD'}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-500">
                      Citizen Complaints:
                    </span>

                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {selectedAsset.citizenReports ||
                        0}{' '}
                      tickets
                    </span>

                  </div>

                </div>

                <button
                  onClick={() =>
                    dispatch({
                      type: 'OPEN_ASSET_MODAL',
                      payload:
                        selectedAsset,
                    })
                  }
                  className="w-full mt-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <QrCode size={13} />
                  View Full Public History Profile
                </button>

              </div>
            )}

            {/* VIDEO */}

            {selectedAsset && (
              <CompactVideoEvidenceCard
                title={`${selectedAsset.name} — Progress Verification`}
                projectName={
                  selectedAsset.name
                }
                date="August 2026"
              />
            )}

            {/* INSPECTION LOGS */}

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                <Clock size={14} />
                Recent Field Inspection Audit Logs
              </h4>

              <div className="space-y-3">

                {state.inspections.map(
                  (inspection) => (

                    <div
                      key={inspection.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5"
                    >

                      <div className="flex items-center justify-between font-semibold">

                        <span className="font-mono text-blue-600 dark:text-blue-400">
                          {inspection.assetId}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          {formatDate(
                            inspection.date
                          )}
                        </span>

                      </div>

                      <div className="text-slate-700 dark:text-slate-300">

                        <strong>
                          {
                            inspection.inspectorName
                          }
                        </strong>{' '}

                        logged condition{' '}

                        <strong>
                          {
                            inspection.conditionLabel ||
                            inspection.condition
                          }{' '}
                          (
                          {
                            inspection.condition
                          }
                          /10)
                        </strong>

                      </div>

                      {inspection.remarks && (
                        <p className="text-slate-500 dark:text-slate-400 italic">
                          "{inspection.remarks}"
                        </p>
                      )}

                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold pt-1">

                        <ShieldCheck
                          size={12}
                        />

                        {inspection.status ||
                          'Verified'}

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}