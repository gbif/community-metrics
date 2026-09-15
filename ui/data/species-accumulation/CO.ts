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

export const colombiaAccumulationData: CountryAccumulationData = {
  countryCode: 'CO',
  countryName: 'Colombia',
  lastModified: '2025-10-22',
  taxonomicGroups: [
    {
      group: 'Birds',
      color: '#F59E0B',
      totalSpecies: 1954,
      totalOccurrences: 24153535,
      description: 'Most diverse bird fauna in the world',
      data: generateAccumulationData(1954)
    },
    {
      group: 'Plants',
      color: '#F97316',
      totalSpecies: 28439,
      totalOccurrences: 1876342,
      description: 'Amazonian and Andean plant diversity',
      data: generateAccumulationData(28439)
    },
    {
      group: 'Insects',
      color: '#EC4899',
      totalSpecies: 8947,
      totalOccurrences: 456789,
      description: 'Tropical insects from rainforest to páramo',
      data: generateAccumulationData(8947)
    },
    {
      group: 'Mammals',
      color: '#06B6D4',
      totalSpecies: 543,
      totalOccurrences: 234567,
      description: 'Neotropical mammals including primates and ungulates',
      data: generateAccumulationData(543)
    },
    {
      group: 'Amphibians',
      color: '#4C9B45',
      totalSpecies: 892,
      totalOccurrences: 156789,
      description: 'Poison dart frogs and other Neotropical amphibians',
      data: generateAccumulationData(892)
    },
    {
      group: 'Reptiles',
      color: '#EF4444',
      totalSpecies: 634,
      totalOccurrences: 98765,
      description: 'Snakes, lizards, and caimans of tropical Colombia',
      data: generateAccumulationData(634)
    },
    {
      group: 'Fish',
      color: '#0891B2',
      totalSpecies: 1435,
      totalOccurrences: 345678,
      description: 'Freshwater fish from Amazonian and Orinoco basins',
      data: generateAccumulationData(1435)
    },
    {
      group: 'Mollusks',
      color: '#84CC16',
      totalSpecies: 756,
      totalOccurrences: 67891,
      description: 'Land and freshwater mollusks',
      data: generateAccumulationData(756)
    }
  ]
};