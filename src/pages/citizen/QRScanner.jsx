import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

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
  X,
  RotateCcw,
  LocateFixed,
  ExternalLink,
} from 'lucide-react';

import Header from '../../components/ui/Header.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { QRCodeSVG } from '../../components/ui/QRCodeView.jsx';


/* ============================================================
   DEMO / FALLBACK ASSETS

   These are used only when the application state does not yet
   contain infrastructure records.

   IMPORTANT:
   These objects contain every field expected by AssetDetailModal.
============================================================ */

const SAMPLE_ASSETS = [
  {
    id: 'ROAD-KPG-1028',
    name: 'Kopargaon Main Road',
    type: 'Road',
    ward: 'Ward 1',
    wardId: 'W01',
    area: 'Shivaji Chowk',

    lat: 19.8826,
    lng: 74.4762,

    condition: 4,
    conditionLabel: 'Poor',
    status: 'Requires Attention',

    contractor: 'Kopargaon Municipal Council PWD',
    installDate: '2025-06-15',
    budget: 12500000,
    verifiedBy: 'Municipal Field Inspection Team',

    citizenReports: 8,
    maintenanceStatus: 'Due',

    description:
      'Primary municipal road connecting Shivaji Chowk with the central Kopargaon market area.',

    lastInspection: '2026-08-28',

    maintenanceHistory: [
      {
        date: '2026-08-28',
        action: 'Field inspection completed. Surface deterioration observed.',
      },
      {
        date: '2026-05-14',
        action: 'Routine road maintenance inspection.',
      },
    ],

    relatedProjects: [],
  },

  {
    id: 'HOSP-KPG-0512',
    name: 'Kopargaon Sub-District Hospital',
    type: 'Hospital',
    ward: 'Ward 1',
    wardId: 'W01',
    area: 'Shivaji Chowk',

    lat: 19.8838,
    lng: 74.4748,

    condition: 8,
    conditionLabel: 'Good',
    status: 'Verified',

    contractor: 'Public Works Department',
    installDate: '2024-11-20',
    budget: 85000000,
    verifiedBy: 'Municipal Field Inspection Team',

    citizenReports: 3,
    maintenanceStatus: 'Up-to-date',

    description:
      'Public healthcare infrastructure serving residents of Kopargaon and surrounding areas.',

    lastInspection: '2026-08-24',

    maintenanceHistory: [
      {
        date: '2026-08-24',
        action: 'Routine structural and public-access inspection completed.',
      },
      {
        date: '2026-03-12',
        action: 'Electrical and facility maintenance verification.',
      },
    ],

    relatedProjects: [],
  },

  {
    id: 'BLDG-KPG-0312',
    name: 'Kopargaon Municipal Council',
    type: 'Public Building',
    ward: 'Ward 1',
    wardId: 'W01',
    area: 'Main Road',

    lat: 19.8821,
    lng: 74.4755,

    condition: 7,
    conditionLabel: 'Good',
    status: 'Verified',

    contractor: 'Kopargaon Municipal Council',
    installDate: '2023-08-10',
    budget: 42000000,
    verifiedBy: 'Municipal Field Inspection Team',

    citizenReports: 2,
    maintenanceStatus: 'Up-to-date',

    description:
      'Municipal administrative facility and public service centre for Kopargaon citizens.',

    lastInspection: '2026-08-22',

    maintenanceHistory: [
      {
        date: '2026-08-22',
        action: 'Building safety and accessibility inspection completed.',
      },
    ],

    relatedProjects: [],
  },

  {
    id: 'DRAIN-KPG-0138',
    name: 'Kopargaon Main Drain',
    type: 'Drainage',
    ward: 'Ward 3',
    wardId: 'W03',
    area: 'Market Road',

    lat: 19.8768,
    lng: 74.4824,

    condition: 9,
    conditionLabel: 'Excellent',
    status: 'Certified',

    contractor: 'Kopargaon Municipal Council PWD',
    installDate: '2025-02-18',
    budget: 18000000,
    verifiedBy: 'Municipal Field Inspection Team',

    citizenReports: 1,
    maintenanceStatus: 'Up-to-date',

    description:
      'Municipal storm-water drainage infrastructure serving the Market Road area.',

    lastInspection: '2026-08-20',

    maintenanceHistory: [
      {
        date: '2026-08-20',
        action: 'Drainage flow and structural inspection completed.',
      },
    ],

    relatedProjects: [],
  },
];


/* ============================================================
   HELPERS
============================================================ */

function normalizeAsset(asset) {
  if (!asset) return null;

  const lat = Number(
    asset.lat ??
    asset.latitude ??
    asset.location?.lat ??
    19.8826
  );

  const lng = Number(
    asset.lng ??
    asset.longitude ??
    asset.location?.lng ??
    74.4762
  );

  return {
    ...asset,

    id: String(asset.id ?? asset.assetId ?? '').toUpperCase(),

    name:
      asset.name ??
      asset.title ??
      asset.assetName ??
      'Unnamed Civic Asset',

    type:
      asset.type ??
      asset.assetType ??
      'Infrastructure',

    ward:
      asset.ward ??
      asset.wardName ??
      asset.ward_id ??
      'Ward 1',

    wardId:
      asset.wardId ??
      asset.ward_id ??
      'W01',

    area:
      asset.area ??
      asset.locationName ??
      asset.address ??
      'Kopargaon',

    lat: Number.isFinite(lat) ? lat : 19.8826,
    lng: Number.isFinite(lng) ? lng : 74.4762,

    condition:
      Number.isFinite(Number(asset.condition))
        ? Number(asset.condition)
        : 7,

    conditionLabel:
      asset.conditionLabel ??
      (
        Number(asset.condition) >= 8
          ? 'Good'
          : Number(asset.condition) >= 5
            ? 'Moderate'
            : 'Poor'
      ),

    status:
      asset.status ??
      'Verified',

    citizenReports:
      Number(asset.citizenReports ?? asset.reportCount ?? 0),

    maintenanceStatus:
      asset.maintenanceStatus ??
      'Up-to-date',

    maintenanceHistory:
      Array.isArray(asset.maintenanceHistory)
        ? asset.maintenanceHistory
        : [],

    relatedProjects:
      Array.isArray(asset.relatedProjects)
        ? asset.relatedProjects
        : [],
  };
}


function extractAssetId(value) {
  if (!value) return '';

  const raw = String(value).trim();

  /*
    Supports:

    ROAD-KPG-1028

    https://civicfix.kopargaon.gov.in/asset/ROAD-KPG-1028

    https://civicfix.../asset?id=ROAD-KPG-1028
  */

  try {
    const url = new URL(raw);

    const pathMatch = url.pathname.match(
      /\/asset\/([^/]+)/i
    );

    if (pathMatch?.[1]) {
      return decodeURIComponent(pathMatch[1])
        .trim()
        .toUpperCase();
    }

    const queryId = url.searchParams.get('id');

    if (queryId) {
      return queryId.trim().toUpperCase();
    }
  } catch {
    // Not a URL — treat as raw Asset ID.
  }

  return raw
    .replace(/^asset[:/\\-]*/i, '')
    .trim()
    .toUpperCase();
}


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

  const { state, dispatch } = useApp();

  const scannerRef = useRef(null);

  const [assetId, setAssetId] = useState('');
  const [scanMessage, setScanMessage] = useState('');

  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const [searching, setSearching] = useState(false);

  const [lastScannedId, setLastScannedId] = useState('');

  const [recentScans, setRecentScans] = useState(() => {
    try {
      const saved =
        localStorage.getItem('civicfix_recent_scans');

      return saved
        ? JSON.parse(saved)
        : [];
    } catch {
      return [];
    }
  });


  /* ==========================================================
     ASSET SOURCE

     Prefer application state.

     Fall back to demo assets only if no infrastructure
     collection is currently available.
  ========================================================== */

  const assets = useMemo(() => {
    const possibleSources = [
      state?.infrastructure,
      state?.infrastructureAssets,
      state?.assets,
      state?.infrastructureData,
    ];

    const source = possibleSources.find(
      (item) => Array.isArray(item) && item.length > 0
    );

    if (source) {
      return source
        .map(normalizeAsset)
        .filter((asset) => asset.id);
    }

    return SAMPLE_ASSETS.map(normalizeAsset);
  }, [state]);


  /* ==========================================================
     REGISTER RECENT SCAN
  ========================================================== */

  const rememberScan = (asset) => {
    if (!asset?.id) return;

    const scan = {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      scannedAt: new Date().toISOString(),
    };

    setRecentScans((previous) => {
      const next = [
        scan,
        ...previous.filter(
          (item) => item.id !== asset.id
        ),
      ].slice(0, 5);

      try {
        localStorage.setItem(
          'civicfix_recent_scans',
          JSON.stringify(next)
        );
      } catch {
        // Ignore localStorage errors.
      }

      return next;
    });
  };


  /* ==========================================================
     OPEN ASSET
  ========================================================== */

  const openAsset = (asset) => {
    if (!asset) return;

    const normalized = normalizeAsset(asset);

  dispatch({
  type: 'OPEN_ASSET_MODAL',
  payload: normalized,
  });

    rememberScan(normalized);

    setLastScannedId(normalized.id);

    setAssetId(normalized.id);

    setScanMessage(
      `Verified civic asset found: ${normalized.id}`
    );

    stopScanner();
  };


  /* ==========================================================
     FIND ASSET
  ========================================================== */

  const findAsset = async (value) => {
    const id = extractAssetId(value);

    if (!id) {
      setScanMessage(
        'Please enter or scan an Asset ID first.'
      );
      return;
    }

    setSearching(true);
    setScanMessage('');

    /*
      Small delay makes the UI feel like a real lookup
      without blocking the interface.
    */

    await new Promise((resolve) =>
      setTimeout(resolve, 180)
    );

    const asset = assets.find(
      (item) =>
        item.id.toUpperCase() === id.toUpperCase()
    );

    setSearching(false);

    if (asset) {
      openAsset(asset);
      return;
    }

    setLastScannedId('');

    setScanMessage(
      `No registered civic asset was found for "${id}".`
    );
  };


  /* ==========================================================
     SEARCH BUTTON
  ========================================================== */

  const handleScan = () => {
    findAsset(assetId);
  };


  /* ==========================================================
     ENTER KEY
  ========================================================== */

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleScan();
    }
  };


  /* ==========================================================
     CAMERA SCANNER
  ========================================================== */

  const startScanner = async () => {
    setCameraError('');
    setScanMessage('');

    if (isScanning) return;

    try {
      const scanner = new Html5Qrcode(
        'civicfix-qr-reader'
      );

      scannerRef.current = scanner;

      setIsScanning(true);

      await scanner.start(
        {
          facingMode: 'environment',
        },
        {
          fps: 10,
          qrbox: {
            width: 240,
            height: 240,
          },
          aspectRatio: 1,
        },
        (decodedText) => {
          const decodedId =
            extractAssetId(decodedText);

          setAssetId(decodedId);

          setScanMessage(
            `QR detected: ${decodedId}`
          );

          findAsset(decodedId);
        },
        () => {
          // Ignore normal frame-by-frame scan misses.
        }
      );
    } catch (error) {
      console.error(
        'CivicFix QR scanner error:',
        error
      );

      setIsScanning(false);

      scannerRef.current = null;

      setCameraError(
        'Camera access could not be started. Please allow camera permission or use Asset ID search.'
      );
    }
  };


  /* ==========================================================
     STOP CAMERA
  ========================================================== */

  const stopScanner = async () => {
    const scanner = scannerRef.current;

    if (!scanner) {
      setIsScanning(false);
      return;
    }

    try {
      const stateValue =
        scanner.getState?.();

      /*
        Html5QrcodeScannerState:
        2 = SCANNING
      */

      if (
        typeof stateValue === 'number' &&
        stateValue === 2
      ) {
        await scanner.stop();
      }
    } catch (error) {
      console.warn(
        'Unable to stop QR scanner:',
        error
      );
    }

    try {
      scanner.clear();
    } catch {
      // Scanner may already be cleared.
    }

    scannerRef.current = null;
    setIsScanning(false);
  };


  /* ==========================================================
     CLEANUP CAMERA
  ========================================================== */

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;

      if (scanner) {
        scanner
          .stop()
          .catch(() => {})
          .finally(() => {
            try {
              scanner.clear();
            } catch {
              // Ignore cleanup errors.
            }
          });
      }
    };
  }, []);


  /* ==========================================================
     RECENT SCAN CLICK
  ========================================================== */

  const openRecentScan = (id) => {
    setAssetId(id);
    findAsset(id);
  };


  /* ==========================================================
     CLEAR RECENT SCANS
  ========================================================== */

  const clearRecentScans = () => {
    setRecentScans([]);

    try {
      localStorage.removeItem(
        'civicfix_recent_scans'
      );
    } catch {
      // Ignore storage errors.
    }
  };


  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <div className="flex flex-col h-full min-h-0 bg-transparent">

      <Header
        title="CivicFix QR Infrastructure Scanner"
        subtitle="Scan any CivicFix infrastructure tag to verify its identity, condition, project information and public audit history"
      />


      <main className="flex-1 overflow-y-auto">

        <div className="relative min-h-full overflow-hidden">

          {/* ==================================================
              BACKGROUND
          ================================================== */}

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


          <div
            className="
              relative
              z-10
              max-w-7xl
              mx-auto
              px-4
              sm:px-6
              lg:px-8
              py-6
              sm:py-9
            "
          >

            {/* ==================================================
                BACK
            ================================================== */}

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


            {/* ==================================================
                HERO
            ================================================== */}

            <div
              className="
                flex
                flex-col
                lg:flex-row
                lg:items-end
                lg:justify-between
                gap-5
                mb-7
              "
            >

              <div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    rounded-full
                    bg-white/90
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
                  Scan the QR tag attached to a public asset
                  or search its Asset ID to view verified
                  infrastructure information.
                </p>

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  bg-white/90
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
                    {assets.length}
                  </p>
                </div>

              </div>

            </div>


            {/* ==================================================
                MAIN CARD
            ================================================== */}

            <section className="max-w-5xl mx-auto">

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


                <div className="relative z-10 p-5 sm:p-8">

                  {/* ==================================================
                      TITLE
                  ================================================== */}

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
                      Verify a Civic Infrastructure Asset
                    </h2>


                    <p
                      className="
                        mt-2
                        text-sm
                        leading-relaxed
                        text-slate-500
                      "
                    >
                      Use your phone camera to scan a CivicFix
                      QR tag. The QR contains the unique digital
                      identity of the physical civic asset.
                    </p>

                  </div>


                  {/* ==================================================
                      CAMERA
                  ================================================== */}

                  <div className="mt-8">

                    <div
                      className="
                        relative
                        max-w-xl
                        mx-auto
                        rounded-3xl
                        overflow-hidden
                        bg-slate-950
                        border
                        border-slate-200
                        shadow-inner
                      "
                    >

                      {/* Actual html5-qrcode mount */}

                      <div
                        id="civicfix-qr-reader"
                        className={`
                          w-full
                          min-h-[300px]
                          sm:min-h-[360px]
                          overflow-hidden
                          ${isScanning ? 'block' : 'hidden'}
                        `}
                      />


                      {/* Camera placeholder when scanner is off */}

                      {!isScanning && (
                        <div
                          className="
                            min-h-[300px]
                            sm:min-h-[360px]
                            relative
                            flex
                            flex-col
                            items-center
                            justify-center
                            px-6
                            text-center
                            bg-gradient-to-br
                            from-slate-900
                            via-slate-800
                            to-slate-900
                          "
                        >

                          <div
                            className="
                              absolute
                              top-5
                              left-5
                              w-10
                              h-10
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
                              w-10
                              h-10
                              border-r-4
                              border-t-4
                              border-emerald-500
                              rounded-tr-xl
                            "
                          />

                          <div
                            className="
                              absolute
                              bottom-5
                              left-5
                              w-10
                              h-10
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
                              w-10
                              h-10
                              border-r-4
                              border-b-4
                              border-emerald-500
                              rounded-br-xl
                            "
                          />


                          <div
                            className="
                              w-20
                              h-20
                              rounded-3xl
                              bg-white/10
                              border
                              border-white/20
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <Camera
                              size={38}
                              className="text-emerald-400"
                            />
                          </div>


                          <h3
                            className="
                              mt-5
                              text-lg
                              font-bold
                              text-white
                            "
                          >
                            Camera QR Scanner
                          </h3>


                          <p
                            className="
                              mt-2
                              max-w-sm
                              text-sm
                              leading-relaxed
                              text-slate-300
                            "
                          >
                            Allow camera access and point it
                            toward a CivicFix infrastructure QR tag.
                          </p>


                          <button
                            type="button"
                            onClick={startScanner}
                            className="
                              mt-5
                              inline-flex
                              items-center
                              justify-center
                              gap-2
                              px-5
                              py-3
                              rounded-xl
                              bg-gradient-to-r
                              from-orange-500
                              to-emerald-600
                              text-white
                              font-bold
                              shadow-lg
                              hover:-translate-y-0.5
                              transition-all
                            "
                          >
                            <Camera size={18} />
                            Start Camera
                          </button>

                        </div>
                      )}


                      {/* Stop camera */}

                      {isScanning && (
                        <button
                          type="button"
                          onClick={stopScanner}
                          className="
                            absolute
                            top-4
                            right-4
                            z-20
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-2
                            rounded-xl
                            bg-black/70
                            text-white
                            text-xs
                            font-bold
                            backdrop-blur
                            hover:bg-black/80
                          "
                        >
                          <X size={15} />
                          Stop
                        </button>
                      )}

                    </div>


                    {/* Camera error */}

                    {cameraError && (
                      <div
                        className="
                          max-w-xl
                          mx-auto
                          mt-3
                          flex
                          items-start
                          gap-2
                          px-4
                          py-3
                          rounded-xl
                          bg-red-50
                          border
                          border-red-200
                          text-sm
                          text-red-700
                        "
                      >
                        <AlertCircle
                          size={17}
                          className="mt-0.5 flex-shrink-0"
                        />

                        <span>{cameraError}</span>
                      </div>
                    )}

                  </div>


                  {/* ==================================================
                      OR
                  ================================================== */}

                  <div
                    className="
                      max-w-xl
                      mx-auto
                      flex
                      items-center
                      gap-3
                      my-7
                    "
                  >
                    <div className="flex-1 h-px bg-slate-200" />

                    <span
                      className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      Or search manually
                    </span>

                    <div className="flex-1 h-px bg-slate-200" />
                  </div>


                  {/* ==================================================
                      SEARCH
                  ================================================== */}

                  <div className="max-w-xl mx-auto">

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
                          placeholder="Enter Asset ID e.g. ROAD-KPG-1028"
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
                          "
                        />

                      </div>


                      <button
                        type="button"
                        onClick={handleScan}
                        disabled={searching}
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
                          disabled:opacity-60
                          disabled:cursor-not-allowed
                          transition-all
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                        "
                      >
                        {searching ? (
                          <>
                            <RotateCcw
                              size={18}
                              className="animate-spin"
                            />
                            Checking...
                          </>
                        ) : (
                          <>
                            <ScanLine size={18} />
                            Verify Asset
                          </>
                        )}
                      </button>

                    </div>


                    {/* ==================================================
                        MESSAGE
                    ================================================== */}

                    {scanMessage && (
                      <div
                        className={`
                          mt-3
                          flex
                          items-start
                          gap-2
                          rounded-xl
                          px-4
                          py-3
                          text-sm
                          border
                          ${
                            scanMessage.includes(
                              'No registered'
                            )
                              ? 'text-red-700 bg-red-50 border-red-200'
                              : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          }
                        `}
                      >

                        {scanMessage.includes(
                          'No registered'
                        ) ? (
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


                  {/* ==================================================
                      TRUST STRIP
                  ================================================== */}

                  <div
                    className="
                      mt-7
                      pt-6
                      border-t
                      border-slate-100
                      grid
                      grid-cols-1
                      sm:grid-cols-3
                      gap-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        text-xs
                        font-semibold
                        text-slate-500
                      "
                    >
                      <ShieldCheck
                        size={16}
                        className="text-emerald-600"
                      />
                      Verified Asset Data
                    </div>


                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        text-xs
                        font-semibold
                        text-slate-500
                      "
                    >
                      <LocateFixed
                        size={16}
                        className="text-orange-500"
                      />
                      Location Verified
                    </div>


                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        text-xs
                        font-semibold
                        text-slate-500
                      "
                    >
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


            {/* ==================================================
                LAST SCANNED
            ================================================== */}

            {lastScannedId && (
              <section className="max-w-5xl mx-auto mt-6">

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-3
                    p-4
                    rounded-2xl
                    bg-emerald-50
                    border
                    border-emerald-200
                  "
                >

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-emerald-100
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <CheckCircle2
                        size={21}
                        className="text-emerald-600"
                      />
                    </div>

                    <div>

                      <p className="text-xs font-semibold text-emerald-700">
                        Last Verified Asset
                      </p>

                      <p className="font-extrabold text-slate-900">
                        {lastScannedId}
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={() => findAsset(lastScannedId)}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      px-4
                      py-2
                      rounded-xl
                      bg-white
                      border
                      border-emerald-200
                      text-sm
                      font-bold
                      text-emerald-700
                      hover:bg-emerald-100
                    "
                  >
                    View Again
                    <ExternalLink size={15} />
                  </button>

                </div>

              </section>
            )}


            {/* ==================================================
                RECENT SCANS
            ================================================== */}

            {recentScans.length > 0 && (
              <section className="max-w-5xl mx-auto mt-8">

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    mb-4
                  "
                >

                  <div>

                    <h2
                      className="
                        text-lg
                        font-extrabold
                        text-slate-900
                      "
                    >
                      Recent Scans
                    </h2>

                    <p className="text-sm text-slate-500">
                      Assets recently viewed on this device.
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={clearRecentScans}
                    className="
                      text-xs
                      font-bold
                      text-slate-500
                      hover:text-red-600
                    "
                  >
                    Clear
                  </button>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                  {recentScans.map((scan) => (

                    <button
                      key={scan.id}
                      type="button"
                      onClick={() =>
                        openRecentScan(scan.id)
                      }
                      className="
                        group
                        text-left
                        p-4
                        rounded-2xl
                        bg-white/95
                        border
                        border-slate-200
                        shadow-sm
                        hover:shadow-md
                        hover:border-emerald-200
                        transition-all
                      "
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-11
                            h-11
                            rounded-xl
                            bg-slate-50
                            border
                            border-slate-200
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                          "
                        >
                          <QrCode
                            size={22}
                            className="text-slate-700"
                          />
                        </div>


                        <div className="min-w-0 flex-1">

                          <p
                            className="
                              text-[11px]
                              font-extrabold
                              font-mono
                              text-emerald-700
                              truncate
                            "
                          >
                            {scan.id}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-sm
                              font-bold
                              text-slate-900
                              truncate
                            "
                          >
                            {scan.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {scan.type}
                          </p>

                        </div>


                        <ChevronRight
                          size={17}
                          className="
                            text-slate-300
                            group-hover:text-emerald-600
                          "
                        />

                      </div>

                    </button>

                  ))}

                </div>

              </section>
            )}


            {/* ==================================================
                REGISTERED ASSETS
            ================================================== */}

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
                      Registered Civic Assets
                    </h2>

                  </div>

                  <p className="text-sm text-slate-500 mt-1 ml-10">
                    Select an asset to open its complete
                    CivicFix infrastructure profile.
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
                    bg-white/90
                    border
                    border-slate-200
                    text-sm
                    font-bold
                    text-emerald-700
                    shadow-sm
                  "
                >
                  <ShieldCheck size={16} />
                  {assets.length} Assets
                </div>

              </div>


              {/* ==================================================
                  ASSET CARDS
              ================================================== */}

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-4
                  gap-4
                "
              >

                {assets.map((asset) => {

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

                      <div className="flex items-start gap-4">

                        <div
                          className="
                            relative
                            p-2
                            rounded-xl
                            bg-white
                            border
                            border-slate-200
                            flex-shrink-0
                            group-hover:scale-105
                            transition-transform
                          "
                        >

                          <QRCodeSVG
                            value={`https://civicfix.kopargaon.gov.in/asset/${asset.id}`}
                            size={62}
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
                                font-mono
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


            {/* ==================================================
                PRODUCT VALUE
            ================================================== */}

            <section className="mt-10 pb-5">

              <div
                className="
                  rounded-2xl
                  bg-white/80
                  border
                  border-slate-200
                  p-5
                  sm:p-6
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    gap-4
                  "
                >

                  <div
                    className="
                      w-12
                      h-12
                      rounded-xl
                      bg-emerald-50
                      border
                      border-emerald-200
                      flex
                      items-center
                      justify-center
                      flex-shrink-0
                    "
                  >
                    <ShieldCheck
                      size={24}
                      className="text-emerald-600"
                    />
                  </div>


                  <div className="flex-1">

                    <h3
                      className="
                        font-extrabold
                        text-slate-900
                      "
                    >
                      One physical asset. One digital identity.
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        leading-relaxed
                        text-slate-600
                      "
                    >
                      CivicFix connects the physical civic
                      infrastructure in the city with verified
                      digital records, inspections, citizen
                      complaints and public transparency.
                    </p>

                  </div>

                </div>

              </div>

            </section>


            <div className="pb-4 text-center">

              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                "
              >
                CivicFix · Digital Infrastructure Identity
                · Kopargaon
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}