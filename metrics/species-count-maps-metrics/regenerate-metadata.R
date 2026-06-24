library(sf)
library(jsonlite)
library(dplyr)

# Source shared attribution utilities
source("../shared/attribution-utils.R")

cat("Regenerating metadata from existing GeoJSON files...\n\n")

# Directory with GeoJSON files
geojson_dir <- "../../ui/public/data/species-count-maps/countries"
metadata_file <- "../../ui/public/data/species-count-maps/metadata.json"

# Get all existing GeoJSON files
geojson_files <- list.files(geojson_dir, pattern = "\\.geojson$", full.names = TRUE)
country_codes <- gsub("\\.geojson$", "", basename(geojson_files))

cat(paste0("Found ", length(geojson_files), " existing GeoJSON files\n"))
cat(paste0("Generating metadata for all countries...\n\n"))

# Initialize metadata list
metadata_list <- list()

# Process each country
for (i in seq_along(geojson_files)) {
  country_code <- country_codes[i]
  geojson_file <- geojson_files[i]
  
  cat(paste0("[", i, "/", length(geojson_files), "] Processing ", country_code, "...\n"))
  
  tryCatch({
    # Read GeoJSON
    grid_data <- st_read(geojson_file, quiet = TRUE)
    
    # Calculate bounds
    bbox <- st_bbox(grid_data)
    
    # Calculate centroid (disable S2 to avoid degenerate edge errors)
    sf_use_s2(FALSE)
    centroid <- st_centroid(st_union(grid_data)) %>% st_coordinates()
    sf_use_s2(TRUE)
    
    # Get statistics
    max_count <- max(grid_data$unique_species_count, na.rm = TRUE)
    min_count <- min(grid_data$unique_species_count, na.rm = TRUE)
    
    # Create metadata entry
    metadata_entry <- list(
      countryCode = country_code,
      centroid = list(
        lat = as.numeric(centroid[2]),
        lng = as.numeric(centroid[1])
      ),
      bounds = list(
        north = as.numeric(bbox["ymax"]),
        south = as.numeric(bbox["ymin"]),
        east = as.numeric(bbox["xmax"]),
        west = as.numeric(bbox["xmin"])
      ),
      totalGridCells = nrow(grid_data),
      maxSpeciesCount = as.integer(max_count),
      minSpeciesCount = as.integer(min_count)
    )
    
    # Try to get download attribution if downloadKey exists in the data
    if ("downloadKey" %in% names(grid_data) && !is.na(grid_data$downloadKey[1]) && grid_data$downloadKey[1] != "") {
      download_key <- as.character(grid_data$downloadKey[1])
      cat(paste0("  Found downloadKey: ", download_key, "\n"))
      download_attribution <- get_download_attribution(download_key)
      if (!is.null(download_attribution)) {
        metadata_entry$downloadAttribution <- download_attribution
      }
    }
    
    metadata_list[[country_code]] <- metadata_entry
    cat(paste0("  ✓ Generated metadata\n"))
    
  }, error = function(e) {
    cat(paste0("  ✗ Error: ", e$message, "\n"))
  })
}

# Save metadata.json
cat(paste0("\nSaving metadata to ", metadata_file, "...\n"))
write_json(metadata_list, metadata_file, auto_unbox = TRUE, pretty = TRUE)

cat(paste0("\n✓ Successfully regenerated metadata for ", length(metadata_list), " countries\n"))
cat(paste0("  Metadata file: ", metadata_file, "\n"))
