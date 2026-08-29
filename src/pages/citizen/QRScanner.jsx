import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  QrCode,
  Search,
  Camera,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ScanLine,
} from 'lucide-react';

import Header from '../../components/ui/Header.jsx';
import { useApp } from '../../context/AppContext.jsx';

/* ============================================================
   SAMPLE KOPARGAON INFRASTRUCTURE ASSETS
============================================================ */

const SAMPLE_ASSETS = [
  {
    id: 'ROAD-KPG-1028',
    name: 'Kopargaon Main Road',
    type: 'Road',
    ward: 'Ward 1',
    area: 'Shivaji Chowk',
    condition: 4,
    conditionLabel: 'Poor',
    status: 'Requires Attention',
  },
  {
    id: 'HOSP-KPG-0512',
    name: 'Kopargaon Sub-District Hospital',
    type: 'Hospital',
    ward: 'Ward 1',
    area: 'Shivaji Chowk',
    condition: 8,
    conditionLabel: 'Good',
    status: 'Verified',
  },
  {
    id: 'BLDG-KPG-0312',
    name: 'Kopargaon Municipal Council',
    type: 'Public Building',
    ward: 'Ward 1',
    area: 'Main Road',
    condition: 7,
    conditionLabel: 'Good',
    status: 'Verified',
  },
  {
    id: 'DRAIN-KPG-0138',
    name: 'Kopargaon Main Drain',
    type: 'Drainage',
    ward: 'Ward 3',
    area: 'Market Road',
    condition: 9,
    conditionLabel: 'Excellent',
    status: 'Certified',
  },
];


/* ============================================================
   VISUAL QR
   NOTE:
   This is intentionally kept as a visual placeholder.
   It does NOT require another QR-generation dependency.
============================================================ */

function QRVisual({ assetId, large = false }) {
  const cells = Array.from({ length: 49 }, (_, index) => {
    const row = Math.floor(index / 7);
    const col = index % 7;

    const finder =
      (row < 3 && col < 3) ||
      (row < 3 && col > 3) ||
      (row > 3 && col < 3);

    const finderBorder =
      finder &&
      (
        ((row === 0 || row === 2) && col <= 2) ||
        ((col === 0 || col === 2) && row <= 2) ||
        ((row === 0 || row === 2) && col >= 4) ||
        ((col === 4 || col === 6) && row <= 2) ||
        ((row === 4 || row === 6) && col <= 2) ||
        ((col === 0 || col === 2) && row >= 4)
      );

    const pattern =
      (row * 7 + col * 13 + assetId.length * 3) % 5 < 2;

    return {
      filled: finderBorder || pattern,
    };
  });

  return (
    <div
      className={`
        relative
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-3
        grid
        grid-cols-7
        gap-0.5
        shadow-sm
        ${large ? 'w-64 h-64' : 'w-16 h-16'}
      `}
    >
      {cells.map((cell, index) => (
        <div
          key={index}
          className={`
            aspect-square
            rounded-[1px]
            ${cell.filled ? 'bg-slate-950' : 'bg-white'}
          `}
        />
      ))}
    </div>
  );
}


/* ============================================================
   CONDITION STYLES
============================================================ */

function getConditionClasses(score) {
  if (score >= 8) {
    return {
      badge:
        'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: 'text-emerald-600',
    };
  }

  if (score >= 6) {
    return {
      badge:
        'bg-amber-50 text-amber-700 border-amber-200',
      icon: 'text-amber-600',
    };
  }

  return {
    badge:
      'bg-red-50 text-red-700 border-red-200',
    icon: 'text-red-600',
  };
}


/* ============================================================
   QR SCANNER PAGE
============================================================ */

export default function QRScanner() {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const [assetId, setAssetId] = useState('');
  const [scanMessage, setScanMessage] = useState('');


  /* ==========================================================
     OPEN ASSET
  ========================================================== */

  const openAsset = (asset) => {
    dispatch({
      type: 'SET_SELECTED_ASSET',
      payload: asset,
    });

    setScanMessage(
      `Verified asset found: ${asset.id}`
    );
  };


  /* ==========================================================
     SEARCH / SCAN ASSET
  ========================================================== */

  const handleScan = () => {
    const value = assetId.trim().toUpperCase();

    if (!value) {
      setScanMessage(
        'Please enter an Asset ID first.'
      );
      return;
    }

    const asset = SAMPLE_ASSETS.find(
      (item) =>
        item.id.toUpperCase() === value
    );

    if (asset) {
      openAsset(asset);
      return;
    }

    setScanMessage(
      `No registered asset found for "${value}".`
    );
  };


  /* ==========================================================
     ENTER KEY
  ========================================================== */

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleScan();
    }
  };


  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <div className="flex flex-col h-full min-h-0 bg-transparent">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <Header
        title="CivicFix QR Infrastructure Scanner"
        subtitle="Scan or search any civic infrastructure tag in Kopargaon for verified public audit data"
      />


      {/* ======================================================
          SCROLLABLE CONTENT
      ====================================================== */}

      <main className="flex-1 overflow-y-auto">

        <div className="relative min-h-full overflow-hidden">

          {/* --------------------------------------------------
              TRICOLOUR BACKGROUND
          -------------------------------------------------- */}

          <div
            className="
              absolute
              inset-0
              pointer-events-none
              bg-gradient-to-br
              from-orange-100
              via-white
              to-emerald-100
            "
          />

          <div
            className="
              absolute
              -top-40
              -left-40
              w-[500px]
              h-[500px]
              rounded-full
              bg-orange-300/20
              blur-3xl
              pointer-events-none
            "
          />

          <div
            className="
              absolute
              -bottom-40
              -right-40
              w-[500px]
              h-[500px]
              rounded-full
              bg-emerald-300/20
              blur-3xl
              pointer-events-none
            "
          />


          {/* --------------------------------------------------
              CONTENT WRAPPER
          -------------------------------------------------- */}

          <div
            className="
              relative
              z-10
              max-w-7xl
              mx-auto
              px-5
              sm:px-8
              py-7
              sm:py-9
            "
          >


            {/* =================================================
                TOP INTRO
            ================================================= */}

            <div className="mb-7">

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="
                  inline-flex
                  items-center
                  gap-2
                  mb-5
                  text-sm
                  font-semibold
                  text-slate-600
                  hover:text-emerald-700
                  transition-colors
                "
              >
                <ArrowLeft size={17} />
                Back
              </button>


              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

                <div>

                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-3
                      py-1.5
                      rounded-full
                      bg-white/80
                      border
                      border-emerald-200
                      shadow-sm
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-emerald-700
                    "
                  >
                    <Sparkles size={14} />
                    Verified Civic Infrastructure
                  </div>


                  <h1
                    className="
                      mt-3
                      text-2xl
                      sm:text-3xl
                      font-extrabold
                      tracking-tight
                      text-slate-900
                    "
                  >
                    Scan Infrastructure QR
                  </h1>


                  <p
                    className="
                      mt-2
                      max-w-2xl
                      text-sm
                      sm:text-base
                      leading-relaxed
                      text-slate-600
                    "
                  >
                    Verify civic assets, inspect their condition,
                    and access transparent infrastructure information
                    across Kopargaon.
                  </p>

                </div>


                <div
                  className="
                    hidden
                    lg:flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-2xl
                    bg-white/80
                    border
                    border-slate-200
                    shadow-sm
                  "
                >
                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      bg-gradient-to-br
                      from-orange-400
                      via-white
                      to-emerald-500
                      border
                      border-slate-200
                    "
                  >
                    <QrCode
                      size={21}
                      className="text-slate-800"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Registered Assets
                    </p>

                    <p className="text-lg font-extrabold text-slate-900">
                      {SAMPLE_ASSETS.length}
                    </p>
                  </div>
                </div>

              </div>
            </div>


            {/* =================================================
                MAIN SCANNER CARD
            ================================================= */}

            <section className="max-w-4xl mx-auto">

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[28px]
                  bg-white/95
                  border
                  border-slate-200
                  shadow-[0_20px_60px_rgba(15,23,42,0.12)]
                "
              >

                {/* ---------------------------------------------
                    TOP TRICOLOUR LINE
                --------------------------------------------- */}

                <div
                  className="
                    absolute
                    top-0
                    left-0
                    right-0
                    h-1.5
                    bg-gradient-to-r
                    from-orange-500
                    via-white
                    to-emerald-600
                  "
                />


                {/* ---------------------------------------------
                    DECORATIVE BLOBS
                --------------------------------------------- */}

                <div
                  className="
                    absolute
                    -top-28
                    -right-28
                    w-72
                    h-72
                    rounded-full
                    bg-emerald-100/70
                    blur-3xl
                    pointer-events-none
                  "
                />

                <div
                  className="
                    absolute
                    -bottom-28
                    -left-28
                    w-72
                    h-72
                    rounded-full
                    bg-orange-100/70
                    blur-3xl
                    pointer-events-none
                  "
                />


                <div className="relative z-10 p-6 sm:p-10">


                  {/* ===========================================
                      SCANNER TITLE
                  =========================================== */}

                  <div className="text-center max-w-2xl mx-auto">

                    <div
                      className="
                        mx-auto
                        w-14
                        h-14
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        bg-gradient-to-br
                        from-orange-100
                        via-white
                        to-emerald-100
                        border
                        border-slate-200
                        shadow-sm
                      "
                    >
                      <QrCode
                        size={30}
                        className="text-slate-800"
                      />
                    </div>


                    <h2
                      className="
                        mt-4
                        text-xl
                        sm:text-2xl
                        font-extrabold
                        text-slate-900
                      "
                    >
                      Scan a CivicFix QR Tag
                    </h2>


                    <p
                      className="
                        mt-2
                        text-sm
                        leading-relaxed
                        text-slate-500
                      "
                    >
                      Point your camera toward an infrastructure
                      QR tag or enter the Asset ID below to view
                      verified public information.
                    </p>

                  </div>


                  {/* ===========================================
                      CAMERA AREA
                  =========================================== */}

                  <div className="mt-8">

                    <div
                      className="
                        relative
                        max-w-xl
                        mx-auto
                        h-64
                        sm:h-72
                        rounded-3xl
                        overflow-hidden
                        bg-slate-50
                        border
                        border-slate-200
                        shadow-inner
                      "
                    >

                      {/* soft tricolour background */}

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-br
                          from-orange-50
                          via-white
                          to-emerald-50
                        "
                      />


                      {/* scanner glow */}

                      <div
                        className="
                          absolute
                          inset-10
                          rounded-3xl
                          bg-gradient-to-br
                          from-orange-100/40
                          via-white
                          to-emerald-100/40
                        "
                      />


                      {/* corner brackets */}

                      <div
                        className="
                          absolute
                          top-5
                          left-5
                          w-9
                          h-9
                          border-l-4
                          border-t-4
                          border-orange-500
                          rounded-tl-xl
                        "
                      />

                      <div
                        className="
                          absolute
                          top-5
                          right-5
                          w-9
                          h-9
                          border-r-4
                          border-t-4
                          border-emerald-600
                          rounded-tr-xl
                        "
                      />

                      <div
                        className="
                          absolute
                          bottom-5
                          left-5
                          w-9
                          h-9
                          border-l-4
                          border-b-4
                          border-orange-500
                          rounded-bl-xl
                        "
                      />

                      <div
                        className="
                          absolute
                          bottom-5
                          right-5
                          w-9
                          h-9
                          border-r-4
                          border-b-4
                          border-emerald-600
                          rounded-br-xl
                        "
                      />


                      {/* camera icon */}

                      <div
                        className="
                          absolute
                          inset-0
                          flex
                          flex-col
                          items-center
                          justify-center
                        "
                      >

                        <div
                          className="
                            w-16
                            h-16
                            rounded-2xl
                            bg-white
                            border
                            border-slate-200
                            shadow-md
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <Camera
                            size={34}
                            strokeWidth={1.8}
                            className="text-emerald-600"
                          />
                        </div>


                        <p
                          className="
                            mt-4
                            text-sm
                            font-semibold
                            text-slate-600
                            text-center
                          "
                        >
                          Align camera with CivicFix QR tag
                        </p>


                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-400
                          "
                        >
                          Camera scanning interface
                        </p>

                      </div>


                      {/* scan line */}

                      <div
                        className="
                          absolute
                          left-10
                          right-10
                          top-1/2
                          h-px
                          bg-gradient-to-r
                          from-orange-400
                          via-slate-300
                          to-emerald-500
                          opacity-80
                        "
                      />

                    </div>

                  </div>


                  {/* ===========================================
                      SEARCH
                  =========================================== */}

                  <div className="max-w-xl mx-auto mt-7">

                    <div className="flex flex-col sm:flex-row gap-3">

                      <div className="relative flex-1">

                        <Search
                          size={18}
                          className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                          "
                        />

                        <input
                          type="text"
                          value={assetId}
                          onChange={(event) => {
                            setAssetId(event.target.value);
                            setScanMessage('');
                          }}
                          onKeyDown={handleKeyDown}
                          placeholder="Enter Asset ID (e.g. ROAD-KPG-1028)..."
                          className="
                            w-full
                            h-12
                            pl-11
                            pr-4
                            rounded-xl
                            bg-slate-50
                            border
                            border-slate-200
                            text-slate-900
                            placeholder:text-slate-400
                            focus:outline-none
                            focus:ring-2
                            focus:ring-emerald-500/20
                            focus:border-emerald-500
                            transition-all
                          "
                        />

                      </div>


                      <button
                        type="button"
                        onClick={handleScan}
                        className="
                          h-12
                          px-7
                          rounded-xl
                          bg-gradient-to-r
                          from-orange-500
                          to-emerald-600
                          text-white
                          font-bold
                          shadow-md
                          hover:shadow-lg
                          hover:-translate-y-0.5
                          transition-all
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                        "
                      >
                        <ScanLine size={18} />
                        Scan
                      </button>

                    </div>


                    {/* scan message */}

                    {scanMessage && (
                      <div
                        className="
                          mt-3
                          flex
                          items-start
                          gap-2
                          text-sm
                          text-emerald-700
                          bg-emerald-50
                          border
                          border-emerald-100
                          rounded-xl
                          px-4
                          py-3
                        "
                      >
                        {scanMessage.includes('No registered') ? (
                          <AlertCircle
                            size={17}
                            className="flex-shrink-0 mt-0.5 text-red-500"
                          />
                        ) : (
                          <CheckCircle2
                            size={17}
                            className="flex-shrink-0 mt-0.5"
                          />
                        )}

                        <span>{scanMessage}</span>
                      </div>
                    )}

                  </div>


                  {/* ===========================================
                      TRUST STRIP
                  =========================================== */}

                  <div
                    className="
                      mt-7
                      pt-6
                      border-t
                      border-slate-100
                      flex
                      flex-wrap
                      justify-center
                      gap-x-7
                      gap-y-3
                    "
                  >

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <ShieldCheck
                        size={16}
                        className="text-emerald-600"
                      />
                      Verified Asset Data
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <MapPin
                        size={16}
                        className="text-orange-500"
                      />
                      Kopargaon Infrastructure
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Building2
                        size={16}
                        className="text-slate-600"
                      />
                      Public Audit Access
                    </div>

                  </div>

                </div>
              </div>

            </section>


            {/* =================================================
                SAMPLE QR TAGS
            ================================================= */}

            <section className="mt-10">

              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-end
                  sm:justify-between
                  gap-3
                  mb-5
                "
              >

                <div>

                  <div className="flex items-center gap-2">

                    <div
                      className="
                        w-8
                        h-8
                        rounded-lg
                        bg-gradient-to-br
                        from-orange-100
                        to-emerald-100
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <QrCode
                        size={17}
                        className="text-slate-700"
                      />
                    </div>

                    <h2
                      className="
                        text-base
                        sm:text-lg
                        font-extrabold
                        text-slate-900
                      "
                    >
                      Sample Kopargaon QR Tags
                    </h2>

                  </div>


                  <p className="text-sm text-slate-500 mt-1 ml-10">
                    Click any registered infrastructure asset to
                    simulate an instant verified scan.
                  </p>

                </div>


                <div
                  className="
                    inline-flex
                    self-start
                    sm:self-auto
                    items-center
                    gap-2
                    px-3
                    py-2
                    rounded-xl
                    bg-white/80
                    border
                    border-slate-200
                    text-sm
                    font-bold
                    text-emerald-700
                    shadow-sm
                  "
                >
                  <ShieldCheck size={16} />
                  {SAMPLE_ASSETS.length} Registered Assets
                </div>

              </div>


              {/* ===============================================
                  ASSET CARDS
              =============================================== */}

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-4
                  gap-4
                "
              >

                {SAMPLE_ASSETS.map((asset) => {

                  const condition =
                    getConditionClasses(
                      asset.condition
                    );

                  return (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => openAsset(asset)}
                      className="
                        group
                        text-left
                        bg-white/95
                        border
                        border-slate-200
                        rounded-2xl
                        p-4
                        shadow-sm
                        hover:shadow-xl
                        hover:-translate-y-1
                        hover:border-emerald-200
                        transition-all
                        duration-200
                      "
                    >

                      {/* QR + asset */}

                      <div className="flex items-start gap-4">

                        <div
                          className="
                            relative
                            p-1.5
                            rounded-xl
                            bg-gradient-to-br
                            from-orange-50
                            via-white
                            to-emerald-50
                            border
                            border-slate-200
                            flex-shrink-0
                            group-hover:scale-105
                            transition-transform
                          "
                        >
                          <QRVisual
                            assetId={asset.id}
                          />

                          <div
                            className="
                              absolute
                              -top-1.5
                              -right-1.5
                              w-4
                              h-4
                              rounded-full
                              bg-emerald-500
                              border-2
                              border-white
                            "
                          />
                        </div>


                        {/* information */}

                        <div className="min-w-0 flex-1">

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-2
                            "
                          >

                            <span
                              className="
                                text-[10px]
                                font-extrabold
                                text-slate-500
                                truncate
                              "
                            >
                              {asset.id}
                            </span>


                            <ChevronRight
                              size={17}
                              className="
                                text-slate-300
                                group-hover:text-emerald-600
                                flex-shrink-0
                                transition-colors
                              "
                            />

                          </div>


                          <h3
                            className="
                              mt-1
                              text-sm
                              font-extrabold
                              text-slate-900
                              truncate
                            "
                          >
                            {asset.name}
                          </h3>


                          <div
                            className="
                              flex
                              items-center
                              gap-1.5
                              mt-1.5
                              text-xs
                              text-slate-500
                            "
                          >
                            <MapPin size={12} />

                            <span className="truncate">
                              {asset.type} · {asset.ward}
                            </span>
                          </div>


                          {/* condition */}

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-2
                              mt-3
                            "
                          >

                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-1
                                px-2
                                py-1
                                rounded-lg
                                border
                                text-[10px]
                                font-extrabold
                                ${condition.badge}
                              `}
                            >
                              {asset.condition}/10
                            </span>


                            <span
                              className="
                                text-[10px]
                                font-semibold
                                text-slate-500
                                truncate
                              "
                            >
                              {asset.status}
                            </span>

                          </div>

                        </div>

                      </div>


                      {/* bottom tricolour line */}

                      <div
                        className="
                          mt-4
                          h-1
                          rounded-full
                          overflow-hidden
                          flex
                          opacity-70
                          group-hover:opacity-100
                          transition-opacity
                        "
                      >
                        <div className="w-1/3 bg-orange-400" />
                        <div className="w-1/3 bg-slate-200" />
                        <div className="w-1/3 bg-emerald-500" />
                      </div>

                    </button>
                  );
                })}

              </div>

            </section>


            {/* =================================================
                FOOTER INFO
            ================================================= */}

            <div
              className="
                mt-10
                pb-4
                text-center
              "
            >
              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                "
              >
                CivicFix · Transparent Infrastructure Monitoring
                · Kopargaon
              </p>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}