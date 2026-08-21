/**
 * glass-card.js — the frame sync
 *
 * This is the load-bearing trick. The card is a window onto a refracted duplicate of the background video.
 */

(function () {
  const card = document.querySelector('[data-glass-card]');
  const video = document.getElementById('bg-video');
  const dupContainer = document.getElementById('dup-video-container');
  const canvas = document.getElementById('dup-image');

  if (!card || !video || !dupContainer || !canvas) {
    console.error('Terranova Refraction Sync: Required DOM elements not found.');
    return;
  }

  const ctx = canvas.getContext('2d');
  const DUP_PIXEL_RATIO = 1;

  let lastVw = 0;
  let lastVh = 0;

  function syncFrame() {
    requestAnimationFrame(syncFrame);

    // 1. Measure the card; bail if it has no size, or if video dimensions are not ready.
    const rect = card.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

    // 2. Position container at negative card offset so it aligns perfectly with viewport origin.
    // Because it is absolutely positioned inside the card, that negative offset lands it exactly over the viewport origin.
    // The card's overflow: hidden + border-radius: 48px do all the clipping.
    dupContainer.style.left = `${-rect.left}px`;
    dupContainer.style.top = `${-rect.top}px`;
    dupContainer.style.width = `${vw}px`;
    dupContainer.style.height = `${vh}px`;

    // 3. Resize canvas to viewport size at DUP_PIXEL_RATIO = 1 (only when it actually changed).
    // The duplicate stays at 1× even on retina: the SVG filter's cost scales with pixel count,
    // and what shows through is a soft refraction where 4× the filter work buys nothing.
    if (vw !== lastVw || vh !== lastVh) {
      canvas.width = vw * DUP_PIXEL_RATIO;
      canvas.height = vh * DUP_PIXEL_RATIO;
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;
      lastVw = vw;
      lastVh = vh;
    }

    const w = canvas.width;
    const h = canvas.height;

    // 4. Draw the current video frame into the canvas, reproducing object-fit: cover.
    try {
      const cover = Math.max(vw / video.videoWidth, vh / video.videoHeight);
      const sw = vw / cover;
      const sh = vh / cover;
      const sx = (video.videoWidth - sw) / 2;
      const sy = (video.videoHeight - sh) / 2;

      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h);
    } catch (e) {
      // Wrap in try/catch — a frame may not be decodable yet, ignore failures on initial frames.
    }
  }

  // Sizing the duplicate to the viewport rather than to the card is deliberate.
  // The filter shifts each colour channel by a different amount, so the filtered element's own
  // leading edges show hard channel-separation bands. At viewport size those bands fall outside
  // the card and only clean refraction shows.
  syncFrame();
})();
