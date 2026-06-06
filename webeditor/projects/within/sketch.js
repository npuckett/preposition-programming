import createSketch from "./preposition.js";

new p5((p) => {
  createSketch(p);

  const userSetup = p.setup;
  p.setup = function () {
    p.createCanvas(400, 300);
    if (typeof lockGestures === "function") {
      lockGestures();
    }
    if (typeof userSetup === "function") {
      userSetup.call(p);
    }
  };
});
