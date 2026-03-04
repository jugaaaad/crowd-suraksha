export interface Muhurat {
  id: string;
  name: string;
  nameHindi: string;
  date: string; // ISO date
  time: string; // HH:MM
  significance: 'major' | 'medium' | 'minor';
  expectedCrowd: number;
  hotspots: string[]; // ghat IDs
}

// Generate muhurats relative to current time for demo purposes
export const generateMuhurats = (): Muhurat[] => {
  const now = new Date();
  
  return [
    {
      id: 'mauni-amavasya',
      name: 'Mauni Amavasya',
      nameHindi: 'मौनी अमावस्या',
      date: new Date(now.getTime() + 67 * 60000).toISOString().split('T')[0],
      time: new Date(now.getTime() + 67 * 60000).toTimeString().slice(0, 5),
      significance: 'major',
      expectedCrowd: 4000000,
      hotspots: ['sangam-nose', 'main-ghat', 'pontoon-1'],
    },
    {
      id: 'basant-panchami',
      name: 'Basant Panchami',
      nameHindi: 'बसंत पंचमी',
      date: new Date(now.getTime() + 185 * 60000).toISOString().split('T')[0],
      time: new Date(now.getTime() + 185 * 60000).toTimeString().slice(0, 5),
      significance: 'major',
      expectedCrowd: 3000000,
      hotspots: ['sangam-nose', 'arail-ghat', 'saraswati'],
    },
    {
      id: 'maghi-purnima',
      name: 'Maghi Purnima',
      nameHindi: 'माघी पूर्णिमा',
      date: new Date(now.getTime() + 420 * 60000).toISOString().split('T')[0],
      time: new Date(now.getTime() + 420 * 60000).toTimeString().slice(0, 5),
      significance: 'medium',
      expectedCrowd: 2000000,
      hotspots: ['quila-ghat', 'rasoolabad', 'pontoon-2'],
    },
    {
      id: 'maha-shivaratri',
      name: 'Maha Shivaratri',
      nameHindi: 'महा शिवरात्रि',
      date: new Date(now.getTime() + 1440 * 60000).toISOString().split('T')[0],
      time: new Date(now.getTime() + 1440 * 60000).toTimeString().slice(0, 5),
      significance: 'major',
      expectedCrowd: 5000000,
      hotspots: ['sangam-nose', 'main-ghat', 'sector-1-entry'],
    },
  ];
};
