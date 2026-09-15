# Taxonomic Diversity Data

This folder contains structured data for taxonomic diversity charts, organized by country.

## Structure

```
taxonomic-diversity/
├── types.ts          # TypeScript interfaces and color constants
├── api.ts            # API functions to access the data
├── AU.ts            # Australia taxonomic data
├── BW.ts            # Botswana taxonomic data  
├── CO.ts            # Colombia taxonomic data (template)
├── DK.ts            # Denmark taxonomic data (template)
└── README.md        # This file
```

## How to Add New Country Data

1. **Create a new country file** (e.g., `FR.ts` for France):
```typescript
import { TaxonomicDiversityData, TAXONOMIC_COLORS } from './types';

export const franceTaxonomicData: TaxonomicDiversityData = {
  countryCode: 'FR',
  countryName: 'France',
  totalSpecies: 12345, // Total number of species
  groups: [
    {
      name: 'Flowering Plants',
      species: 5000,
      percentage: 40.5,
      color: TAXONOMIC_COLORS.floweringPlants,
      description: 'Description of the group',
      examples: ['Example 1', 'Example 2', 'Example 3']
    },
    // Add more groups...
  ]
};
```

2. **Import the data in api.ts**:
```typescript
import { franceTaxonomicData } from './FR';

// Add to the registry
const taxonomicDataRegistry: Record<string, TaxonomicDiversityData> = {
  AU: australiaTaxonomicData,
  BW: botswanaTaxonomicData,
  FR: franceTaxonomicData, // Add this line
  // ... other countries
};
```

## Data Validation

The `validateTaxonomicData()` function in `api.ts` checks:
- Percentages sum to approximately 100%
- Species counts match the total
- No duplicate group names
- Valid color formats (hex codes)

## Usage in Components

```typescript
import { getTaxonomicDiversityData } from '../data/taxonomic-diversity/api';

// Get data for a country
const taxonomicData = await getTaxonomicDiversityData('AU');

// Get list of available countries
const availableCountries = await getAvailableTaxonomicCountries();
```

## Color Palette

Predefined colors are available in `TAXONOMIC_COLORS`:
- **Mammals**: `#F0BE48` (gold)
- **Birds**: `#0079B5` (blue)
- **Reptiles**: `#684393` (purple)
- **Amphibians**: `#4C9B45` (green)
- **Insects**: `#E27B72` (coral)
- **Flowering Plants**: `#4C9B45` (green)
- **Fungi**: `#684393` / `#4F4C4D` (purple/brown)
- **Other**: `#999999` (gray)

## Tips for Data Entry

1. **Percentages should sum to 100%** - The validation will catch this if not
2. **Species counts should match total** - Make sure individual counts add up
3. **Use consistent group naming** - Follow the examples (e.g., "Flowering Plants" not "flowering plants")
4. **Choose appropriate colors** - Use the predefined colors for consistency
5. **Add descriptions and examples** - These help users understand the data better

## Data Sources

Document your data sources in each country file as comments:
```typescript
// Data source: National Biodiversity Database, accessed 2025-10-21
// URL: https://example.com/biodiversity-data
```