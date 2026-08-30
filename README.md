<div align="center">

# 📊 MarketPulse AI
### Marketing Campaign Intelligence & Autonomous Analytics Agent

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-3.7_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Pages-Automated_Deploy-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A deterministic, AI-powered marketing intelligence platform that transforms multi-channel ad data into verified executive insights, root-cause diagnostics, predictive forecasting, and budget optimization recommendations.**

[Features](#-key-features) • [Deploy to GitHub Pages](#-deploy-to-github-pages) • [System Architecture](#-system-architecture) • [Getting Started](#-getting-started) • [Running Tests](#-running-tests) • [Security](#-security--api-safety)

---

</div>

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Deploy to GitHub Pages](#-deploy-to-github-pages)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Running Unit & Stress Tests](#-running-tests)
- [Security & API Safety](#-security--api-safety)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💡 Overview

Modern marketing teams manage campaigns across multiple fragmented ad networks (Google Ads, Meta Ads, Instagram, LinkedIn, YouTube, Email). Traditional reporting tools often suffer from:
1. **LLM Arithmetic Hallucinations**: Generative models attempting to calculate CTR, CPA, or ROAS in prompt space and making arithmetic errors.
2. **Data Ingestion Friction**: Inconsistent column naming and malformed formats across ad platforms.
3. **Lack of Actionable Root Causes**: Dashboards showing *what* happened, but failing to diagnose *why* it happened or *how* to reallocate capital safely.

**MarketPulse AI** solves this by strictly separating **deterministic mathematical computing** from **generative AI reasoning**. All aggregations, ratios, and quality scores are computed natively in isolated TypeScript modules, while Google Gemini Flash provides contextual synthesis, hypothesis testing, and interactive streaming chat grounded in verified data.

---

## ✨ Key Features

### 1. 🧮 Deterministic Analytics Engine (Zero LLM Math Errors)
* **Verified Metric Calculations**: Core metrics (**ROAS**, **CPA**, **CTR**, **CPC**, **CPM**, **Conversion Rate**, **Net Margin**) are calculated exclusively through an isolated, pure TypeScript arithmetic engine.
* **Edge-Case Resilience**: Division-by-zero protection, null/malformed row sanitization, and automatic multi-currency parsing (`₹`, `$`, `€`, `£`, `AED`, `CAD`, `AUD`, `SGD`, `JPY`).
* **Funnel & Channel Matrix**: 4-stage funnel analysis (Impressions → Reach → Clicks → Conversions) with drop-off rate tracking across all supported platforms.

### 2. ⚡ High-Speed AI Chat Analyst ("Ask Pulse")
* **Server-Sent Events (SSE) Streaming**: Low-latency token delivery directly to the client interface (<300ms time-to-first-token).
* **Multi-Model Resilient Failover**: Automatic fallback cascade (`gemini-2.5-flash` → `gemini-3.7-flash` → `gemini-flash-latest` → `gemini-3.1-flash-lite`) to mitigate transient outages or demand spikes.
* **Zero-Downtime Deterministic Recovery**: Instant local calculation fallback if external AI APIs are unreachable or when running statically on GitHub Pages.
* **In-Memory Query Cache**: Sub-25ms response time for repeated prompts.

### 3. 🔍 Automated Ingestion & Data Quality Auditing
* Ingests CSV and Excel files with intelligent fuzzy header mapping.
* Generates an automated **Data Quality Audit Score (0–100%)** reporting duplicate records, zero-impression anomalies, and missing revenue fields.

### 4. 🏷️ Smart Campaign Classification
* Multi-factor classification into **Winning (🟢)**, **Needs Attention (🟡)**, and **Underperforming (🔴)** clusters.
* **Sample Size Guardrails**: Enforces an `insufficient_data` classification on datasets with $<1{,}000$ clicks or $<50{,}000$ impressions to prevent statistical bias.

### 5. 📈 Horizon Predictive Forecasting & Budget Simulator
* 30, 60, and 90-day predictive run-rate models with upper and lower variance bands for spend, conversions, revenue, and ROAS.
* Interactive Budget Allocator allowing dynamic capital reallocation across channels with real-time ROAS projection.

### 6. 🌱 Sustainability & Capital Leakage Intelligence
* **Economic Sustainability**: Detects ad creative fatigue, keyword saturation, and inefficient ad sets to quantify recoverable ad spend.
* **Operational Wellbeing**: Tracks audience ad burnout and estimates time saved from automated reporting.

---

## 🚀 Deploy to GitHub Pages

This project is pre-configured for **instant 1-click GitHub Pages deployment** using GitHub Actions or static export.

### Method 1: Automatic Deployment with GitHub Actions (Recommended)
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Deploy MarketPulse AI"
   git push origin main
   ```
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` workflow will automatically build and publish your site at `https://<your-username>.github.io/<repo-name>/`.

### Method 2: Manual Static HTML/JS Build
To generate static HTML/CSS/JavaScript files ready for any hosting provider (GitHub Pages, Netlify, Vercel, Firebase Hosting, Apache/Nginx):
```bash
npm run build:pages
```
The compiled static website will be created in the `/dist` directory.

---

### View website: https://market-pulse-ai-360.vercel.app/
---

```


## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BROWSER / CLIENT                               │
│                                                                             │
│  React 19 + Tailwind CSS + Lucide Icons + Recharts + Motion                │
│  ├── Data Upload & Ingestion View (with Sample Data Quick-Load)             │
│  ├── Executive Analytics Dashboard (Customizable Metric Cards)              │
│  ├── Campaign Performance Matrix (Filter, Sort, Classification)             │
│  ├── AI Insights & Root Cause Diagnostic Modals                             │
│  ├── Predictive 30/60/90-Day Forecasting & Budget Simulator                 │
│  ├── Sustainability & Capital Recovery Intelligence                         │
│  └── Ask Pulse Streaming Chat Drawer (Offline & SSE Hybrid)                │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                         API Calls & SSE Token Streams
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                            NODE.JS / EXPRESS SERVER                         │
│                                                                             │
│  /server.ts                                                                 │
│  ├── Proxy Endpoints: /api/pulse-chat, /api/ai-insights                     │
│  ├── GEMINI_API_KEY (Isolated server-side — never exposed to client)        │
│  └── Multi-Model Fallback Controller (2.5-flash → 3.7-flash → 3.1-lite)     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                          Secure Google GenAI Calls
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                         DETERMINISTIC COMPUTE LAYER                         │
│                                                                             │
│  src/utils/analyticsEngine.ts (Pure TypeScript Math)                        │
│  src/utils/classificationEngine.ts (Statistical Clustering & Guards)        │
│  src/utils/insightsEngine.ts (Rule-Based Diagnostics & Offline Engine)      │
│  src/utils/fileParser.ts (Sanitization & Multi-Currency Normalization)      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite 6 |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling & UI** | Tailwind CSS v4, Lucide React, Motion |
| **Data Visualization** | Recharts (Responsive Line, Bar, Pie, and Area Charts) |
| **Backend & Routing** | Express.js, Server-Sent Events (SSE), tsx, esbuild |
| **AI & LLM** | Google GenAI SDK (`@google/genai`), Gemini 3.7 & 2.5 Flash |
| **File Parsing** | PapaParse (CSV), SheetJS / XLSX (Excel) |
| **Unit Testing** | Vitest (Canonical math benchmarks and edge case tests) |

---

## 💻 Getting Started

### Prerequisites
- Node.js 20+ installed
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/MarketPulseAI.git
   cd MarketPulseAI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (Optional for AI features):
   ```bash
   cp .env.example .env
   # Add your Gemini API key:
   # GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🧪 Running Tests

Run the mathematical verification and unit test suite:
```bash
npm run test
```

---

## 🔒 Security & API Safety

- **Server-Side Key Isolation**: `GEMINI_API_KEY` is loaded and executed strictly in the Node.js backend layer, preventing exposure in browser network inspector tabs.
- **Client-Side Graceful Fallback**: If deployed statically on GitHub Pages without a backend server, MarketPulse AI automatically uses its built-in rule-based intelligence engine and instant client calculation engine so all dashboards, forecasts, filters, and uploads work seamlessly.

---


