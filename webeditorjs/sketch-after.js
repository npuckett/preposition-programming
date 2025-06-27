/**
 * P5.js Sketch: AFTER - Movement Consequences
 * 
 * CONCEPT: "After" means occurring following a main event.
 * This shows objects scattering in different directions after
 * a collision point, demonstrating the consequences that follow.
 * 
 * LEARNING OBJECTIVES:
 * • Understand temporal sequence and consequences
 * • Practice state transitions and event results
 * • Learn simple physics and spreading effects
 * • Explore spatial representation of "after" relationships
 * 
 * KEY VARIABLES & METHODS:
 * • impact - central point where collision happens
 * • particles - objects that scatter after impact
 * • Simple radial movement from collision point
 * 
 * EXTENSION IDEAS:
 * • Different types of "after" effects
 * • Varying particle behaviors after collision
 * • Multiple collision points with different results
 */

// Central impact point
let impact = {
  x: 200,
  y: 150,
  size: 20,
  hasHappened: false
};

// Moving object that causes impact
let projectile = {
  x: 50,
  y: 150,
  targetX: 200,
  targetY: 150,
  speed: 4,
  size: 8,
  isMoving: false
};

// Particles that scatter after impact
let particles = [];

// Trail for projectile
let projectileTrail = [];

function setup() {
  createCanvas(400, 300);
  
  // Initialize particles around impact point
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i;
    
    // Create a single particle object with a clear name
    let newParticle = {
      x: impact.x,
      y: impact.y,
      vx: cos(angle) * 2,
      vy: sin(angle) * 2,
      size: 6,
      isScattering: false,
      trail: [],
      color: [random(100, 255), random(100, 255), random(100, 255)]
    };
    
    // Add the named particle to the array
    particles.push(newParticle);
  }
}

function draw() {
  background(240, 248, 255);
  
  // Update projectile movement
  if (projectile.isMoving && !impact.hasHappened) {
    updateProjectile();
  }
  
  // Update particle scattering after impact
  if (impact.hasHappened) {
    updateParticles();
  }
  
  // Draw impact zone
  drawImpactZone();
  
  // Draw projectile
  drawProjectile();
  
  // Draw particles
  drawParticles();
  
  // Draw status
  drawStatus();
}

function updateProjectile() {
  // Move toward impact point
  let dx = projectile.targetX - projectile.x;
  let dy = projectile.targetY - projectile.y;
  let distance = sqrt(dx * dx + dy * dy);
  
  // Add to trail
  let trailPoint = { x: projectile.x, y: projectile.y };
  projectileTrail.push(trailPoint);
  if (projectileTrail.length > 50) projectileTrail.shift();
  
  // Check for impact
  if (distance < projectile.speed + impact.size/2) {
    impact.hasHappened = true;
    projectile.isMoving = false;
    
    // Start particle scattering after impact
    for (let particle of particles) {
      particle.isScattering = true;
    }
    return;
  }
  
  // Move projectile
  let angle = atan2(dy, dx);
  projectile.x += cos(angle) * projectile.speed;
  projectile.y += sin(angle) * projectile.speed;
}

function updateParticles() {
  for (let particle of particles) {
    if (particle.isScattering) {
      // Move particle
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Add to trail
      let particleTrailPoint = { x: particle.x, y: particle.y };
      particle.trail.push(particleTrailPoint);
      if (particle.trail.length > 30) particle.trail.shift();
      
      // Slow down over time
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      
      // Stop when very slow
      if (abs(particle.vx) < 0.1 && abs(particle.vy) < 0.1) {
        particle.isScattering = false;
      }
    }
  }
}

function drawImpactZone() {
  // Draw impact point
  if (impact.hasHappened) {
    fill(255, 100, 100);
    stroke(200, 50, 50);
  } else {
    fill(200);
    stroke(150);
  }
  strokeWeight(2);
  ellipse(impact.x, impact.y, impact.size, impact.size);
  
  // Draw target rings
  if (!impact.hasHappened) {
    noFill();
    stroke(150, 100);
    strokeWeight(1);
    ellipse(impact.x, impact.y, impact.size + 10, impact.size + 10);
    ellipse(impact.x, impact.y, impact.size + 20, impact.size + 20);
  }
}

function drawProjectile() {
  // Draw projectile trail
  if (projectileTrail.length > 1) {
    stroke(70, 130, 180, 150);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < projectileTrail.length; i++) {
      vertex(projectileTrail[i].x, projectileTrail[i].y);
    }
    endShape();
  }
  
  // Draw projectile (if still moving)
  if (projectile.isMoving) {
    fill(70, 130, 180);
    noStroke();
    ellipse(projectile.x, projectile.y, projectile.size, projectile.size);
  }
}

function drawParticles() {
  for (let particle of particles) {
    // Draw particle trail
    if (particle.trail.length > 1) {
      stroke(particle.color[0], particle.color[1], particle.color[2], 150);
      strokeWeight(2);
      noFill();
      beginShape();
      for (let i = 0; i < particle.trail.length; i++) {
        vertex(particle.trail[i].x, particle.trail[i].y);
      }
      endShape();
    }
    
    // Draw particle
    fill(particle.color[0], particle.color[1], particle.color[2]);
    noStroke();
    ellipse(particle.x, particle.y, particle.size, particle.size);
  }
}

function drawStatus() {
  fill(60);
  textAlign(CENTER);
  textSize(14);
  
  if (!projectile.isMoving && !impact.hasHappened) {
    text("Click to launch projectile toward impact point", width/2, height - 20);
  } else if (projectile.isMoving) {
    text("Projectile moving toward collision point", width/2, height - 20);
  } else if (impact.hasHappened) {
    let stillScattering = particles.some(p => p.isScattering);
    if (stillScattering) {
      text("Particles scattering AFTER impact", width/2, height - 20);
    } else {
      text("Scattering complete - click to restart", width/2, height - 20);
    }
  }
}

function mousePressed() {
  // Reset and start new sequence
  projectile.x = 50;
  projectile.y = 150;
  projectile.isMoving = true;
  impact.hasHappened = false;
  projectileTrail = [];
  
  // Reset particles to center
  for (let i = 0; i < particles.length; i++) {
    let angle = (TWO_PI / particles.length) * i;
    particles[i].x = impact.x;
    particles[i].y = impact.y;
    particles[i].vx = cos(angle) * 2;
    particles[i].vy = sin(angle) * 2;
    particles[i].isScattering = false;
    particles[i].trail = [];
  }
}
