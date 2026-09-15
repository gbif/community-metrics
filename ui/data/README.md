# Biodiversity Dashboard Data Management

This directory contains the data files and API functions for the GBIF biodiversity dashboard.

## Structure

```
/data/
├── api.ts              # Main API functions for loading country data
├── countries/          # Individual country data files
│   ├── AU.ts          # Australia metrics
│   ├── BW.ts          # Botswana metrics  
│   ├── DK.ts          # Denmark metrics
│   └── CO.ts          # Colombia metrics
└── README.md          # This documentation
```

## How to Edit Country Metrics

### Editing Existing Countries

To update the metrics for any country, simply edit the corresponding TypeScript file in `/data/countries/`. For example, to update Australia's data:

1. Open `/data/countries/AU.ts`
2. Modify any of the following fields:
   - `totalOccurrences`: Total occurrence records (e.g., "187.3 M")
   - `publishedByCountry`: Records published by the country
   - `datasets`: Number of datasets
   - `organizations`: Organization information
   - `species`: Total species count
   - `families`: Family count information
   - `literatureCount`: Current year literature count
   - `literatureTotal`: Historical literature total
   - `description`: Country description text
   - `chartTitle`: Title for the occurrence growth chart

3. Save the file - changes will be reflected immediately in the dashboard

### Adding New Countries

To add a new country:

1. Create a new TypeScript file in `/data/countries/` with the country code (e.g., `FR.ts` for France)
2. Copy the structure from an existing country file
3. Update all the metrics and information for the new country
4. Add the country code to the `availableCountries` array in `/App.tsx`
5. Add the country to the select dropdown in the App component
6. Update `/data/api.ts` to include the new country in the `enhancedCountryData` object

### Example Country Data Structure

```typescript
export const countryData = {
  name: "Country Name",
  code: "CC",
  totalOccurrences: "XX.X M",
  publishedByCountry: "XX.X M published by Country Name",
  datasets: "XXX",
  organizations: "XX organizations in Country Name",
  species: "XXX,XXX",
  families: "X,XXX families",
  literatureCount: "XX",
  literatureTotal: "XXX articles since 2008",
  description: "Occurrence record data about Country Name. These can be published by institutions within Country Name or from publishers outside of Country Name.",
  chartTitle: "Country Name Occurrence Records Over Time"
};
```

## Image Assets

Images for diversity maps and accumulation curves are managed in the `/data/api.ts` file. The system supports:

- **Species Richness Maps**: Hexagonal biodiversity visualizations
- **Chao1 Estimator Maps**: Expected species richness maps  
- **Accumulation Curves**: Species discovery over time charts

Countries with available assets (AU, DK) use direct image imports, while others use fallback placeholders that can be replaced when assets become available.

## API Functions

The `/data/api.ts` file provides:

- `getCountryData(countryCode)`: Async function to load specific country data
- `getAvailableCountries()`: Returns list of available country codes
- `CountryData` interface: TypeScript interface for country data structure

## Notes

- All changes to TypeScript files are reflected immediately without requiring app restart
- The system uses async loading to simulate API behavior and provide smooth UX
- Image assets are managed separately from the JSON data for better organization
- The structure is designed to easily migrate to a real API backend in the future