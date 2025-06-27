// Simple test to see if p5.js is working
function setup() {
  createCanvas(400, 300).parent('canvas');
}

function draw() {
  background(240, 248, 255);
  fill(255, 0, 0);
  ellipse(200, 150, 50, 50);
  
  fill(0);
  textAlign(CENTER);
  textSize(16);
  text("Test - UNTIL sketch", 200, 280);
}
