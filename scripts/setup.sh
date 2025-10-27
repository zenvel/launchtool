#!/bin/bash

# LaunchTool Setup Script
# Helps you quickly configure LaunchTool for your project
#
# Usage: ./scripts/setup.sh

set -e

echo "🚀 LaunchTool Setup"
echo "===================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running in project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm is not installed. Installing pnpm...${NC}"
    npm install -g pnpm
fi

echo -e "${BLUE}📦 Step 1: Installing dependencies...${NC}"
pnpm install

echo ""
echo -e "${BLUE}⚙️  Step 2: Setting up environment variables...${NC}"

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✅ Created .env.local from .env.example${NC}"
else
    echo -e "${YELLOW}⚠️  .env.local already exists, skipping...${NC}"
fi

echo ""
echo -e "${BLUE}🎨 Step 3: Project Configuration${NC}"
echo ""

# Prompt for basic information
read -p "Enter your project name (e.g., MyAwesomeTool): " PROJECT_NAME
read -p "Enter your project description: " PROJECT_DESC
read -p "Enter your domain (e.g., myawesometool.com) or press Enter to skip: " PROJECT_DOMAIN

# Update package.json
if [ ! -z "$PROJECT_NAME" ]; then
    PROJECT_NAME_LOWER=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

    # For macOS (BSD sed) and Linux (GNU sed) compatibility
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/\"name\": \"launchtool\"/\"name\": \"$PROJECT_NAME_LOWER\"/" package.json
        sed -i '' "s/\"description\": \".*\"/\"description\": \"$PROJECT_DESC\"/" package.json
    else
        sed -i "s/\"name\": \"launchtool\"/\"name\": \"$PROJECT_NAME_LOWER\"/" package.json
        sed -i "s/\"description\": \".*\"/\"description\": \"$PROJECT_DESC\"/" package.json
    fi

    echo -e "${GREEN}✅ Updated package.json${NC}"
fi

# Update .env.local with domain
if [ ! -z "$PROJECT_DOMAIN" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://$PROJECT_DOMAIN|" .env.local
    else
        sed -i "s|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://$PROJECT_DOMAIN|" .env.local
    fi
    echo -e "${GREEN}✅ Updated .env.local with domain${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Step 4: Next steps${NC}"
echo ""
echo -e "${YELLOW}Manual configuration needed:${NC}"
echo ""
echo "1. Edit config/site.config.ts:"
echo "   - Update site name, title, and description"
echo "   - Configure navigation and features"
echo "   - Add your social links"
echo ""
echo "2. Replace branding assets in public/:"
echo "   - favicon.ico, favicon-*.png"
echo "   - logo.svg or logo.png"
echo "   - og-image.png (1200x630px)"
echo ""
echo "3. Update internationalization in messages/:"
echo "   - messages/en.json (English)"
echo "   - messages/zh.json (Chinese)"
echo ""
echo "4. Customize your tool:"
echo "   - Edit app/[locale]/page.tsx for homepage"
echo "   - Modify components/image-processing-card.tsx"
echo "   - Or create your own tool component"
echo ""

echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${BLUE}Quick commands:${NC}"
echo "  pnpm dev          - Start development server"
echo "  pnpm build        - Build for production"
echo "  pnpm lint         - Run linter"
echo ""
echo "  ./scripts/new-post.sh \"Title\" en  - Create new blog post"
echo ""
echo -e "${YELLOW}📚 Read TEMPLATE_GUIDE.md for detailed customization instructions${NC}"
echo ""

# Ask if user wants to start dev server
read -p "Start development server now? (y/n): " START_DEV

if [ "$START_DEV" = "y" ] || [ "$START_DEV" = "Y" ]; then
    echo ""
    echo -e "${GREEN}🚀 Starting development server...${NC}"
    echo -e "${BLUE}Visit http://localhost:3000 in your browser${NC}"
    echo ""
    pnpm dev
else
    echo ""
    echo -e "${GREEN}Run 'pnpm dev' when you're ready to start developing!${NC}"
fi
