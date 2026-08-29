import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { transformations } from '../../data/transformations.js';
import { getWardName } from '../../data/wards.js';
import { VideoEvidencePlayer } from './VideoEvidencePlayer.jsx';
import { QRCodeSVG } from './QRCodeView.jsx';

import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Clock,
  IndianRupee,
  Layers,
  Check,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  CheckCircle,
  RefreshCw,
  Eye,
  ArrowLeftRight,
  ChevronRight,
} from 'lucide-react';

export default function TransformationShowcase() {
  const { state, dispatch } = useApp();

  const [selectedId, setSelectedId] = useState('TRANS-01');
  const [viewMode, setViewMode] = useState('split');
  const [sliderPos, setSliderPos] = useState(50);
  const [animStage, setAnimStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const current =
    transformations.find((t) => t.id === selectedId) || transformations[0];

  /* =========================================================
     OPEN ASSET QR / TRANSPARENCY MODAL
  ========================================================= */

  const handleOpenAssetQR = (assetId) => {
    const target =
      state.infrastructure.find((i) => i.id === assetId) || {
        id: current.assetId,
        name: current.title,
        type: current.category,
        wardId: current.wardId,
        condition: current.after
          ? current.after.conditionScore
          : 9.5,
        installDate: current.startDate || '2026-06-12',
        lastInspection: current.completedDate || '2026-08-15',
        maintenanceStatus: 'Up-to-date',
        contractor: current.contractor,
        budget: 24500000,
        citizenReports: 23,
        description: current.story,
        maintenanceHistory: [
          {
            date: '2026-06-12',
            action:
              'Issue reported & site inspection verified 18 potholes',
          },
          {
            date: '2026-06-25',
            action:
              'Project approved with ₹2.45 Cr budget allocation',
          },
          {
            date: '2026-07-20',
            action:
              'Dense bituminous macadam base completed',
          },
          {
            date: '2026-08-15',
            action:
              'Final wearing course & thermoplastic lane marking verified',
          },
        ],
      };

    dispatch({
      type: 'OPEN_ASSET_MODAL',
      payload: target,
    });
  };

  /* =========================================================
     SMART ANIMATION
  ========================================================= */

  const triggerTransformationAnimation = () => {
    setViewMode('animate');
    setIsAnimating(true);
    setAnimStage(0);

    setTimeout(() => {
      setAnimStage(1);
    }, 1200);

    setTimeout(() => {
      setAnimStage(2);
      setIsAnimating(false);
    }, 2800);
  };

  /* =========================================================
     SAFE DATA
  ========================================================= */

  const beforeScore =
    current?.before?.conditionScore ??
    current?.before?.score ??
    'Poor';

  const afterScore =
    current?.after?.conditionScore ??
    current?.after?.score ??
    'Improved';

  const wardName = getWardName
    ? getWardName(current.wardId)
    : current.wardId;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">

      {/* =====================================================
          TOP HERO
      ===================================================== */}

      <section
        className="
          relative overflow-hidden
          p-6 sm:p-8
          rounded-3xl
          bg-white
          border border-slate-200
          shadow-lg
        "
      >
        {/* subtle tricolour decoration */}

        <div
          className="
            absolute top-0 left-0 right-0 h-1
            bg-gradient-to-r
            from-orange-400
            via-white
            to-green-600
          "
        />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">

          <div className="max-w-2xl">

            {/* Badge */}

            <div
              className="
                inline-flex items-center gap-2
                px-4 py-2
                rounded-full
                bg-gradient-to-r from-orange-50 via-white to-green-50
                border border-teal-200
                text-teal-600
                text-xs font-bold
                uppercase tracking-wider
              "
            >
              <ShieldCheck size={15} />

              <span>
                KOPARGAON FIX · OFFICIAL CIVIC AUDIT
              </span>
            </div>

            {/* Heading */}

            <h2
              className="
                mt-5
                text-4xl sm:text-5xl
                font-black
                tracking-tight
                leading-[1.05]
                text-slate-900
              "
            >
              From Problem to
              <br />
              <span className="text-slate-900">
                Progress
              </span>
            </h2>

            <p
              className="
                mt-4
                max-w-xl
                text-base sm:text-lg
                leading-7
                text-slate-600
              "
            >
              See how Kopargaon Fix transformed the road.
              Genuine municipal project documentation from
              citizen detection to field verification.
            </p>

            {/* Tricolour line */}

            <div className="flex items-center gap-1 mt-5">
              <span className="h-1 w-14 rounded-full bg-orange-500" />
              <span className="h-1 w-10 rounded-full bg-slate-200" />
              <span className="h-1 w-14 rounded-full bg-green-600" />
            </div>
          </div>

          {/* Actions */}

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">

            <button
              onClick={triggerTransformationAnimation}
              className="
                inline-flex items-center justify-center gap-2
                px-5 py-3
                rounded-xl
                bg-teal-500
                hover:bg-teal-600
                text-white
                text-sm font-bold
                shadow-md shadow-teal-500/20
                transition-all
              "
            >
              <RefreshCw size={17} />

              View Project Transformation
            </button>

            <button
              onClick={() =>
                handleOpenAssetQR(current.assetId)
              }
              className="
                inline-flex items-center justify-center gap-2
                px-5 py-3
                rounded-xl
                bg-white
                hover:bg-slate-50
                border border-slate-300
                text-slate-800
                text-sm font-bold
                transition-all
              "
            >
              <QrCode size={17} />

              Scan Asset QR ({current.assetId})
            </button>

          </div>
        </div>

        {/* ===================================================
            TRANSFORMATION SELECTOR
        =================================================== */}

        <div className="mt-8 pt-6 border-t border-slate-200">

          <div
            className="
              flex gap-2
              overflow-x-auto
              pb-1
              scrollbar-thin
            "
          >
            {transformations.map((item) => {
              const active = item.id === selectedId;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setSliderPos(50);
                    setAnimStage(0);
                    setIsAnimating(false);
                  }}
                  className={`
                    flex-shrink-0
                    px-4 py-2.5
                    rounded-xl
                    border
                    text-xs sm:text-sm
                    font-bold
                    transition-all
                    ${
                      active
                        ? `
                          bg-white
                          border-teal-400
                          text-slate-900
                          shadow-md
                        `
                        : `
                          bg-slate-50
                          border-slate-200
                          text-slate-600
                          hover:bg-white
                          hover:border-teal-200
                        `
                    }
                  `}
                >
                  <span>{item.title}</span>

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
          MAIN SHOWCASE CARD
      ===================================================== */}

      <section
        className="
          overflow-hidden
          rounded-3xl
          bg-white
          border border-slate-200
          shadow-lg
        "
      >

        {/* Top bar */}

        <div
          className="
            flex flex-col sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
            px-6 py-5
            border-b border-slate-200
          "
        >

          <div className="flex items-center gap-3">

            <span
              className="
                px-3 py-1.5
                rounded-lg
                bg-blue-50
                text-blue-600
                text-xs font-black
                font-mono
              "
            >
              {current.assetId}
            </span>

            <span className="text-red-500 text-sm font-black">
              BEFORE
            </span>

            <ArrowRight
              size={18}
              className="text-slate-400"
            />

            <span className="text-emerald-600 text-sm font-black">
              AFTER
            </span>

          </div>

          {/* View controls */}

          <div
            className="
              inline-flex
              rounded-xl
              border border-slate-200
              p-1
              bg-slate-50
              text-xs
              font-medium
              self-start
              sm:self-auto
            "
          >

            <button
              onClick={() => setViewMode('split')}
              className={`
                px-3.5 py-2
                rounded-lg
                transition-all
                ${
                  viewMode === 'split'
                    ? 'bg-teal-500 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-white'
                }
              `}
            >
              Side-by-Side View
            </button>

            <button
              onClick={() => setViewMode('slider')}
              className={`
                px-3.5 py-2
                rounded-lg
                transition-all
                ${
                  viewMode === 'slider'
                    ? 'bg-teal-500 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-white'
                }
              `}
            >
              Interactive Slider
            </button>

            <button
              onClick={triggerTransformationAnimation}
              className={`
                px-3.5 py-2
                rounded-lg
                transition-all
                ${
                  viewMode === 'animate'
                    ? 'bg-teal-500 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-white'
                }
              `}
            >
              Smart Animate
            </button>

          </div>
        </div>

        {/* ===================================================
            VIEW 1 — SIDE BY SIDE
        =================================================== */}

        {viewMode === 'split' && (
          <div className="p-6 bg-slate-50">

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              {/* BEFORE */}

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  bg-white
                  border-2 border-red-200
                  shadow-sm
                "
              >

                <div
                  className="
                    flex items-center justify-between
                    px-5 py-4
                    border-b border-red-100
                    bg-red-50/70
                  "
                >

                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />

                    <span className="text-sm font-black text-red-900">
                      BEFORE OUR PROJECT
                    </span>
                  </div>

                  <span
                    className="
                      px-3 py-1
                      rounded-full
                      bg-red-100
                      text-red-600
                      text-xs font-bold
                    "
                  >
                    Status: Poor Condition
                  </span>

                </div>

                <div className="relative aspect-[4/3] overflow-hidden">

                  <img
                    src={current.before.image}
                    alt="Before Our Project"
                    className="
                      absolute inset-0
                      w-full h-full
                      object-cover
                    "
                  />

                  <div
                    className="
                      absolute
                      top-4 left-4
                      px-3.5 py-1.5
                      rounded-xl
                      bg-red-600
                      text-white
                      text-xs font-extrabold
                      shadow-lg
                    "
                  >
                    ORIGINAL ROAD STATE
                  </div>

                </div>

              </div>

              {/* AFTER */}

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  bg-white
                  border-2 border-emerald-300
                  shadow-sm
                "
              >

                <div
                  className="
                    flex items-center justify-between
                    px-5 py-4
                    border-b border-emerald-100
                    bg-emerald-50/70
                  "
                >

                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />

                    <span className="text-sm font-black text-emerald-950">
                      AFTER OUR PROJECT
                    </span>
                  </div>

                  <span
                    className="
                      px-3 py-1
                      rounded-full
                      bg-emerald-100
                      text-emerald-700
                      text-xs font-bold
                    "
                  >
                    Status: Improved Condition
                  </span>

                </div>

                <div className="relative aspect-[4/3] overflow-hidden">

                  <img
                    src={current.after.image}
                    alt="After Our Project"
                    className="
                      absolute inset-0
                      w-full h-full
                      object-cover
                    "
                  />

                  <div
                    className="
                      absolute
                      top-4 left-4
                      px-3.5 py-1.5
                      rounded-xl
                      bg-emerald-600
                      text-white
                      text-xs font-extrabold
                      shadow-lg
                    "
                  >
                    COMPLETED & INSPECTED
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* ===================================================
            VIEW 2 — INTERACTIVE SLIDER
        =================================================== */}

        {viewMode === 'slider' && (
          <div className="p-6 bg-slate-50">

            <div
              className="
                relative
                aspect-[16/10]
                sm:h-[520px]
                rounded-3xl
                overflow-hidden
                border border-slate-200
                bg-white
                shadow-lg
              "
            >

              {/* AFTER BASE */}

              <img
                src={current.after.image}
                alt="After Our Project"
                className="
                  absolute inset-0
                  w-full h-full
                  object-cover
                "
              />

              {/* AFTER LABEL */}

              <div
                className="
                  absolute
                  top-4 right-4
                  px-3.5 py-1.5
                  rounded-xl
                  bg-emerald-600
                  text-white
                  text-xs font-extrabold
                  shadow-lg
                  z-10
                "
              >
                AFTER OUR PROJECT
              </div>

              {/* BEFORE CLIPPED */}

              <div
                className="
                  absolute
                  inset-y-0 left-0
                  overflow-hidden
                  border-r-4 border-white
                  shadow-2xl
                  z-10
                "
                style={{
                  width: `${sliderPos}%`,
                }}
              >

                <img
                  src={current.before.image}
                  alt="Before Our Project"
                  className="
                    absolute inset-0
                    w-full h-full
                    object-cover
                  "
                  style={{
                    width: '100vw',
                    maxWidth: 'none',
                    minWidth: '100%',
                  }}
                />

                <div
                  className="
                    absolute
                    top-4 left-4
                    px-3.5 py-1.5
                    rounded-xl
                    bg-red-600
                    text-white
                    text-xs font-extrabold
                    shadow-lg
                  "
                >
                  BEFORE OUR PROJECT
                </div>

              </div>

              {/* SLIDER LINE */}

              <div
                className="
                  absolute
                  top-0 bottom-0
                  w-1
                  bg-white
                  cursor-ew-resize
                  z-20
                  flex items-center
                  justify-center
                  pointer-events-none
                "
                style={{
                  left: `${sliderPos}%`,
                }}
              >

                <div
                  className="
                    w-11 h-11
                    rounded-full
                    bg-teal-500
                    border-2 border-white
                    text-white
                    flex items-center
                    justify-center
                    shadow-xl
                    text-sm
                    font-black
                  "
                >
                  ↔
                </div>

              </div>

              {/* RANGE */}

              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) =>
                  setSliderPos(Number(e.target.value))
                }
                className="
                  absolute inset-0
                  w-full h-full
                  opacity-0
                  cursor-ew-resize
                  z-30
                "
              />

            </div>

            <div className="flex justify-between mt-4 text-xs font-bold">

              <span className="text-red-600">
                Before · Poor Condition
              </span>

              <span className="text-emerald-600">
                After · Improved Condition
              </span>

            </div>

          </div>
        )}

        {/* ===================================================
            VIEW 3 — SMART ANIMATE
        =================================================== */}

        {viewMode === 'animate' && (
          <div className="p-6 bg-slate-50">

            <div
              className="
                relative
                rounded-3xl
                overflow-hidden
                border-2 border-slate-200
                aspect-[16/10]
                sm:h-[520px]
                shadow-lg
                bg-white
              "
            >

              {/* IMAGE */}

              <img
                src={
                  animStage === 0
                    ? current.before.image
                    : current.after.image
                }
                alt="Transformation Stage"
                className="
                  absolute inset-0
                  w-full h-full
                  object-cover
                  transition-all
                  duration-1000
                  ease-in-out
                "
              />

              {/* LIGHT OVERLAY */}

              <div
                className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-slate-950/65
                  via-transparent
                  to-transparent
                  pointer-events-none
                "
              />

              {/* STAGE INDICATOR */}

              <div
                className="
                  absolute
                  top-5 left-5
                  right-5
                  flex
                  items-start
                  justify-between
                  gap-4
                  z-10
                "
              >

                <div
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2
                    rounded-xl
                    bg-white/95
                    backdrop-blur-md
                    border border-white
                    shadow-lg
                    text-xs font-bold
                  "
                >

                  {animStage === 0 && (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />

                      <span className="text-red-600">
                        STAGE 1: PROBLEM DETECTION
                      </span>
                    </>
                  )}

                  {animStage === 1 && (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />

                      <span className="text-orange-600">
                        STAGE 2: CIVIC INTERVENTION & RESURFACING
                      </span>
                    </>
                  )}

                  {animStage === 2 && (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />

                      <span className="text-emerald-600">
                        STAGE 3: COMPLETED ROAD
                      </span>
                    </>
                  )}

                </div>

                <span
                  className="
                    hidden sm:inline-flex
                    px-3 py-2
                    rounded-xl
                    bg-white/95
                    backdrop-blur-md
                    border border-white
                    shadow-lg
                    text-xs
                    font-bold
                    text-slate-700
                  "
                >
                  {animStage + 1} / 3
                </span>

              </div>

              {/* BOTTOM CONTENT */}

              <div
                className="
                  absolute
                  bottom-6
                  left-6
                  right-6
                  z-10
                  text-white
                "
              >

                <div className="flex items-end justify-between gap-5">

                  <div>

                    <div className="text-xs font-bold uppercase tracking-wider text-white/80">
                      {current.assetId}
                    </div>

                    <h3 className="mt-1 text-2xl sm:text-3xl font-black">
                      {current.title}
                    </h3>

                    <p className="mt-1 text-sm text-white/80">
                      {animStage === 0 &&
                        'Citizen-reported infrastructure problem identified.'}

                      {animStage === 1 &&
                        'Municipal intervention and resurfacing in progress.'}

                      {animStage === 2 &&
                        'Improvement completed and field verified.'}
                    </p>

                  </div>

                  {!isAnimating && animStage === 2 && (
                    <div
                      className="
                        hidden sm:flex
                        items-center gap-2
                        px-4 py-2
                        rounded-xl
                        bg-emerald-500
                        text-white
                        text-xs font-bold
                      "
                    >
                      <CheckCircle2 size={16} />
                      Verified
                    </div>
                  )}

                </div>

              </div>

            </div>

            {!isAnimating && (
              <button
                onClick={triggerTransformationAnimation}
                className="
                  mt-4
                  inline-flex items-center gap-2
                  px-4 py-2.5
                  rounded-xl
                  bg-teal-500
                  hover:bg-teal-600
                  text-white
                  text-sm font-bold
                  transition-colors
                "
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

        <div className="p-6 sm:p-8 border-t border-slate-200 bg-white">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* STORY */}

            <div
              className="
                lg:col-span-2
                p-5
                rounded-2xl
                bg-gradient-to-br
                from-orange-50
                via-white
                to-green-50
                border border-slate-200
              "
            >

              <div className="flex items-center gap-2 mb-3">

                <Sparkles
                  size={18}
                  className="text-teal-600"
                />

                <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">
                  Verified Transformation Story
                </h3>

              </div>

              <p className="text-sm leading-6 text-slate-600">
                {current.story}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">

                <div className="p-3 rounded-xl bg-white border border-orange-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Ward
                  </div>

                  <div className="mt-1 text-sm font-bold text-slate-800">
                    {wardName || current.wardId}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Category
                  </div>

                  <div className="mt-1 text-sm font-bold text-slate-800">
                    {current.category}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Start Date
                  </div>

                  <div className="mt-1 text-sm font-bold text-slate-800">
                    {current.startDate || '—'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-green-100">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Completed
                  </div>

                  <div className="mt-1 text-sm font-bold text-emerald-600">
                    {current.completedDate || 'Verified'}
                  </div>
                </div>

              </div>

            </div>

            {/* VERIFICATION */}

            <div
              className="
                p-5
                rounded-2xl
                bg-white
                border border-slate-200
                shadow-sm
              "
            >

              <div className="flex items-center gap-2 mb-4">

                <ShieldCheck
                  size={18}
                  className="text-emerald-600"
                />

                <h3 className="text-sm font-black text-slate-800">
                  Verification Status
                </h3>

              </div>

              <div className="space-y-3">

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Field inspection
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 size={14} />
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Project completion
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 size={14} />
                    Confirmed
                  </span>
                </div>

                <div className="flex items-center justify-between">
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
                onClick={() =>
                  handleOpenAssetQR(current.assetId)
                }
                className="
                  mt-5
                  w-full
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-4 py-2.5
                  rounded-xl
                  bg-slate-50
                  hover:bg-teal-50
                  border border-slate-200
                  hover:border-teal-200
                  text-slate-700
                  hover:text-teal-700
                  text-xs font-bold
                  transition-colors
                "
              >
                <QrCode size={15} />
                Open Public Asset Record
              </button>

            </div>

          </div>

        </div>

        {/* ===================================================
            QUANTIFIABLE IMPACT METRICS
        =================================================== */}

        <div
          className="
            p-6 sm:p-8
            border-t border-slate-200
            bg-slate-50
          "
        >

          <h4
            className="
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-slate-500
              mb-4
            "
          >
            Quantified Municipal Impact Metrics
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            {current.metrics?.map((m, idx) => (
              <div
                key={idx}
                className="
                  p-4
                  rounded-2xl
                  bg-white
                  border border-slate-200
                  shadow-sm
                "
              >

                <div
                  className="
                    text-xs
                    text-slate-500
                    font-medium
                    mb-1.5
                  "
                >
                  {m.label}
                </div>

                <div
                  className="
                    text-xs
                    text-red-600
                    line-through
                    opacity-80
                    mb-0.5
                  "
                >
                  Before: {m.before}
                </div>

                <div
                  className="
                    text-sm
                    font-bold
                    text-emerald-600
                    flex items-center gap-1
                  "
                >
                  <Check size={14} />
                  {m.after}
                </div>

              </div>
            ))}

          </div>

        </div>

        {/* ===================================================
            FINAL CLOSING STATEMENT
        =================================================== */}

        <div
          className="
            p-6
            bg-gradient-to-r
            from-orange-50
            via-white
            to-green-50
            border-t border-slate-200
            text-center
            space-y-1
          "
        >

          <div className="flex justify-center items-center gap-1 mb-2">
            <span className="h-1 w-10 rounded-full bg-orange-500" />
            <span className="h-1 w-10 rounded-full bg-slate-200" />
            <span className="h-1 w-10 rounded-full bg-green-600" />
          </div>

          <p className="text-sm font-bold text-teal-600">
            "From a reported problem to a verified improvement."
          </p>

          <p className="text-xs text-slate-500 font-medium">
            "Kopargaon Fix — Making infrastructure visible,
            accountable and better."
          </p>

        </div>

      </section>

    </div>
  );
}