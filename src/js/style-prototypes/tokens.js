/** Base dialect — Technical Figure (selected for site-wide use). */
export const TECHNICAL_BASE = {
  id: "technical",
  name: "Technical Figure",
  subtitle: "Annotated Diagram",
  bg: [252, 252, 250],
  ink: [17, 17, 17],
  muted: [120, 120, 118],
  light: [210, 210, 208],
  hatch: [200, 200, 198],
  fill: [245, 245, 243],
  objectA: [50, 50, 50],
  objectB: [90, 90, 90],
  showGrid: true,
  gridStep: 16,
  hatchObjects: false,
  dashedLeaders: true,
  figureTags: true,
};

/**
 * Accent palette options for Technical Figure.
 * Monochrome uses ink weight instead of hue for emphasis.
 */
export const COLOR_PALETTES = {
  monochrome: {
    id: "monochrome",
    name: "Ink Only",
    hex: "#111111",
    swatch: "#111111",
    accent: [17, 17, 17],
    accentMuted: [17, 17, 17, 160],
    inkOnly: true,
    note: "No spot color — active elements use heavier stroke, dashed ink, and filled silhouettes. Closest to original engraved plates.",
  },
  blueprint: {
    id: "blueprint",
    name: "Blueprint Blue",
    hex: "#2B5F8C",
    swatch: "#2B5F8C",
    accent: [43, 95, 140],
    accentMuted: [43, 95, 140, 120],
    inkOnly: false,
    note: "Muted prussian blue — classic coordinate/vector color in technical manuals. Reads as “measurement” not “warning.”",
  },
  sepia: {
    id: "sepia",
    name: "Sepia Ink",
    hex: "#7D5A2A",
    swatch: "#7D5A2A",
    accent: [125, 90, 42],
    accentMuted: [125, 90, 42, 120],
    inkOnly: false,
    note: "Warm brown ink — aged textbook / lithograph feel. Softer than red, still distinct from grey forms.",
  },
  vermillion: {
    id: "vermillion",
    name: "Vermillion",
    hex: "#C0392B",
    swatch: "#C0392B",
    accent: [192, 57, 43],
    accentMuted: [192, 57, 43, 120],
    inkOnly: false,
    note: "Annotation red — high contrast, draws the eye. Can feel alarm-like on relationship labels.",
  },
};

export const COLOR_PALETTE_ORDER = [
  "monochrome",
  "blueprint",
  "sepia",
  "vermillion",
];

export function buildTechnicalStyle(paletteId) {
  const colors = COLOR_PALETTES[paletteId] || COLOR_PALETTES.monochrome;
  return {
    ...TECHNICAL_BASE,
    ...colors,
    paletteId,
  };
}

/** Locked site-wide accent — Ink Only (greyscale + hatching). */
export const DEFAULT_ACCENT = "monochrome";

/** @deprecated Style comparison matrix — dialect chosen; kept for reference. */
export const STYLES = {
  engraving: {
    id: "engraving",
    name: "Engraving",
    subtitle: "Classical Plate",
    bg: [252, 252, 250],
    ink: [17, 17, 17],
    muted: [136, 136, 136],
    light: [220, 220, 218],
    hatch: [180, 180, 178],
    fill: [235, 235, 233],
    accent: [192, 57, 43],
    objectA: [60, 60, 60],
    objectB: [100, 100, 100],
    showGrid: false,
    hatchObjects: true,
    dashedLeaders: false,
    figureTags: false,
  },
  technical: buildTechnicalStyle("vermillion"),
  minimal: {
    id: "minimal",
    name: "Modern Minimal",
    subtitle: "Clean Schematic",
    bg: [252, 252, 250],
    ink: [17, 17, 17],
    muted: [136, 136, 136],
    light: [225, 225, 223],
    hatch: [200, 200, 198],
    fill: [60, 60, 60],
    accent: [192, 57, 43],
    objectA: [60, 60, 60],
    objectB: [100, 100, 100],
    showGrid: false,
    hatchObjects: false,
    dashedLeaders: false,
    figureTags: false,
  },
};

export const STYLE_ORDER = ["engraving", "technical", "minimal"];

export const EXAMPLES = [
  {
    id: "above",
    title: "Above",
    category: "Spatial",
    note: "Y-axis comparison — grid makes coordinate positions readable.",
  },
  {
    id: "toward",
    title: "Toward",
    category: "Movement",
    note: "Vector toward target — accent marks direction or active point.",
  },
  {
    id: "before",
    title: "Before",
    category: "Time",
    note: "Timeline axis — grid aligns ticks to coordinate space.",
  },
];
