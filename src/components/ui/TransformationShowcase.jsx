import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { transformations } from '../../data/transformations.js';
import { getWardName } from '../../data/wards.js';
import { QRCodeSVG } from './QRCodeView.jsx';

import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Check,
  Eye,
  RefreshCw,
} from 'lucide-react';

export default function TransformationShowcase() {
  const { state, dispatch } = useApp();

  const [selectedId, setSelectedId] = useState(
    transformations?.[0]?.id || 'TRANS-01'
  );

  const [viewMode, setViewMode] = useState('split');
  const [sliderPos, setSliderPos] = useState(50);
  const [animStage, setAnimStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const animationTimerRef = useRef(null);

  const current =
    transformations?.find((item) => item.id === selectedId) ||
    transformations?.[0];

  /*
   * ---------------------------------------------------------
   * SAFETY
   * ---------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  if (!current) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <Sparkles className="text-slate-400" size={24} />
        </div>

        <h3 className="mt-4 text-lg font-black text-slate-900">
          No transformations available
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Verified infrastructure transformation records will appear here.
        </p>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * OPEN ASSET / PUBLIC RECORD
   * ---------------------------------------------------------
   */

  const handleOpenAssetQR = (assetId) => {
    if (!assetId) return;

    const infrastructureList = Array.isArray(state?.infrastructure)
      ? state.infrastructure
      : [];

    const targetFromState = infrastructureList.find(
      (item) => item.id === assetId
    );

    const target =
      targetFromState ||
      {
        id: assetId,
        name: current.title || 'Civic Infrastructure Asset',
        type: current.category || 'Infrastructure',
        wardId: current.wardId || null,
        condition:
          current?.after?.conditionScore ??
          current?.after?.score ??
          9.5,
        installDate: current.startDate || '—',
        lastInspection: current.completedDate || '—',
        maintenanceStatus: 'Up-to-date',
        contractor: current.contractor || 'Municipal Works Department',
        budget: current.budget || 24500000,
        citizenReports: current.citizenReports || 0,
        description:
          current.story ||
          'Verified civic infrastructure transformation record.',
        maintenanceHistory: [
          {
            date: current.startDate || '—',
            action:
              'Issue reported and site inspection initiated.',
          },
          {
            date: current.startDate || '—',
            action:
              'Project approved with municipal budget allocation.',
          },
          {
            date: current.completedDate || '—',
            action:
              'Infrastructure improvement work completed.',
          },
          {
            date: current.completedDate || '—',
            action:
              'Final field inspection and verification completed.',
          },
        ],
      };

    dispatch({
      type: 'OPEN_ASSET_MODAL',
      payload: target,
    });
  };

  /*
   * ---------------------------------------------------------
   * TRANSFORMATION ANIMATION
   * ---------------------------------------------------------
   */

  const triggerTransformationAnimation = () => {
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }

    setViewMode('animate');
    setIsAnimating(true);
    setAnimStage(0);

    const firstTimer = setTimeout(() => {
      setAnimStage(1);
    }, 1200);

    animationTimerRef.current = setTimeout(() => {
      clearTimeout(firstTimer);
      setAnimStage(2);
      setIsAnimating(false);
      animationTimerRef.current = null;
    }, 2800);
  };

  /*
   * ---------------------------------------------------------
   * SAFE DATA
   * ---------------------------------------------------------
   */

  const beforeImage = current?.before?.image;
  const afterImage = current?.after?.image;

  const beforeScore =
    current?.before?.conditionScore ??
    current?.before?.score ??
    'Poor';

  const afterScore =
    current?.after?.conditionScore ??
    current?.after?.score ??
    'Improved';

  const wardName =
    typeof getWardName === 'function'
      ? getWardName(current?.wardId)
      : current?.wardId;

  const metrics = Array.isArray(current?.metrics)
    ? current.metrics
    : [];

  /*
   * ---------------------------------------------------------
   * IMAGE FALLBACK
   * ---------------------------------------------------------
   */

  const ImageFallback = ({ label }) => (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
      <div className="text-center px-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm">
          <Eye size={22} className="text-slate-400" />
        </div>

        <p className="mt-3 text-sm font-bold text-slate-600">
          {label}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Image evidence unavailable
        </p>
      </div>
    </div>
  );

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-10">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">

        {/* Tricolour top line */}

        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-white to-green-600" />

        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-2xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-gradient-to-r from-orange-50 via-white to-green-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-teal-600">

              <ShieldCheck size={15} />

              <span>
                KOPARGAON FIX · OFFICIAL CIVIC AUDIT
              </span>

            </div>

            <h2 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">

              From Problem to

              <br />

              <span className="text-slate-900">
                Progress
              </span>

            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              See how Kopargaon Fix transformed civic infrastructure.
              Genuine municipal project documentation from citizen
              detection to field verification.
            </p>

            <div className="mt-5 flex items-center gap-1">
              <span className="h-1 w-14 rounded-full bg-orange-500" />
              <span className="h-1 w-10 rounded-full bg-slate-200" />
              <span className="h-1 w-14 rounded-full bg-green-600" />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">

            <button
              type="button"
              onClick={triggerTransformationAnimation}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-teal-500/20 transition-all hover:bg-teal-600"
            >
              <RefreshCw size={17} />

              View Project Transformation
            </button>

            <button
              type="button"
              onClick={() =>
                handleOpenAssetQR(current.assetId)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition-all hover:bg-slate-50"
            >
              <QrCode size={17} />

              Scan Asset QR

              <span className="font-mono text-xs text-slate-500">
                ({current.assetId})
              </span>
            </button>

          </div>
        </div>

        {/* ===================================================
            TRANSFORMATION SELECTOR
        =================================================== */}

        <div className="mt-8 border-t border-slate-200 pt-6">

          <div className="flex gap-2 overflow-x-auto pb-1">

            {transformations.map((item) => {
              const active = item.id === selectedId;

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    if (animationTimerRef.current) {
                      clearTimeout(animationTimerRef.current);
                      animationTimerRef.current = null;
                    }

                    setSelectedId(item.id);
                    setSliderPos(50);
                    setAnimStage(0);
                    setIsAnimating(false);
                    setViewMode('split');
                  }}
                  className={`
                    flex-shrink-0 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all sm:text-sm
                    ${
                      active
                        ? 'border-teal-400 bg-white text-slate-900 shadow-md'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-teal-200 hover:bg-white'
                    }
                  `}
                >
                  <span>
                    {item.title}
                  </span>

                  <span className="ml-2 text-[10px] text-slate-500">
                    ({item.assetId})
                  </span>
                </button>
              );
            })}

          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN SHOWCASE
      ===================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">

        {/* Top Bar */}

        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex flex-wrap items-center gap-3">

            <span className="rounded-lg bg-blue-50 px-3 py-1.5 font-mono text-xs font-black text-blue-600">
              {current.assetId}
            </span>

            <span className="text-sm font-black text-red-500">
              BEFORE
            </span>

            <ArrowRight
              size={18}
              className="text-slate-400"
            />

            <span className="text-sm font-black text-emerald-600">
              AFTER
            </span>

          </div>

          {/* View Controls */}

          <div className="flex max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-medium">

            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`
                whitespace-nowrap rounded-lg px-3.5 py-2 transition-all
                ${
                  viewMode === 'split'
                    ? 'bg-teal-500 font-bold text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white'
                }
              `}
            >
              Side-by-Side
            </button>

            <button
              type="button"
              onClick={() => setViewMode('slider')}
              className={`
                whitespace-nowrap rounded-lg px-3.5 py-2 transition-all
                ${
                  viewMode === 'slider'
                    ? 'bg-teal-500 font-bold text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white'
                }
              `}
            >
              Interactive Slider
            </button>

            <button
              type="button"
              onClick={triggerTransformationAnimation}
              className={`
                whitespace-nowrap rounded-lg px-3.5 py-2 transition-all
                ${
                  viewMode === 'animate'
                    ? 'bg-teal-500 font-bold text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white'
                }
              `}
            >
              Smart Animate
            </button>

          </div>
        </div>

        {/* ===================================================
            SIDE BY SIDE
        =================================================== */}

        {viewMode === 'split' && (
          <div className="bg-slate-50 p-4 sm:p-6">

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

              {/* BEFORE */}

              <div className="overflow-hidden rounded-2xl border-2 border-red-200 bg-white shadow-sm">

                <div className="flex flex-col gap-3 border-b border-red-100 bg-red-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />

                    <span className="text-sm font-black text-red-900">
                      BEFORE OUR PROJECT
                    </span>
                  </div>

                  <span className="w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                    Status: {beforeScore}
                  </span>

                </div>

                <div className="relative aspect-[4/3] overflow-hidden">

                  {beforeImage ? (
                    <img
                      src={beforeImage}
                      alt={`Before ${current.title}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <ImageFallback label="Before image" />
                  )}

                  <div className="absolute left-4 top-4 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-lg">
                    ORIGINAL ROAD STATE
                  </div>

                </div>
              </div>

              {/* AFTER */}

              <div className="overflow-hidden rounded-2xl border-2 border-emerald-300 bg-white shadow-sm">

                <div className="flex flex-col gap-3 border-b border-emerald-100 bg-emerald-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />

                    <span className="text-sm font-black text-emerald-950">
                      AFTER OUR PROJECT
                    </span>
                  </div>

                  <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    Status: {afterScore}
                  </span>

                </div>

                <div className="relative aspect-[4/3] overflow-hidden">

                  {afterImage ? (
                    <img
                      src={afterImage}
                      alt={`After ${current.title}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <ImageFallback label="After image" />
                  )}

                  <div className="absolute left-4 top-4 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-lg">
                    COMPLETED & INSPECTED
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* ===================================================
            INTERACTIVE SLIDER
        =================================================== */}

        {viewMode === 'slider' && (
          <div className="bg-slate-50 p-4 sm:p-6">

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">

              {/* AFTER BASE */}

              {afterImage ? (
                <img
                  src={afterImage}
                  alt={`After ${current.title}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <ImageFallback label="After image" />
              )}

              {/* AFTER LABEL */}

              <div className="absolute right-4 top-4 z-10 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-lg">
                AFTER OUR PROJECT
              </div>

              {/* BEFORE CLIPPED */}

              <div
                className="absolute inset-y-0 left-0 z-10 overflow-hidden border-r-4 border-white shadow-2xl"
                style={{
                  width: `${sliderPos}%`,
                }}
              >

                <div className="relative h-full w-full">

                  {beforeImage ? (
                    <img
                      src={beforeImage}
                      alt={`Before ${current.title}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <ImageFallback label="Before image" />
                  )}

                  <div className="absolute left-4 top-4 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-lg">
                    BEFORE OUR PROJECT
                  </div>

                </div>
              </div>

              {/* SLIDER HANDLE */}

              <div
                className="pointer-events-none absolute bottom-0 top-0 z-20 w-1 bg-white shadow-md"
                style={{
                  left: `${sliderPos}%`,
                }}
              >
                <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-teal-500 text-sm font-black text-white shadow-xl">
                  ↔
                </div>
              </div>

              {/* RANGE CONTROL */}

              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={sliderPos}
                onChange={(event) =>
                  setSliderPos(Number(event.target.value))
                }
                aria-label="Compare before and after images"
                className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
              />

            </div>

            <div className="mt-4 flex flex-col gap-2 text-xs font-bold sm:flex-row sm:items-center sm:justify-between">

              <span className="text-red-600">
                Before · {beforeScore}
              </span>

              <span className="text-emerald-600">
                After · {afterScore}
              </span>

            </div>
          </div>
        )}

        {/* ===================================================
            SMART ANIMATION
        =================================================== */}

        {viewMode === 'animate' && (
          <div className="bg-slate-50 p-4 sm:p-6">

            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-lg">

              {(
                animStage === 0
                  ? beforeImage
                  : afterImage
              ) ? (
                <img
                  src={
                    animStage === 0
                      ? beforeImage
                      : afterImage
                  }
                  alt={`${current.title} transformation stage`}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
                />
              ) : (
                <ImageFallback label="Transformation image" />
              )}

              {/* Overlay */}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />

              {/* Stage Indicator */}

              <div className="absolute left-4 right-4 top-5 z-10 flex items-start justify-between gap-4">

                <div className="inline-flex max-w-[calc(100%-50px)] items-center gap-2 rounded-xl border border-white bg-white/95 px-4 py-2 text-xs font-bold shadow-lg backdrop-blur-md">

                  {animStage === 0 && (
                    <>
                      <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-red-500" />

                      <span className="text-red-600">
                        STAGE 1: PROBLEM DETECTION
                      </span>
                    </>
                  )}

                  {animStage === 1 && (
                    <>
                      <span className="h-2.5 w-2.5 flex-shrink-0 animate-pulse rounded-full bg-orange-500" />

                      <span className="text-orange-600">
                        STAGE 2: CIVIC INTERVENTION
                      </span>
                    </>
                  )}

                  {animStage === 2 && (
                    <>
                      <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-500" />

                      <span className="text-emerald-600">
                        STAGE 3: COMPLETED & VERIFIED
                      </span>
                    </>
                  )}

                </div>

                <span className="hidden flex-shrink-0 rounded-xl border border-white bg-white/95 px-3 py-2 text-xs font-bold text-slate-700 shadow-lg backdrop-blur-md sm:inline-flex">
                  {animStage + 1} / 3
                </span>

              </div>

              {/* Bottom Content */}

              <div className="absolute bottom-6 left-6 right-6 z-10 text-white">

                <div className="flex items-end justify-between gap-5">

                  <div className="min-w-0">

                    <div className="text-xs font-bold uppercase tracking-wider text-white/80">
                      {current.assetId}
                    </div>

                    <h3 className="mt-1 text-2xl font-black sm:text-3xl">
                      {current.title}
                    </h3>

                    <p className="mt-1 max-w-2xl text-sm text-white/80">
                      {animStage === 0 &&
                        'Citizen-reported infrastructure problem identified.'}

                      {animStage === 1 &&
                        'Municipal intervention and infrastructure improvement in progress.'}

                      {animStage === 2 &&
                        'Improvement completed and field verified.'}
                    </p>

                  </div>

                  {!isAnimating && animStage === 2 && (
                    <div className="hidden flex-shrink-0 items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white sm:flex">
                      <CheckCircle2 size={16} />
                      Verified
                    </div>
                  )}

                </div>
              </div>

            </div>

            {!isAnimating && (
              <button
                type="button"
                onClick={triggerTransformationAnimation}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-600"
              >
                <RefreshCw size={16} />
                Replay Transformation
              </button>
            )}

          </div>
        )}

        {/* ===================================================
            PROJECT INFORMATION
        =================================================== */}

        <div className="border-t border-slate-200 bg-white p-6 sm:p-8">

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* STORY */}

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-orange-50 via-white to-green-50 p-5 lg:col-span-2">

              <div className="mb-3 flex items-center gap-2">

                <Sparkles
                  size={18}
                  className="text-teal-600"
                />

                <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">
                  Verified Transformation Story
                </h3>

              </div>

              <p className="text-sm leading-6 text-slate-600">
                {current.story ||
                  'Verified civic infrastructure transformation record.'}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

                <div className="rounded-xl border border-orange-100 bg-white p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Ward
                  </div>

                  <div className="mt-1 text-sm font-bold text-slate-800">
                    {wardName || current.wardId || '—'}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Category
                  </div>

                  <div className="mt-1 text-sm font-bold text-slate-800">
                    {current.category || '—'}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Start Date
                  </div>

                  <div className="mt-1 text-sm font-bold text-slate-800">
                    {current.startDate || '—'}
                  </div>
                </div>

                <div className="rounded-xl border border-green-100 bg-white p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Completed
                  </div>

                  <div className="mt-1 text-sm font-bold text-emerald-600">
                    {current.completedDate || 'Verified'}
                  </div>
                </div>

              </div>
            </div>

            {/* VERIFICATION */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="mb-4 flex items-center gap-2">

                <ShieldCheck
                  size={18}
                  className="text-emerald-600"
                />

                <h3 className="text-sm font-black text-slate-800">
                  Verification Status
                </h3>

              </div>

              <div className="space-y-3">

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Field inspection
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 size={14} />
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Project completion
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 size={14} />
                    Confirmed
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Public audit
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600">
                    <Eye size={14} />
                    Available
                  </span>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  handleOpenAssetQR(current.assetId)
                }
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
              >
                <QrCode size={15} />
                Open Public Asset Record
              </button>

            </div>
          </div>
        </div>

        {/* ===================================================
            IMPACT METRICS
        =================================================== */}

        <div className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8">

          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
            Quantified Municipal Impact Metrics
          </h4>

          {metrics.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

              {metrics.map((metric, index) => (
                <div
                  key={`${metric.label || 'metric'}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >

                  <div className="mb-1.5 text-xs font-medium text-slate-500">
                    {metric.label || 'Metric'}
                  </div>

                  {metric.before !== undefined && (
                    <div className="mb-0.5 text-xs text-red-600 line-through opacity-80">
                      Before: {metric.before}
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                    <Check size={14} />

                    {metric.after ?? 'Improved'}
                  </div>

                </div>
              ))}

            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">

              <p className="text-sm font-semibold text-slate-600">
                Impact metrics will be published with the verified project record.
              </p>

            </div>
          )}

        </div>

        {/* ===================================================
            CLOSING STATEMENT
        =================================================== */}

        <div className="space-y-1 border-t border-slate-200 bg-gradient-to-r from-orange-50 via-white to-green-50 p-6 text-center">

          <div className="mb-2 flex items-center justify-center gap-1">
            <span className="h-1 w-10 rounded-full bg-orange-500" />
            <span className="h-1 w-10 rounded-full bg-slate-200" />
            <span className="h-1 w-10 rounded-full bg-green-600" />
          </div>

          <p className="text-sm font-bold text-teal-600">
            "From a reported problem to a verified improvement."
          </p>

          <p className="text-xs font-medium text-slate-500">
            "Kopargaon Fix — Making infrastructure visible,
            accountable and better."
          </p>

        </div>

      </section>
    </div>
  );
}