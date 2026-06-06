const SKETCH_ASPECT = 4 / 3;
const DEFAULT_MAX_WIDTH = 480;
const MIN_HEIGHT = 240;

let activeInstance = null;

function computeSize(container, maxWidth = DEFAULT_MAX_WIDTH) {
  const containerWidth = container.clientWidth || maxWidth;
  const width = Math.min(maxWidth, Math.max(280, containerWidth));
  const height = Math.max(MIN_HEIGHT, Math.round(width / SKETCH_ASPECT));
  return { width, height };
}

/** Touch-primary devices where browser gestures interfere with canvas drag. */
function prefersTouchInteraction() {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

/**
 * p5-phone lockGestures() — blocks scroll, zoom, pull-to-refresh, etc. on mobile.
 * @see https://github.com/npuckett/p5-phone#lockgestures
 */
function lockMobileGestures(p) {
  if (!prefersTouchInteraction()) return;

  if (typeof p.lockGestures === "function") {
    p.lockGestures();
    return;
  }

  if (typeof window.lockGestures === "function") {
    window.lockGestures();
  }
}

export function mountSketch(factory, containerId = "sketch-canvas", options = {}) {
  const maxWidth = options.maxWidth ?? DEFAULT_MAX_WIDTH;
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Sketch container #${containerId} not found`);
    return null;
  }

  if (activeInstance) {
    activeInstance.remove();
    activeInstance = null;
  }

  activeInstance = new p5((p) => {
    factory(p);

    const userSetup = p.setup;
    const userResize = p.windowResized;

    p.setup = function () {
      const { width, height } = computeSize(container, maxWidth);
      const canvas = p.createCanvas(width, height);
      canvas.parent(container);
      p.pixelDensity(Math.min(2, window.devicePixelRatio || 1));
      lockMobileGestures(p);
      if (typeof userSetup === "function") {
        userSetup.call(p);
      }
    };

    p.windowResized = function () {
      const { width, height } = computeSize(container, maxWidth);
      p.resizeCanvas(width, height);
      if (typeof userResize === "function") {
        userResize.call(p);
      }
    };
  }, container);

  return activeInstance;
}

export function unmountSketch() {
  if (activeInstance) {
    activeInstance.remove();
    activeInstance = null;
  }
}

window.addEventListener("beforeunload", unmountSketch);
