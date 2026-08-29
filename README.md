# Kopargaon Citizen Portal

### Kopargaon's Digital Infrastructure Monitoring Platform

> Connecting citizens, infrastructure, development projects, and GIS data in one transparent digital ecosystem.

Kopargaon Citizen Portal is a digital infrastructure monitoring and civic engagement platform designed to improve **transparency, accountability, citizen participation, and data-driven urban development**.

The platform brings together **citizen feedback, infrastructure monitoring, development projects, GIS-based visualization, land-use information, and public audit history** into a unified interface.

Citizens can report civic issues, explore city infrastructure, track development projects, and scan **QR tags attached to public infrastructure** to access relevant information and audit history.

---

## Key Features

### Citizen Portal

* Citizen-friendly dashboard
* Interactive city and GIS map
* Report civic infrastructure issues
* Track submitted complaints and reports
* Explore ongoing and completed development projects
* View infrastructure details
* QR-based infrastructure information
* View transformation and improvement records
* Access transparency information

### Administration Portal

* Administrative dashboard
* GIS-based infrastructure monitoring
* Development project management
* Infrastructure asset monitoring
* Ward-level analysis
* Land-use visualization
* Analytics and planning insights
* Citizen issue management
* Field inspection support
* Transparency and audit monitoring

### QR-Based Public Audit

Each tagged infrastructure asset can be associated with a unique QR code.

Citizens can scan the QR tag to access information such as:

* Infrastructure details
* Installation and project information
* Maintenance history
* Reported issues
* Transformation records
* Public audit information

This creates a bridge between **physical infrastructure and digital transparency**.

---

## GIS and Infrastructure Monitoring

The platform provides a centralized GIS interface for visualizing different layers of urban infrastructure.

### Map Layers

* Infrastructure
* Citizen Issues
* Development Projects
* Land Use
* Ward Boundaries

These layers help administrators understand spatial patterns and support better planning and decision-making.

---

## How It Works

```text
Citizen
   |
   |-- Reports Civic Issue
   |
   |-- Scans Infrastructure QR
   |
   |-- Views Projects and City Data
   |
   v
Kopargaon Portal
   |
   |-- GIS Data
   |-- Infrastructure Data
   |-- Citizen Reports
   |-- Project Data
   |-- Audit History
   |
   v
Administration
   |
   |-- Analyze
   |-- Inspect
   |-- Prioritize
   |-- Take Action
```

---

## Smart Decision Support

The platform goes beyond simple issue reporting by providing administrative insights from collected civic data.

It supports:

* Issue prioritization
* Infrastructure analysis
* Ward-level comparison
* Project monitoring
* Planning insights
* Citizen feedback analysis
* Data-driven decision making

---

## Tech Stack

| Technology    | Purpose                      |
| ------------- | ---------------------------- |
| React.js      | Frontend application         |
| Vite          | Development and build tool   |
| Tailwind CSS  | UI styling                   |
| JavaScript    | Application logic            |
| React Leaflet | GIS and interactive maps     |
| Lucide React  | UI icons                     |
| Context API   | Application state management |
| HTML5 / CSS3  | Web structure and styling    |

---

## Project Structure

```text
Kopargaon-Citizen-Portal/
|
├── public/
│   ├── before-road.jpg
│   └── after-road.jpg
|
├── src/
│   ├── components/
│   │   ├── map/
│   │   └── ui/
│   │
│   ├── context/
│   │
│   ├── data/
│   │   ├── infrastructure.js
│   │   ├── issues.js
│   │   ├── landuse.js
│   │   ├── projects.js
│   │   ├── transformations.js
│   │   └── wards.js
│   │
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   └── CitizenLayout.jsx
│   │
│   ├── pages/
│   │   ├── admin/
│   │   └── citizen/
│   │
│   ├── utils/
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sakshi-exe/Kopargaon-Citizen-Portal.git
```

### 2. Navigate to the project

```bash
cd Kopargaon-Citizen-Portal
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173/
```

---

## Problem Statement

Urban infrastructure is often managed across disconnected systems. Citizens may not know:

* Where to report an infrastructure problem
* What development projects are currently active
* Who is responsible for an asset
* What maintenance has been performed
* How public infrastructure is being monitored
* Whether reported issues have been addressed

Kopargaon Citizen Portal aims to create **one transparent digital layer connecting citizens with the city's infrastructure and development ecosystem**.

---

## Impact

### Better Infrastructure

Centralized infrastructure monitoring helps identify and prioritize civic issues.

### Greater Citizen Participation

Citizens become active contributors to civic improvement.

### Transparency

Public infrastructure information and audit history become easier to access.

### Data-Driven Planning

GIS and civic data can support better administrative decisions.

### Stronger Citizen-Administration Connection

A shared digital platform creates a direct feedback loop between citizens and authorities.

---

## Hackathon Project

Kopargaon Citizen Portal was developed as a **hackathon project** focused on building a practical digital solution for infrastructure monitoring, civic participation, and transparent urban development.

The project demonstrates how **web technologies, GIS, citizen-generated data, and digital infrastructure records** can work together to create a smarter and more accountable civic ecosystem.

---

## Future Scope

Potential future enhancements include:

* AI-powered civic issue classification
* Predictive infrastructure maintenance
* Dedicated mobile application
* Real-time notifications
* Satellite imagery integration
* AI-based urban planning recommendations
* Role-based authentication
* Cloud-based infrastructure
* IoT-based infrastructure monitoring
* Real-time government database integration
* Multilingual citizen interface

---

## Team

**Hackathon Team — Kopargaon Citizen Portal**

Developed for smarter, more transparent, and citizen-centric urban development.

---

## License

This project is developed for **educational and hackathon purposes**.

---

---

## Supabase Database & Backend Architecture

The application is powered by **Supabase PostgreSQL**, **Supabase Auth (JWT)**, and **Supabase Storage**.

### Database Tables (`supabase/schema.sql`):
* `profiles`: User identities with role-based policies (`citizen`, `admin`, `inspector`).
* `reports`: Citizen complaint tickets mapped with coordinates, status, and categories.
* `report_evidence`: Photographic and video evidence files attached to tickets.
* `infrastructure`: Municipal infrastructure inventory with QR code references.
* `projects`: Urban development projects and expenditure tracking.
* `notifications`: Real-time citizen issue status updates.
* **Storage Bucket**: `report-evidence` for high-resolution citizen uploads.

---

## Local Setup Instructions

1. **Clone the repository and switch to `frontend` branch**:
   ```bash
   git clone https://github.com/sakshi-exe/Kopargaon-Citizen-Portal.git
   cd Kopargaon-Citizen-Portal
   git checkout frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://klscvpaukgnwuoknzfyy.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```
   *(Reference `.env.example`)*

4. **Initialize Supabase Schema**:
   Run `supabase/schema.sql` in your Supabase project SQL Editor to configure all tables, RLS security policies, and storage rules.

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) or [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in your browser.

---

## Repository

GitHub: https://github.com/sakshi-exe/Kopargaon-Citizen-Portal
Branch: `frontend`

> From infrastructure data to citizen action — making Kopargaon more connected, transparent, and accountable.

