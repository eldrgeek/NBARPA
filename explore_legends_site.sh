#!/bin/bash

echo "Exploring Legends of Basketball Site Structure..."
echo "=================================================="
echo ""

# Test various common paths
paths=(
  "/"
  "/about"
  "/about-us"
  "/programs"
  "/services"
  "/resources"
  "/support"
  "/donate"
  "/get-involved"
  "/chapters"
  "/leadership"
  "/board"
  "/team"
  "/staff"
  "/history"
  "/mission"
  "/vision"
  "/blog"
  "/news/category"
  "/media/videos"
  "/media/podcast"
  "/gallery"
  "/calendar"
  "/join"
  "/apply"
  "/login"
  "/member-portal"
  "/careers"
  "/volunteers"
  "/faq"
  "/sitemap"
)

base_url="https://www.legendsofbasketball.com"

for path in "${paths[@]}"; do
  url="${base_url}${path}"
  status=$(curl -I -s -L -o /dev/null -w "%{http_code}" "$url" --max-time 5)
  if [ "$status" -eq 200 ]; then
    echo "✓ $status - $path"
  fi
done
