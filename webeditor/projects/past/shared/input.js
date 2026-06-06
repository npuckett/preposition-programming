/**
 * Unified pointer input for mouse and touch.
 */
export function bindPointerInput(p, handlers = {}) {
  const { onPress, onDrag, onRelease } = handlers;

  if (onPress) {
    p.mousePressed = () => onPress();
    p.touchStarted = () => {
      onPress();
      return false;
    };
  }

  if (onDrag) {
    p.mouseDragged = () => onDrag();
    p.touchMoved = () => {
      onDrag();
      return false;
    };
  }

  if (onRelease) {
    p.mouseReleased = () => onRelease();
    p.touchEnded = () => {
      onRelease();
      return false;
    };
  }
}

export function pointerX(p) {
  return p.touches.length > 0 ? p.touches[0].x : p.mouseX;
}

export function pointerY(p) {
  return p.touches.length > 0 ? p.touches[0].y : p.mouseY;
}

export function hitCircle(p, x, y, cx, cy, radius) {
  return p.dist(x, y, cx, cy) < radius;
}

/** Wire drag for an array of { x, y, radius, dragging } circles. */
export function bindCircleDrag(p, circles) {
  bindPointerInput(p, {
    onPress: () => {
      const x = pointerX(p);
      const y = pointerY(p);
      for (const c of circles) {
        if (hitCircle(p, x, y, c.x, c.y, c.radius)) {
          c.dragging = true;
          return;
        }
      }
    },
    onDrag: () => {
      const x = pointerX(p);
      const y = pointerY(p);
      for (const c of circles) {
        if (c.dragging) {
          c.x = x;
          c.y = y;
        }
      }
    },
    onRelease: () => {
      for (const c of circles) {
        c.dragging = false;
      }
    },
  });
}
