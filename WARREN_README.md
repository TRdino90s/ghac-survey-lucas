# Warren Product Suite

The complete community intelligence and engagement platform - transforming how organizations discover, build, launch, analyze, and activate community relationships.

## Overview

The Warren Product Suite is an integrated set of tools that provides end-to-end community engagement solutions, from initial discovery through strategic activation. Built on a proven survey infrastructure, Warren delivers the authentic community voice that transforms strategic planning into implementable, community-driven success.

## Product Suite Architecture

```
Build → Launch → Analyze → Community Intelligence Plan
  ↓       ↓        ↓              ↓
Hatch → Burrows → Thicket → Hollow → Nest
```

### The Warren Tools

#### 🥚 **The Hatch** - Discovery Tool
*Apps: `apps/hatch`*
- **Purpose:** Streamline client discovery and needs assessment
- **Function:** Transform high-touch discovery sessions into scalable SaaS workflows
- **Output:** Discovery Outlines that feed directly into Build Burrows
- **Users:** Prospects, service providers, stakeholder teams

#### 🏗️ **Build Burrows** - Survey Builder & Chatbot Engine  
*Apps: `apps/build-burrows`*
- **Purpose:** Convert discovery insights into engaging conversational surveys
- **Function:** Generate question sets, build custom chatbots, deploy community engagement tools
- **Output:** Live survey deployments with real-time data collection
- **Users:** Survey creators, community managers, researchers

#### 🌐 **The Outpost** - Outreach & Growth Tool
*Apps: `apps/outpost` (planned)*
- **Purpose:** Amplify survey reach and community engagement
- **Function:** Multi-channel outreach campaigns, growth optimization, engagement tracking
- **Output:** Expanded survey participation and community involvement

#### 🌿 **The Thicket** - Landing Pages & Experience Hub
*Apps: `apps/thicket` (planned)*  
- **Purpose:** Create compelling entry points for community engagement
- **Function:** Custom landing pages, brand experiences, conversion optimization
- **Output:** High-converting engagement funnels

#### 🕳️ **The Hollow** - Analytics Dashboard
*Apps: `apps/hollow`*
- **Purpose:** Transform survey responses into actionable community intelligence  
- **Function:** Advanced analytics, archetype identification, community insight generation
- **Output:** Community Intelligence Reports for strategic planning
- **Users:** Analysts, strategic planners, decision makers

#### 🏠 **The Nest** - Activation Platform  
*Apps: `apps/nest` (planned)*
- **Purpose:** Convert community intelligence into active engagement and relationships
- **Function:** Donor cultivation, community mobilization, strategic implementation
- **Output:** Activated community networks and measurable outcomes

## Technical Architecture

### Monorepo Structure
```
warren-product-suite/
├── apps/                    # Individual Warren tools
│   ├── hatch/              # Discovery tool (Next.js)
│   ├── build-burrows/      # Survey builder (React + Express)
│   ├── hollow/             # Analytics dashboard (Next.js) 
│   ├── outpost/            # Outreach tool (planned)
│   ├── thicket/            # Landing pages (planned)  
│   └── nest/               # Activation platform (planned)
├── packages/               # Shared libraries
│   ├── data-models/        # TypeScript types and schemas
│   ├── shared-ui/          # Common React components
│   ├── api-client/         # Unified API communication
│   └── utils/              # Common utilities
├── backend/                # Unified Express.js API + PostgreSQL
├── docs/                   # Comprehensive documentation
└── scripts/                # Development and deployment tools
```

### Technology Stack
- **Frontend:** React, Next.js, TypeScript, Tailwind CSS
- **Backend:** Express.js, Node.js, TypeScript  
- **Database:** PostgreSQL with comprehensive schemas
- **Integrations:** VideoAsk API, Google Drive, JWT authentication
- **Infrastructure:** Docker, npm workspaces, unified CI/CD

### Data Flow
1. **Discovery** (Hatch) → Discovery Outline JSON
2. **Survey Building** (Build Burrows) → Survey Structure + Response Data  
3. **Analytics** (Hollow) → Community Intelligence Reports
4. **Activation** (Nest) → Community Engagement Campaigns

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/TRdino90s/warren-product-suite.git
cd warren-product-suite

# Install all dependencies (uses npm workspaces)
npm install

# Set up environment variables
cp .env.example .env
cp backend/.env.example backend/.env

# Start the development environment
npm run dev
```

### Development Scripts

```bash
# Start all services with Docker
npm run dev

# Start individual apps
npm run dev:hatch          # Discovery tool (port 3000)
npm run dev:hollow         # Analytics dashboard (port 3001)  
npm run dev:build-burrows  # Survey builder (port 4000)
npm run dev:backend        # API server (port 4001)

# Build all apps
npm run build

# Run tests and type checking
npm run check-all
```

## Business Model & Positioning

### Target Market
- **Primary:** Urban Place Management firms bidding on strategic planning RFPs ($150K-$500K projects)
- **Secondary:** Municipal governments undertaking community engagement initiatives  
- **Tertiary:** Large consulting firms needing community intelligence specialists

### Value Proposition
*"We deliver the pulse of your entire community ecosystem - real-time, genuine insight from all interested parties that transforms strategic planning from theoretical framework to truly inclusive, implementable roadmap."*

### Warren's Unique Position
- **Community Intelligence Specialists** - not full-service strategic planners
- **Essential $75K-$150K partner** that makes $500K strategic plans successful
- **Authentic stakeholder engagement at scale** - beyond traditional focus groups
- **RFP-ready documentation** and comprehensive community buy-in verification

---

*Warren Product Suite: Transforming community engagement from data collection to strategic activation.*