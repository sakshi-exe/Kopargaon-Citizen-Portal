import React, { useState } from 'react';
import {
  Play, ShieldCheck, Video, MapPin, Calendar, CheckCircle2,
  ExternalLink, Maximize2, X, RefreshCw
} from 'lucide-react';

const YOUTUBE_VIDEO_ID = 'MalE98QHVPg';
const EMBED_URL = `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;
const THUMBNAIL_URL = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`;

/**
 * Full Video Evidence Player Component
 * Designed for Project Details and Verification screens
 */
export function VideoEvidencePlayer({
  title = "Kopargaon Infrastructure Development Progress Update",
  projectName = "Kopargaon Main Road & Urban Infrastructure Upgrades",
  location = "Kopargaon, Maharashtra",
  date = "August 2026",
  verifiedBy = "KMC Field Inspection & Quality Audit Cell",
  duration = "Site Progress Footage",
  autoPlayOnClick = true,
  className = ""
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={`rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm overflow-hidden ${className}`}>
      
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-navy-50 dark:bg-navy-950/60 text-navy-700 dark:text-navy-300 flex items-center justify-center border border-navy-200/60 dark:border-navy-800">
            <Video size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Project Progress Evidence
            </h4>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Verified Geo-Tagged Drone & On-Site Video Audit
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={13} className="text-emerald-500" /> Verified Field Evidence
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            HD 1080p
          </span>
        </div>
      </div>

      {/* Video Viewport Area */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group">
        {isPlaying ? (
          <div className="w-full h-full relative">
            <iframe
              src={EMBED_URL}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-semibold flex items-center gap-1 z-10 transition-colors backdrop-blur-sm border border-white/20"
              title="Close Player"
            >
              <X size={13} /> Close
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
            {/* Custom High-Res Thumbnail Image with Gradient */}
            <img
              src={THUMBNAIL_URL}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-black/30" />

            {/* Play Button Overlay (Animated Pulse) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 rounded-full bg-saffron-500/30 animate-ping pointer-events-none" />
                <button
                  type="button"
                  className="w-16 h-16 rounded-full bg-saffron-500 hover:bg-saffron-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-saffron-500/50 group-hover:scale-110 transition-all z-10 pl-1"
                >
                  <Play size={26} className="fill-current text-slate-950" />
                </button>
              </div>
              <span className="mt-3 text-xs font-extrabold uppercase tracking-widest text-white drop-shadow-md bg-slate-900/85 px-3.5 py-1.5 rounded-full border border-white/20">
                ▶ Play Verified Evidence Video
              </span>
            </div>

            {/* Bottom Floating Metadata on Video */}
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white pointer-events-none">
              <div>
                <div className="text-[11px] font-bold text-saffron-400 flex items-center gap-1 mb-0.5">
                  <MapPin size={12} /> {location}
                </div>
                <div className="text-sm font-bold leading-tight drop-shadow">
                  {title}
                </div>
              </div>
              <div className="text-right text-[10px] text-slate-300 font-mono bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                Updated: {date}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Cards */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase block">Project Linked</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{projectName}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase block">Audit Location</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{location}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase block">Verified Authority</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{verifiedBy}</span>
        </div>
      </div>

    </div>
  );
}

/**
 * Compact Video Card for QR Profile & Modal Views
 */
export function CompactVideoEvidenceCard({
  title = "Site Progress Evidence",
  projectName = "Kopargaon Main Road Resurfacing",
  date = "August 2026",
  onOpenFullPlayer
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const handlePlay = (e) => {
    e.stopPropagation();
    if (onOpenFullPlayer) {
      onOpenFullPlayer();
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <div
        onClick={handlePlay}
        className="group relative rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-3 hover:border-navy-400 dark:hover:border-navy-500 hover:shadow-md transition-all cursor-pointer overflow-hidden"
      >
        <div className="flex items-center gap-3">
          {/* Mini Thumbnail */}
          <div className="relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900">
            <img
              src={THUMBNAIL_URL}
              alt="Video Evidence Thumbnail"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-85"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-saffron-500 text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform pl-0.5 shadow">
                <Play size={13} className="fill-current text-slate-950" />
              </div>
            </div>
            <span className="absolute bottom-1 right-1 text-[8px] font-mono font-bold bg-black/80 text-white px-1 rounded">
              HD
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy-700 dark:text-saffron-400">
                Latest Video Evidence
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{date}</span>
            </div>

            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {title}
            </div>

            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {projectName} · Kopargaon
            </div>

            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              <ShieldCheck size={12} /> Verified Drone & Field Audit
            </div>
          </div>
        </div>
      </div>

      {/* Standalone Video Modal if clicked inside compact view */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Kopargaon Field Progress Evidence · CivicFix
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={EMBED_URL}
                title="Kopargaon Infrastructure Video Evidence"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Project: {projectName}</span>
                <span className="text-[11px] text-slate-400">Location: Kopargaon, Maharashtra · Verified August 2026</span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-navy-600 hover:bg-navy-700 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

