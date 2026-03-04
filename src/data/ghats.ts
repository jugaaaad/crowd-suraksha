export interface GhatLocation {
  id: string;
  name: string;
  capacity: number;
  coords: { x: number; y: number }; // relative positions on mini-map (0-100)
  type: 'ghat' | 'bridge' | 'entry' | 'zone';
}

export const GHATS: GhatLocation[] = [
  { id: 'sangam-nose', name: 'Sangam Nose', capacity: 50000, coords: { x: 75, y: 30 }, type: 'zone' },
  { id: 'pontoon-1', name: 'Pontoon Bridge 1', capacity: 15000, coords: { x: 55, y: 45 }, type: 'bridge' },
  { id: 'pontoon-2', name: 'Pontoon Bridge 2', capacity: 15000, coords: { x: 60, y: 55 }, type: 'bridge' },
  { id: 'main-ghat', name: 'Main Ghat Entry', capacity: 80000, coords: { x: 35, y: 40 }, type: 'entry' },
  { id: 'arail-ghat', name: 'Arail Ghat', capacity: 40000, coords: { x: 80, y: 60 }, type: 'ghat' },
  { id: 'quila-ghat', name: 'Quila Ghat', capacity: 35000, coords: { x: 25, y: 50 }, type: 'ghat' },
  { id: 'rasoolabad', name: 'Rasoolabad Ghat', capacity: 30000, coords: { x: 40, y: 65 }, type: 'ghat' },
  { id: 'saraswati', name: 'Saraswati Ghat', capacity: 25000, coords: { x: 50, y: 35 }, type: 'ghat' },
  { id: 'sector-1-entry', name: 'Sector 1 Entry Gate', capacity: 60000, coords: { x: 20, y: 30 }, type: 'entry' },
  { id: 'vip-corridor', name: 'VIP Corridor', capacity: 10000, coords: { x: 45, y: 50 }, type: 'zone' },
];

export const getGhatById = (id: string) => GHATS.find(g => g.id === id);
