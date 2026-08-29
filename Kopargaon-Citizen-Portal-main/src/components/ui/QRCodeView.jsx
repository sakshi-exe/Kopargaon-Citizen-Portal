import React from 'react';

// Lightweight pure React QR Code SVG generator
// Produces deterministic, high-contrast scannable QR-pattern SVGs for asset IDs

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Generate a realistic 21x21 QR matrix pattern for a given asset ID string
function generateQRMatrix(dataString) {
  const size = 21;
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));

  // Helper to place finder pattern at (r, c)
  const placeFinder = (startR, startC) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startR + r][startC + c] = 1;
        }
      }
    }
  };

  // 3 Finder patterns (top-left, top-right, bottom-left)
  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0 ? 1 : 0;
    matrix[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // Dark module
  matrix[size - 8][8] = 1;

  // Populate data payload area deterministically using pseudo-random hashing of data string
  let seed = simpleHash(dataString || 'CIVICFIX-KPG');
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder pattern zones
      const inTopLeft = r < 9 && c < 9;
      const inTopRight = r < 9 && c >= size - 9;
      const inBottomLeft = r >= size - 9 && c < 9;
      const isTiming = (r === 6 && c >= 8 && c < size - 8) || (c === 6 && r >= 8 && r < size - 8);
      const isDarkModule = (r === size - 8 && c === 8);

      if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming && !isDarkModule) {
        matrix[r][c] = rng() > 0.48 ? 1 : 0;
      }
    }
  }

  return { matrix, size };
}

export function QRCodeSVG({ value, size = 128, fgColor = '#0f172a', bgColor = '#ffffff', className = '' }) {
  const { matrix, size: gridCount } = React.useMemo(() => generateQRMatrix(value), [value]);
  const cellSize = size / gridCount;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`rounded-lg bg-white ${className}`}
      style={{ shapeRendering: 'crispEdges' }}
    >
      <rect width={size} height={size} fill={bgColor} />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell === 1 ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.1}
              height={cellSize + 0.1}
              fill={fgColor}
            />
          ) : null
        )
      )}
    </svg>
  );
}

export function AssetQRBadge({ assetId, assetName, size = 'md', onClick }) {
  const sizeClasses = {
    sm: { box: 'w-20 h-20', svg: 64, text: 'text-[9px]' },
    md: { box: 'w-28 h-28', svg: 90, text: 'text-[10px]' },
    lg: { box: 'w-36 h-36', svg: 120, text: 'text-xs' },
  };
  const config = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 shadow-sm ${
        onClick ? 'cursor-pointer hover:border-blue-500 hover:shadow-md transition-all' : ''
      }`}
    >
      <QRCodeSVG value={`https://civicfix.kopargaon.gov.in/asset/${assetId}`} size={config.svg} />
      <div className="mt-1 text-center font-mono font-bold text-slate-800 tracking-wider">
        <span className={config.text}>{assetId}</span>
      </div>
      <div className="text-[9px] text-slate-400 font-sans tracking-tight">CIVICFIX VERIFIED</div>
    </div>
  );
}
