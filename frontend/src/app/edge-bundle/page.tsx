'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EdgeBundleCanvas } from '@/components/edge-bundle/EdgeBundleCanvas';

export default function EdgeBundlePage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#03080c] text-slate-100 select-none">
      {/* 3D Canvas Container */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <EdgeBundleCanvas />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
        
        {/* Top Header */}
        <header className="flex justify-between items-center w-full">
          {/* Back button */}
          <Link
            href="/"
            className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-900 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:border-slate-800 hover:bg-slate-900/60 transition-all backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>메인 대시보드로 돌아가기</span>
          </Link>

          {/* Top Badge matching HTML ref */}
          <div className="badge-top-container">
            <div className="badge badge-top">
              <span className="dot dot-top"></span>
              CORE SYNC
            </div>
          </div>

          {/* Empty spacer for alignment */}
          <div className="w-36"></div>
        </header>

        {/* Center alignment spacer */}
        <div className="flex-1 flex items-center justify-center"></div>

        {/* Bottom Footer */}
        <footer className="w-full flex justify-between items-end">
          {/* Info text matching HTML ref */}
          <div className="info">
            DRAG TO ROTATE / SCROLL TO ZOOM
          </div>

          {/* Bottom Badge matching HTML ref */}
          <div className="badge-bottom-container absolute bottom-[8%] left-1/2 -translate-x-1/2">
            <div className="badge badge-bottom">
              <span className="dot dot-bottom"></span>
              CLUSTER BASE
            </div>
          </div>
        </footer>

      </div>

      {/* Embedded CSS styling for badge animations and overlays matching HTML */}
      <style jsx>{`
        .badge {
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 11px;
          letter-spacing: 2px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(8px);
        }
        .badge-top {
          color: #00ffcc;
          border: 1px solid rgba(0, 255, 204, 0.4);
          background: rgba(0, 30, 25, 0.6);
          box-shadow: 0 0 15px rgba(0, 255, 204, 0.2);
          text-shadow: 0 0 8px #00ffcc;
        }
        .badge-bottom {
          color: #ffaa33;
          border: 1px solid rgba(255, 170, 51, 0.4);
          background: rgba(40, 25, 5, 0.6);
          box-shadow: 0 0 15px rgba(255, 170, 51, 0.2);
          text-shadow: 0 0 8px #ffaa33;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 6px currentColor;
          animation: pulse 1.8s infinite ease-in-out;
        }
        .info {
          color: #4a6875;
          font-size: 11px;
          letter-spacing: 1px;
          font-weight: 600;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.65; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </main>
  );
}
