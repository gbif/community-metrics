import { CountryAccumulationData } from './types';

// Generate sample accumulation data for different taxonomic groups
const generateAccumulationData = (maxSpecies: number, years: number = 15) => {
  const data = [];
  let cumulativeSpecies = 0;
  
  for (let i = 0; i < years; i++) {
    const year = 2010 + i;
    // Simulate realistic accumulation curve (fast growth initially, then leveling off)
    const progress = i / (years - 1);
    const growthFactor = 1 - Math.pow(progress, 2); // Quadratic decay for realistic curve
    const yearlyGrowth = Math.floor(maxSpecies * growthFactor * 0.15 * Math.random() + maxSpecies * 0.02);
    
    cumulativeSpecies = Math.min(cumulativeSpecies + yearlyGrowth, maxSpecies);
    const occurrences = Math.floor(cumulativeSpecies * (50 + Math.random() * 200));
    
    data.push({
      year,
      cumulativeSpecies,
      occurrences,
      newSpecies: yearlyGrowth
    });
  }
  
  return data;
};

export const botswanaAccumulationData: CountryAccumulationData = {
  countryCode: 'BW',
  countryName: 'Botswana',
  lastModified: '2025-10-22',
  taxonomicGroups: [
    {
      group: 'Birds',
      color: '#F59E0B',
      totalSpecies: 597,
      totalOccurrences: 125973,
      description: 'Native and migratory bird species in Botswana',
      data: generateAccumulationData(597)
    },
    {
      group: 'Insects',
      color: '#EC4899',
      totalSpecies: 1247,
      totalOccurrences: 45821,
      description: 'Beetles, butterflies, ants, and other insects',
      data: generateAccumulationData(1247)
    },
    {
      group: 'Mammals',
      color: '#06B6D4',
      totalSpecies: 164,
      totalOccurrences: 78933,
      description: 'African mammals including elephants, lions, and antelopes',
      data: generateAccumulationData(164)
    },
    {
      group: 'Plants',
      color: '#F97316',
      totalSpecies: 2387,
      totalOccurrences: 156742,
      description: 'Desert-adapted plants and savanna species',
      data: generateAccumulationData(2387)
    },
    {
      group: 'Reptiles',
      color: '#EF4444',
      totalSpecies: 156,
      totalOccurrences: 23456,
      description: 'Snakes, lizards, and tortoises of the Kalahari',
      data: generateAccumulationData(156)
    },
    {
      group: 'Amphibians',
      color: '#4C9B45',
      totalSpecies: 34,
      totalOccurrences: 8921,
      description: 'Frogs and toads adapted to arid conditions',
      data: generateAccumulationData(34)
    }
  ]
};