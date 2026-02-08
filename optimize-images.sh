#!/bin/bash
# Image Optimization Script

IMAGES_DIR="assets/images"
QUALITY=85
MAX_WIDTH=1200

echo "Optimizing images..."

for img in "$IMAGES_DIR"/*.jpg "$IMAGES_DIR"/*.jpeg 2>/dev/null; do
  [ -f "$img" ] || continue
  
  filename=$(basename "$img")
  echo "Processing: $filename"
  
  # Create backup
  cp "$img" "$img.backup"
  
  # Resize and compress
  sips -Z $MAX_WIDTH "$img" --out "$img.optimized" -s formatOptions $QUALITY
  
  # Replace original
  mv "$img.optimized" "$img"
  
  echo "  ✓ Optimized $filename"
done

echo ""
echo "Done! Originals backed up with .backup extension"
