#!/bin/bash

# GBIF Metrics Data Generation Pipeline
# Automates running R scripts to generate biodiversity metrics data
# Ensures only one GBIF download runs at a time via sequential execution

set -e  # Exit on error

#==============================================================================
# Configuration & Defaults
#==============================================================================

CURRENT_YEAR=$(date +%Y)
PREVIOUS_YEAR=$((CURRENT_YEAR - 1))
TWO_YEARS_AGO=$((CURRENT_YEAR - 2))
THREE_YEARS_AGO=$((CURRENT_YEAR - 3))
START_YEAR=2010
LITERATURE_START_YEAR=2008
DRY_RUN=false
CLEAN_DOWNLOADS=false
SKIP_SCRIPTS=""
ONLY_SCRIPT=""

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

#==============================================================================
# Helper Functions
#==============================================================================

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_step() {
    echo ""
    echo -e "${GREEN}▶${NC} $1"
    echo -e "${BLUE}$(date '+%Y-%m-%d %H:%M:%S')${NC}"
}

show_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Automates GBIF metrics data generation pipeline with configurable year parameters.
Runs R scripts sequentially to ensure only one GBIF download is active at a time.

OPTIONS:
    --year YEAR              Current year (default: $CURRENT_YEAR)
    --previous-year YEAR     Previous year (default: auto-calculated)
    --start-year YEAR        Start year for time series (default: $START_YEAR)
    --skip SCRIPTS           Comma-separated list of scripts to skip
                            (e.g., "export-geojson,generate-summary-metrics")
    --only SCRIPT           Run only one specific script
                            (e.g., "process-time-series")
    --dry-run               Show commands without executing
    --clean-downloads       Delete cached GBIF downloads before running
    -h, --help              Show this help message

SCRIPT NAMES:
    dataset-scatterplot         dataset-scatterplot-sql.R
    species-occurrence-table    species-occurrence-table-sql.R
    taxonomic-diversity         taxonomic-diversity-sql.R
    process-time-series         process-time-series.R
    process-publishing-time-series  process-publishing-time-series.R
    species-accumulation        species-accumulation-curves.R
    export-geojson              export-geojson.R
    generate-summary-metrics    generate-summary-metrics.R

EXAMPLES:
    # Full pipeline with default years
    $0

    # Preview commands for year 2027
    $0 --year 2027 --dry-run

    # Run only one script
    $0 --only process-time-series --year 2027

    # Skip slow export-geojson script
    $0 --skip export-geojson

    # Clean old downloads and run with custom year range
    $0 --year 2027 --start-year 2012 --clean-downloads

EOF
}

#==============================================================================
# Build R Script Arguments
#==============================================================================

get_script_args() {
    local script_name=$1
    local args=""
    
    case "$script_name" in
        "dataset-scatterplot")
            # No year parameters needed
            args=""
            ;;
            
        "species-occurrence-table")
            args="--previous-year $PREVIOUS_YEAR --two-years-ago $TWO_YEARS_AGO"
            ;;
            
        "taxonomic-diversity")
            # No year parameters needed
            args=""
            ;;
            
        "process-time-series"|"process-publishing-time-series")
            args="--start-year $START_YEAR --end-year $PREVIOUS_YEAR"
            ;;
            
        "species-accumulation")
            args="--end-year $CURRENT_YEAR"
            ;;
            
        "export-geojson")
            # No year parameters needed
            args=""
            ;;
            
        "generate-summary-metrics")
            args="--current-year $CURRENT_YEAR --previous-year $PREVIOUS_YEAR --two-years-ago $TWO_YEARS_AGO --three-years-ago $THREE_YEARS_AGO --lit-start-year $LITERATURE_START_YEAR"
            ;;
    esac
    
    echo "$args"
}

#==============================================================================
# Script Execution Functions
#==============================================================================

should_skip_script() {
    local script_name=$1
    
    # Check if only running one specific script
    if [ -n "$ONLY_SCRIPT" ] && [ "$script_name" != "$ONLY_SCRIPT" ]; then
        return 0  # Skip (true)
    fi
    
    # Check if in skip list
    if [[ ",$SKIP_SCRIPTS," == *",$script_name,"* ]]; then
        return 0  # Skip (true)
    fi
    
    return 1  # Don't skip (false)
}

run_r_script() {
    local script_name=$1
    local script_path=$2
    local description=$3
    
    if should_skip_script "$script_name"; then
        print_warning "Skipping $script_name"
        return 0
    fi
    
    print_step "Running $script_name"
    print_info "$description"
    
    # Get script arguments
    local script_args=$(get_script_args "$script_name")
    
    # Change to script's directory
    local script_dir=$(dirname "$script_path")
    cd "$script_dir"
    
    if [ "$DRY_RUN" = true ]; then
        if [ -n "$script_args" ]; then
            print_info "DRY RUN: Would execute: Rscript.exe $(basename $script_path) $script_args"
        else
            print_info "DRY RUN: Would execute: Rscript.exe $(basename $script_path)"
        fi
    else
        local start_time=$(date +%s)
        
        # Run the R script with arguments
        if [ -n "$script_args" ]; then
            print_info "Arguments: $script_args"
            if Rscript.exe "$(basename $script_path)" $script_args; then
                local end_time=$(date +%s)
                local duration=$((end_time - start_time))
                print_success "Completed in ${duration}s"
            else
                local end_time=$(date +%s)
                local duration=$((end_time - start_time))
                print_error "Failed after ${duration}s"
                return 1
            fi
        else
            if Rscript.exe "$(basename $script_path)"; then
                local end_time=$(date +%s)
                local duration=$((end_time - start_time))
                print_success "Completed in ${duration}s"
            else
                local end_time=$(date +%s)
                local duration=$((end_time - start_time))
                print_error "Failed after ${duration}s"
                return 1
            fi
        fi
    fi
    
    # Return to metrics directory
    cd "$SCRIPT_DIR"
}

clean_downloads_directory() {
    if [ "$CLEAN_DOWNLOADS" = true ]; then
        print_step "Cleaning cached GBIF downloads..."
        
        local patterns=(
            "*-[0-9]*-[0-9]*.zip"
            "dataset-scatter-*.zip"
            "time-series-*.zip"
            "species-acc-*.zip"
            "occurrence-*.zip"
            "groups-*.zip"
            "kingdoms-ranks-*.zip"
            "publisher-*.zip"
        )
        
        local count=0
        for pattern in "${patterns[@]}"; do
            for file in $SCRIPT_DIR/*/$pattern $SCRIPT_DIR/*/*/$pattern; do
                if [ -f "$file" ]; then
                    if [ "$DRY_RUN" = true ]; then
                        print_info "Would delete: $(basename $file)"
                    else
                        rm -f "$file"
                        print_success "Deleted: $(basename $file)"
                    fi
                    ((count++))
                fi
            done
        done
        
        if [ $count -eq 0 ]; then
            print_info "No cached downloads found"
        else
            print_success "Cleaned $count download file(s)"
        fi
    fi
}

#==============================================================================
# Main Pipeline
#==============================================================================

run_pipeline() {
    print_header "GBIF Metrics Data Generation Pipeline"
    echo ""
    print_info "Current Year:    $CURRENT_YEAR"
    print_info "Previous Year:   $PREVIOUS_YEAR"
    print_info "Start Year:      $START_YEAR"
    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY RUN MODE - No changes will be made"
    fi
    echo ""

    
    # Clean downloads if requested
    clean_downloads_directory
    
    # Define all scripts in execution order (sequential to respect GBIF API limits)
    declare -A scripts=(
        ["dataset-scatterplot"]="$SCRIPT_DIR/dataset-scatterplot-metrics/dataset-scatterplot-sql.R|Dataset scatter plot data (1 GBIF download)"
        ["species-occurrence-table"]="$SCRIPT_DIR/species-occurrence-table-metrics/species-occurrence-table-sql.R|Species occurrence table (4 GBIF downloads - longest!)"
        ["taxonomic-diversity"]="$SCRIPT_DIR/taxonomic-diversity-metrics/taxonomic-diversity-sql.R|Taxonomic diversity data (2 GBIF downloads)"
        ["process-time-series"]="$SCRIPT_DIR/occurrence-publishing-time-series/process-time-series.R|Occurrence time series (1 GBIF download)"
        ["process-publishing-time-series"]="$SCRIPT_DIR/occurrence-publishing-time-series/process-publishing-time-series.R|Publisher time series (1 GBIF download)"
        ["species-accumulation"]="$SCRIPT_DIR/species-acc-metrics/species-accumulation-curves.R|Species accumulation curves (1 GBIF download)"
        ["export-geojson"]="$SCRIPT_DIR/species-count-maps-metrics/export-geojson.R|Species count maps (per-country downloads - very slow!)"
        ["generate-summary-metrics"]="$SCRIPT_DIR/summary-metrics/generate-summary-metrics.R|Summary metrics (API only, no downloads)"
    )
    
    # Execution order (sequential to ensure one GBIF download at a time)
    local execution_order=(
        "dataset-scatterplot"
        "species-occurrence-table"
        "taxonomic-diversity"
        "process-time-series"
        "process-publishing-time-series"
        "species-accumulation"
        "export-geojson"
        "generate-summary-metrics"
    )
    
    local total_scripts=${#execution_order[@]}
    local completed=0
    local failed=0
    local skipped=0
    
    # Process each script
    for script_name in "${execution_order[@]}"; do
        local script_info="${scripts[$script_name]}"
        local script_path=$(echo "$script_info" | cut -d'|' -f1)
        local description=$(echo "$script_info" | cut -d'|' -f2)
        
        if [ ! -f "$script_path" ]; then
            print_error "Script not found: $script_path"
            ((failed++))
            continue
        fi
        
        if should_skip_script "$script_name"; then
            skipped=$((skipped + 1))
            continue
        fi
        
        # Run the script with appropriate arguments
        if run_r_script "$script_name" "$script_path" "$description"; then
            completed=$((completed + 1))
        else
            failed=$((failed + 1))
            print_error "Pipeline continuing despite failure..."
        fi
    done
    
    # Summary
    print_header "Pipeline Summary"
    echo ""
    print_info "Total Scripts:   $total_scripts"
    print_success "Completed:       $completed"
    if [ $skipped -gt 0 ]; then
        print_warning "Skipped:         $skipped"
    fi
    if [ $failed -gt 0 ]; then
        print_error "Failed:          $failed"
    fi
    echo ""
    
    if [ "$DRY_RUN" = true ]; then
        print_info "This was a dry run. No scripts were executed."
        print_info "Run without --dry-run to execute the pipeline."
    else
        if [ $failed -eq 0 ]; then
            print_success "Pipeline completed successfully!"
        else
            print_warning "Pipeline completed with errors."
            exit 1
        fi
    fi
}

#==============================================================================
# Argument Parsing
#==============================================================================

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --year)
                CURRENT_YEAR="$2"
                PREVIOUS_YEAR=$((CURRENT_YEAR - 1))
                TWO_YEARS_AGO=$((CURRENT_YEAR - 2))
                THREE_YEARS_AGO=$((CURRENT_YEAR - 3))
                shift 2
                ;;
            --previous-year)
                PREVIOUS_YEAR="$2"
                TWO_YEARS_AGO=$((PREVIOUS_YEAR - 1))
                THREE_YEARS_AGO=$((PREVIOUS_YEAR - 2))
                shift 2
                ;;
            --start-year)
                START_YEAR="$2"
                shift 2
                ;;
            --skip)
                SKIP_SCRIPTS="$2"
                shift 2
                ;;
            --only)
                ONLY_SCRIPT="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --clean-downloads)
                CLEAN_DOWNLOADS=true
                shift
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

#==============================================================================
# Entry Point
#==============================================================================

main() {
    parse_arguments "$@"
    run_pipeline
}

# Run main function
main "$@"
