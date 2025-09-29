#!/bin/bash
# Deploy the contents of the out/ directory to the root of the Production branch for GitHub Pages

set -e

BUILD_DIR="out"
BRANCH="Production"

# Make sure build is up to date
npm run build

# Go to the build output directory
cd $BUILD_DIR

git init

git checkout --orphan $BRANCH

git add .
git commit -m "Deploy Next.js static site to GitHub Pages ($BRANCH)"

git remote add origin "$(git -C .. remote get-url origin)"
git push -f origin $BRANCH

echo "Deployed to $BRANCH branch!"
