const SKETCH_ASPECT = 4 / 3;
const MAX_WIDTH = 480;
const MIN_HEIGHT = 240;

let activeInstance = null;

function computeSize(container) {
  const containerWidth = container.clientWidth || MAX_WIDTH;
  const width = Math.min(MAX_WIDTH, Math.max(280, containerWidth));
  const height = Math.max(MIN_HEIGHT, Math.round(width / SKETCH_ASPECT));
  return { width, height };
}

export function mountSketch(factory, containerId = "sketch-canvas") {
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
      const { width, height } = computeSize(container);
      const canvas = p.createCanvas(width, height);
      canvas.parent(container);
      p.pixelDensity(Math.min(2, window.devicePixelRatio || 1));
      if (typeof userSetup === "function") {
        userSetup.call(p);
      }
    };

    p.windowResized = function () {
      const { width, height } = computeSize(container);
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
