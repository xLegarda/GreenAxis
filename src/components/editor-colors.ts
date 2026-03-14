/**
 * Centralized color definitions for Editor.js
 * Prevents duplication and makes theme changes easier
 */

export const MARKER_COLORS = [
  { name: 'Amarillo', value: 'rgba(255, 235, 59, 0.4)' },
  { name: 'Verde', value: 'rgba(107, 190, 69, 0.4)' },
  { name: 'Azul', value: 'rgba(59, 130, 246, 0.4)' },
  { name: 'Rosa', value: 'rgba(236, 72, 153, 0.4)' },
  { name: 'Naranja', value: 'rgba(249, 115, 22, 0.4)' },
  { name: 'Púrpura', value: 'rgba(139, 92, 246, 0.4)' },
  { name: 'Cian', value: 'rgba(6, 182, 212, 0.4)' },
  { name: 'Rojo', value: 'rgba(239, 68, 68, 0.4)' },
]

export const TEXT_COLORS = [
  '#000000',
  '#374151',
  '#6BBE45',
  '#005A7A',
  '#DC2626',
  '#EA580C',
  '#CA8A04',
  '#7C3AED',
  '#DB2777',
  '#0891B2',
]

export const DARK_MODE_STYLES = {
  modal: {
    background: '#1f2937',
    color: '#ffffff',
    borderColor: '#374151',
  },
  close: {
    color: '#9ca3af',
  },
  light: {
    modal: {
      background: '#ffffff',
      color: '#000000',
      borderColor: '#e5e7eb',
    },
    close: {
      color: '#6b7280',
    },
  },
}
