#!/bin/bash
# CSS Build Script
# Combines and minifies CSS files for production

echo "Building CSS..."

# Combine all CSS files in order
cat css/01-base.css css/02-components.css css/03-layout.css css/04-responsive.css css/05-i18n.css > styles.combined.css

# Basic minification (remove comments and whitespace)
echo "Minifying..."
# Remove single-line comments
grep -v "^\s*/\*" styles.combined.css | \
grep -v "^\s*\*" | \
grep -v "^\s*$" | \
sed 's/  */ /g' | \
sed 's/ {/ {/g' | \
sed 's/: /:/g' | \
sed 's/; /;/g' \
> styles.min.css

# Get file sizes
ORIG_SIZE=$(wc -c < styles.css)
MIN_SIZE=$(wc -c < styles.min.css)
SAVED=$((ORIG_SIZE - MIN_SIZE))
PERCENT=$((SAVED * 100 / ORIG_SIZE))

echo ""
echo "Build complete!"
echo "Original: $(($ORIG_SIZE / 1024))KB"
echo "Minified: $(($MIN_SIZE / 1024))KB"
echo "Saved: $(($SAVED / 1024))KB ($PERCENT%)"

# Clean up
rm styles.combined.css

echo ""
echo "To use minified CSS in production:"
echo "  <link rel=\"stylesheet\" href=\"styles.min.css\">"
