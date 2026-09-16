// DRISHTI — Centralized UI Z-Index Hierarchy
// Eliminates arbitrary z-index conflicts across tactical cartography and operations panels

export const Z_INDEX = {
  MAP_CANVAS: 0,
  MAP_OVERLAY_LAYER: 10,
  MAP_CONTROLS: 20,
  MAP_LEGEND: 30,
  MAP_STATUS: 30,
  MAP_TOOLBAR: 30,
  CAMERA_POPUP: 40,
  INCIDENT_POPUP: 50,
  SELECTED_OBJECT_PANEL: 60,
  GLOBAL_NAV: 100,
  MODAL: 1000
} as const;
