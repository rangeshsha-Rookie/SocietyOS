# SocietyOS 🏢
> Intelligent Society Complaint & Operational-Memory Application

SocietyOS is an intelligent civic-tech mobile application designed for housing societies. It goes beyond simple ticket logging by transforming complaints into institutional memory—automatically cross-referencing historical maintenance, asset health, vendor performance, and recurrence patterns to generate an actionable AI problem dossier.

---

## 🚀 Sprint 1 Vertical Slice

The implemented Sprint 1 vertical slice includes the end-to-end workflow:
```
Resident Home 
  → Raise Complaint (with Expo Image Picker)
  → Submit Complaint 
  → AI Analysis (Triage & NLP Extraction)
  → Historical Search (PostgreSQL queries)
  → Related Incident Correlation
  → Related Asset Link (B-WP-01 / B-Wing Water Pump)
  → Previous Resolution History (Pump servicing, 18-day recurrence failure)
  → AI Problem Context (Signature Screen)
  → Send to Committee Action
```

---

## 📱 Mobile Screens (React Native + Expo Router)

1. **Home Screen (`app/index.tsx`)**
   - SocietyOS Branding & Live Node Status
   - Resident Greeting (Aarav Sharma • Flat B-402, B-Wing)
   - Status Cards: Active Issues, Open Incidents, Resolved Cases
   - Tabbed view of Active Complaints and Recently Resolved Complaints
   - Primary Action: `[ Report a Problem ]`

2. **Raise Complaint (`app/complaint.tsx`)**
   - Complaint Description input with quick test chip: `"B wing mein pani ka pressure bohot low hai"`
   - Wing (`B`) and Flat Number (`B-402`) inputs
   - Optional Photo attachment using **Expo Image Picker**
   - Zod schema validation
   - Primary CTA: `[ Analyze Complaint ]`

3. **Processing (`app/processing.tsx`)**
   - Professional sequential loading indicators:
     1. *Understanding your complaint...*
     2. *Searching society history...*
     3. *Building problem context...*
   - Immediate transition to AI Problem Context as soon as the database analysis completes.

4. **AI Problem Context (`app/problem-context.tsx`)**
   - **Signature Screen** rendering the operational dossier:
     - **Current Report**: *"B wing mein pani ka pressure bohot low hai"*
     - **AI Triage**: Water Supply • `HIGH` Urgency
     - **Affected Area**: B-Wing
     - **Related History**: **7 related complaints**, **3 incidents**, **2 reopened**
     - **Recurrence**: `HIGH`
     - **Related Asset**: `B-WP-01` — B-Wing Water Pump
     - **Last Incident**: `43 days ago`
     - **Previous Action**: `Pump servicing`
     - **Outcome**: `Issue returned after 18 days`
     - **Recommended Action**: `Inspect pump + supply line`
     - Primary CTA: `[ Send to Committee ]`

---

## 🛠 Tech Stack

### Mobile
- **React Native** + **Expo SDK 51**
- **TypeScript** (Strict Mode)
- **Expo Router** (File-based navigation)
- **TanStack React Query** (Server state, caching, invalidation)
- **Axios** (API client with emulator fallback)
- **Zod** (Schema validation)
- **Expo Image Picker** (Photo evidence)

### Backend
- **Node.js** + **Express**
- **Prisma ORM**
- **PostgreSQL**
- **Zod** (Request validation)
- **Modular AI Architecture** (`IAIProvider` interface with `MockAIProvider` for Sprint 1, extensible to LLM + Embeddings + pgvector)

---

## 🗄️ Database Models (Prisma)

- `Resident`: id, name, flatNumber, wing, phone, createdAt
- `Complaint`: id, residentId, description, category, urgency, wing, flatNumber, status, incidentId, assetId, vendorId, createdAt, resolvedAt, verifiedAt
- `Incident`: id, title, category, location, status, firstReportedAt, lastReportedAt, complaintCount, reopenCount
- `Asset`: id, name, type, location, vendorId
- `Vendor`: id, name, serviceType
- `Resolution`: id, complaintId, incidentId, actionTaken, outcome, recurrenceDays, residentVerified, resolvedAt

### Seeded Historical Data
The database seeds:
- **30 Residents** across Wings A, B, C, D
- **10 Service Vendors** (Plumbing, Elevators, Electrical, etc.)
- **15 Assets** (including B-WP-01 B-Wing Water Pump)
- **15 Incidents** (including 3 specific B-Wing Water Supply incidents, 2 reopened)
- **80 Complaints** (including 7 historical B-Wing water pressure complaints)

---

## 🏃 Getting Started

### 1. Prerequisites
- Node.js (v20+)
- PostgreSQL running on port `5432` (or WSL/Docker)

### 2. Setup Database & Backend
```bash
cd SocietyOS/backend

# Install dependencies
npm install

# Push Prisma schema to PostgreSQL
npm run prisma:migrate

# Seed historical data (30 residents, 80 complaints, 15 incidents, 15 assets, 10 vendors)
npm run prisma:seed

# Start the Backend Server (runs on port 3000)
npm run dev
```

### 3. Start Expo Mobile Application
```bash
cd SocietyOS/mobile

# Install dependencies
npm install

# Start Expo Metro Bundler (runs on port 8081)
npm run start
```
- Press `a` in the terminal to launch on Android emulator.
- Scan the QR code with **Expo Go** on an Android phone on the same network.

---

## 🧪 Acceptance Test Verification

Run the automated acceptance test script from the project root:
```powershell
# In PowerShell:
$complaintPayload = @{
  description = "B wing mein pani ka pressure bohot low hai"
  wing = "B"
  flatNumber = "B-402"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/complaints" -Method Post -ContentType "application/json" -Body $complaintPayload | ConvertTo-Json -Depth 5
```

Expected Database-Backed Output:
```json
{
  "aiAnalysis": {
    "category": "Water Supply",
    "urgency": "HIGH",
    "wing": "B",
    "issue": "Low water pressure"
  },
  "relatedComplaintsCount": 7,
  "incidentsCount": 3,
  "reopenedCount": 2,
  "recurrence": "HIGH",
  "relatedAsset": {
    "name": "B-Wing Water Pump (B-WP-01)",
    "type": "Water Pump"
  },
  "lastIncidentDaysAgo": 43,
  "previousResolution": {
    "actionTaken": "Pump servicing",
    "outcome": "Issue returned after 18 days",
    "recurrenceDays": 18
  },
  "recommendedAction": "Inspect pump + supply line"
}
```

---

## 🧠 Future-Ready AI Architecture
The backend is designed with an `IAIProvider` interface in `src/lib/ai/`:
- **Sprint 1**: `AI_MODE=mock` returns structured extraction and deterministic domain heuristics.
- **Sprint 2+**: Can seamlessly be swapped to LLM embeddings and `pgvector` for semantic complaint clustering without modifying API route controllers or mobile client code.
