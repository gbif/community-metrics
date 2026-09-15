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

export const denmarkAccumulationData: CountryAccumulationData = {
  countryCode: 'DK',
  countryName: 'Denmark',
  lastModified: '2025-10-22',
  taxonomicGroups: [
    {
      group: 'Birds',
      color: '#F59E0B',
      totalSpecies: 287,
      totalOccurrences: 8945672,
      description: 'Scandinavian birds and Arctic migrants',
      data: generateAccumulationData(287)
    },
    {
      group: 'Plants',
      color: '#F97316',
      totalSpecies: 2134,
      totalOccurrences: 3456789,
      description: 'Temperate flora and coastal vegetation',
      data: generateAccumulationData(2134)
    },
    {
      group: 'Insects',
      color: '#EC4899',
      totalSpecies: 5672,
      totalOccurrences: 1234567,
      description: 'Northern European insects and pollinators',
      data: generateAccumulationData(5672)
    },
    {
      group: 'Marine Life',
      color: '#0891B2',
      totalSpecies: 1456,
      totalOccurrences: 567890,
      description: 'Baltic and North Sea marine species',
      data: generateAccumulationData(1456)
    },
    {
      group: 'Fungi',
      color: '#8B5CF6',
      totalSpecies: 3245,
      totalOccurrences: 234567,
      description: 'Forest and grassland fungi',
      data: generateAccumulationData(3245)
    },
    {
      group: 'Mammals',
      color: '#06B6D4',
      totalSpecies: 67,
      totalOccurrences: 145678,
      description: 'Scandinavian mammals and marine species',
      data: generateAccumulationData(67)
    },
    {
      group: 'Amphibians',
      color: '#4C9B45',
      totalSpecies: 13,
      totalOccurrences: 23456,
      description: 'Northern European frogs and toads',
      data: generateAccumulationData(13)
    }
  ]
};