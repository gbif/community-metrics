
library(dplyr)
library(sf)
library(ggplot2)
library(rgbif)
library(vegan)  # for rarefy() function

sql <-
"
SELECT
  level0gid,
  GBIF_ISEA3HCode(
    9, 
    decimalLatitude,
    decimalLongitude,
    COALESCE(coordinateUncertaintyInMeters, 1000)
  ) AS geogrid_id,
  speciesKey,
  COUNT(*) AS n_records
FROM occurrence
WHERE level0gid='COL'
AND coordinateUncertaintyInMeters <= 2000
AND hasGeospatialIssues = FALSE
AND hasCoordinate = TRUE
AND occurrenceStatus = 'PRESENT'
GROUP BY level0gid, geogrid_id, speciesKey;
"

occ_download_sql(sql)
key <- "0054037-250920141307145" # CO 
# key <- "0053432-250920141307145" # DK 

d <- occ_download_get(key) %>% 
    occ_download_import() |>   
    mutate(geogrid_id = as.character(geogrid_id)) 

# Calculate Chao1 for each grid cell
calculate_chao1 <- function(abundance_vector) {
  # Remove zero abundances
  abundance_vector <- abundance_vector[abundance_vector > 0]
  
  if (length(abundance_vector) < 2) {
    return(NA)  # Need at least 2 species for Chao1
  }
  
  # Use vegan's estimateR function to calculate Chao1
  chao1_result <- estimateR(abundance_vector)
  return(chao1_result["S.chao1"])
}

community_matrix <- d %>%
  select(geogrid_id, specieskey, n_records) %>%
  tidyr::pivot_wider(names_from = specieskey, values_from = n_records, values_fill = 0) %>%
  tibble::column_to_rownames("geogrid_id")


# Calculate Chao1 for each grid cell
chao1_results <- community_matrix %>% 
  tibble::rownames_to_column("geogrid_id") %>%  # Convert rownames to column first
  rowwise() %>%
  mutate(
    observed_species = sum(c_across(-geogrid_id) > 0),      # Exclude geogrid_id from calculations
    total_individuals = sum(c_across(-geogrid_id)),
    chao1 = calculate_chao1(c_across(-geogrid_id))
  ) %>%
  select(geogrid_id, observed_species, total_individuals, chao1)

# Save chao1_results to RDA file
save(chao1_results, file = "diversity-metrics/chao1_results_CO.rda")

# Load chao1_results from RDA file
load("diversity-metrics/chao1_results_CO.rda")

# Define plot parameters
cutoff <- 5000
plot_expand <- 0.2
cutoff_label <- ">5K"

# make sure to use the correct resolution shapefile
sf_obj <- st_read("data/ISEA3H-shapefiles/resolution-9/")

dd <- merge(sf_obj, chao1_results, by = "geogrid_id") 

# Calculate bounding box with buffer
bbox <- st_bbox(dd)
buffer_x <- (bbox["xmax"] - bbox["xmin"]) * plot_expand
buffer_y <- (bbox["ymax"] - bbox["ymin"]) * plot_expand

p <- ggplot() +
  geom_sf(data = dd, aes(fill = chao1)) +
  coord_sf(
    xlim = c(bbox["xmin"] - buffer_x, bbox["xmax"] + buffer_x),
    ylim = c(bbox["ymin"] - buffer_y, bbox["ymax"] + buffer_y),
    expand = FALSE, 
    clip = "off"
  ) +
  scale_fill_viridis_c(
    name = NULL,
    limits = c(0, cutoff), 
    oob = scales::squish,   # squish values outside into the nearest limit
    labels = function(x) ifelse(x == cutoff, cutoff_label, paste0(x/1000, "K"))
  ) +
  theme_minimal() +
  theme(
    panel.grid = element_blank(),        # Remove all grid lines
    legend.position = c(0.5, 0.1),      # Move legend inside plot at bottom center
    legend.direction = "horizontal",     # Keep legend horizontal
    legend.text = element_text(size = 12), # Make legend text larger
    legend.key.width = unit(2, "cm"),    # Make legend keys wider
    legend.key.height = unit(0.5, "cm"),  # Make legend keys taller
    plot.margin = margin(0, 0, 0, 0, "cm"), # Remove plot margins
    axis.title.x = element_blank(),      # Remove x axis label
    axis.title.y = element_blank(),      # Remove y axis label
    axis.text.x = element_blank(),       # Remove x axis tick labels
    axis.text.y = element_blank()        # Remove y axis tick labels
  ) 

# ggsave(p, filename = "species-count-maps/plots/grid_plot.svg", width = 12, height = 8)
# ggsave(p, filename = "diversity-metrics/plots/AU-chao1.png", width = 12, height = 8, dpi = 900)
ggsave(p, filename = "diversity-metrics/plots/CO-chao1.png", width = 12, height = 8, dpi = 900)
# ggsave(p, filename = "diversity-metrics/plots/DK-chao1.png", width = 12, height = 8, dpi = 900)



# Calculate ES50 for each grid cell
# calculate_es50 <- function(abundance_vector) {
#   total_individuals <- sum(abundance_vector)
#   if (total_individuals < 50) {
#     return(NA)  # Not enough individuals for ES50
#   }
#   # Use vegan's rarefy function to calculate expected species at n=50
#   es50 <- rarefy(abundance_vector, sample = 50)
#   return(es50)
# }

# # Create community matrix (grid cells × species)
# community_matrix <- d %>%
#   select(geogrid_id, speciesKey, abundance) %>%
#   pivot_wider(names_from = speciesKey, values_from = abundance, values_fill = 0) %>%
#   column_to_rownames("geogrid_id")

# # Calculate ES50 for each grid cell
# es50_results <- community_matrix %>%
#   rowwise() %>%
#   mutate(
#     total_individuals = sum(c_across(everything())),
#     es50 = if_else(total_individuals >= 50, 
#                    rarefy(c_across(everything()), sample = 50),
#                    NA_real_)
#   ) %>%
#   select(es50, total_individuals) %>%
#   rownames_to_column("geogrid_id")

