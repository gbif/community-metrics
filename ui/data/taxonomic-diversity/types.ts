// Types for taxonomic diversity chart data
export interface TaxonomicDiversityData {
  countryCode: string;
  countryName: string;
  totalSpecies: number;
  groups: TaxonomicGroup[];
  kingdomSummaries?: KingdomSummary[];
  taxonomicRanks?: TaxonomicRanks;
}

export interface TaxonomicGroup {
  name: string;
  species: number;
  percentage: number;
  kingdom?: string;
  // Optional fields for additional metadata
  description?: string;
  scientificName?: string;
  examples?: string[];
}

export interface KingdomSummary {
  kingdom: string;
  species: number;
  percentage: number;
}

export interface TaxonomicRanks {
  uniqueGenera: number;
  uniqueFamilies: number;
  uniqueOrders: number;
  uniqueClasses: number;
  uniquePhyla: number;
  uniqueKingdoms: number;
}

// Predefined color palette for consistency
export const TAXONOMIC_COLORS = {
  // Primary groups - vibrant colors
  mammals: '#F0BE48',
  birds: '#0079B5', 
  reptiles: '#684393',
  amphibians: '#4C9B45',
  fish: '#20B4E9',
  
  // Plants - green tones
  floweringPlants: '#4C9B45',
  ferns: '#F0BE48',
  gymnosperms: '#E27B72',
  mosses: '#20B4E9',
  
  // Invertebrates - varied colors
  insects: '#E27B72',
  arachnids: '#0079B5',
  molluscs: '#D0628D',
  crustaceans: '#F0BE48',
  
  // Fungi - earth tones
  basidiomycota: '#684393',
  ascomycota: '#4F4C4D',
  sacFungi: '#4F4C4D',
  
  // Other/miscellaneous
  other: '#999999',
  unknown: '#CCCCCC'
} as const;

export type ColorKey = keyof typeof TAXONOMIC_COLORS;