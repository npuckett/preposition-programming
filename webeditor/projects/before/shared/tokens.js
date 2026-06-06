/** Base dialect — Technical Figure (site-wide). */
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

/** Ink Only — locked site-wide accent. */
export const COLOR_PALETTES = {
  monochrome: {
    id: "monochrome",
    name: "Ink Only",
    hex: "#111111",
    swatch: "#111111",
    accent: [17, 17, 17],
    accentMuted: [17, 17, 17, 160],
    inkOnly: true,
    note: "No spot color — active elements use heavier stroke, dashed ink, and filled silhouettes.",
  },
};

export function buildTechnicalStyle(paletteId) {
  const colors = COLOR_PALETTES[paletteId] || COLOR_PALETTES.monochrome;
  return {
    ...TECHNICAL_BASE,
    ...colors,
    paletteId,
  };
}
