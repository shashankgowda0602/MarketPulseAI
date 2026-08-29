<div align="center">

# 📊 MarketPulse AI
### Marketing Campaign Intelligence & Autonomous Analytics Agent

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-3.7_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A deterministic, AI-powered marketing intelligence platform that transforms multi-channel ad data into verified executive insights, root-cause diagnostics, predictive forecasting, and budget optimization recommendations.**

[Live Demo](#-live-demo) • [Features](#-key-features) • [Architecture](#-system-architecture) • [Getting Started](#-getting-started) • [Running Tests](#-running-tests) • [Security](#-security--api-safety)

---

</div>

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Screenshots & Views](#-platform-views)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Running Unit & Stress Tests](#-running-tests)
- [Security & API Safety](#-security--api-safety)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💡 Overview

Modern marketing teams manage campaigns across multiple fragmented ad networks (Google Ads, Meta Ads, Instagram, LinkedIn, YouTube, Email). Traditional reporting tools often suffer from:
1. **LLM Arithmetic Hallucinations**: Generative models attempting to calculate CTR, CPA, or ROAS in prompt space and making simple arithmetic errors.
2. **Data Ingestion Friction**: Inconsistent column naming and malformed formats across ad platforms.
3. **Lack of Actionable Root Causes**: Dashboards showing *what* happened, but failing to diagnose *why* it happened or *how* to reallocate capital safely.

**MarketPulse AI** solves this by strictly separating **deterministic mathematical computing** from **generative AI reasoning**. All aggregations, ratios, and quality scores are computed natively in isolated TypeScript modules, while Google Gemini Flash provides contextual synthesis, hypothesis testing, and interactive streaming chat grounded in verified data.

---

## ✨ Key Features

### 1. 🧮 Deterministic Analytics Engine (Zero LLM Math Errors)
* **Verified Metric Calculations**: Core metrics (**ROAS**, **CPA**, **CTR**, **CPC**, **CPM**, **Conversion Rate**, **Net Margin**) are calculated exclusively through an isolated, pure TypeScript arithmetic engine.
* **Edge-Case Resilience**: Division-by-zero protection, null/malformed row sanitization, and automatic multi-currency parsing (`₹`, `$`, `€`, `£`).
* **Funnel & Channel Matrix**: 4-stage funnel analysis (Impressions → Reach → Clicks → Conversions) with drop-off rate tracking across all 6 supported platforms.

### 2. ⚡ High-Speed AI Chat Analyst ("Ask Pulse")
* **Server-Sent Events (SSE) Streaming**: Low-latency token delivery directly to the client interface (<300ms time-to-first-token).
* **Multi-Model Resilient Failover**: Automatic fallback cascade (`gemini-2.5-flash` → `gemini-3.7-flash` → `gemini-flash-latest` → `gemini-3.1-flash-lite`) to mitigate transient outages or demand spikes.
* **Zero-Downtime Deterministic Recovery**: Instant local calculation fallback if external AI APIs are unreachable.
* **In-Memory Query Cache**: Sub-25ms response time for repeated prompts.

### 3. 🔍 Automated Ingestion & Data Quality Auditing
* Ingests CSV and Excel files with intelligent fuzzy header mapping.
* Generates an automated **Data Quality Audit Score (0–100%)** reporting duplicate records, zero-impression anomalies, and missing revenue fields.

### 4. 🏷️ Smart Campaign Classification
* Multi-factor classification into **Winning (🟢)**, **Needs Attention (🟡)**, and **Underperforming (🔴)** clusters.
* **Sample Size Guardrails**: Enforces an `insufficient_data` classification on datasets with $<1{,}000$ clicks or $<50{,}000$ impressions to prevent statistical bias.

### 5. 📈 Horizon Predictive Forecasting
* 30, 60, and 90-day predictive run-rate models with upper and lower variance bands for spend, conversions, revenue, and ROAS.

### 6. 🌱 Sustainability & Capital Leakage Intelligence
* **Economic Sustainability**: Detects ad creative fatigue, keyword saturation, and inefficient ad sets to quantify recoverable ad spend.
* **Operational Wellbeing**: Tracks audience ad burnout and estimates time saved from automated reporting.

---

## 🏗️ System Architecture
## 🏗️ System Architecture
┌─────────────────────────────────────────────────────────────────────────────┐
│ BROWSER / CLIENT │
│ │
│ React 18 + Tailwind CSS + Lucide Icons + Recharts + Framer Motion │
│ ├── Data Upload & Ingestion View (with Sample Data Quick-Load) │
│ ├── Executive Analytics Dashboard (Customizable Metric Cards) │
│ ├── Campaign Performance Matrix (Filter, Sort, Classification) │
│ ├── AI Insights & Root Cause Diagnostic Modals │
│ ├── Predictive 30/60/90-Day Forecasting View │
│ ├── Sustainability & Capital Recovery Intelligence │
│ └── Ask Pulse Streaming Chat Drawer (with Client-Side Query Cache) │
└──────────────────────────────────────┬──────────────────────────────────────┘
│
API Calls & SSE Token Streams
│
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ NODE.JS / EXPRESS SERVER │
│ │
│ /server.ts │
│ ├── Proxy Endpoints: /api/ai/ask-pulse-stream, /api/ai/insights │
│ ├── GEMINI_API_KEY (Isolated server-side — never exposed to client) │
│ └── Multi-Model Fallback Controller (2.5-flash → 3.7-flash → 3.1-lite) │
└──────────────────────────────────────┬──────────────────────────────────────┘
│
Secure Google GenAI Calls
│
┌──────────────────────────────────────▼──────────────────────────────────────┐
│ DETERMINISTIC COMPUTE LAYER │
│ │
│ src/utils/analyticsEngine.ts (Pure TypeScript Math) │
│ src/utils/classificationEngine.ts (Statistical Clustering & Guards) │
│ src/utils/insightsEngine.ts (Rule-Based Diagnostics & Offline Engine) │
│ src/utils/fileParser.ts (Sanitization & Currency Normalization) │
└─────────────────────────────────────────────────────────────────────────────┘
code
Code
---

## 🛠️ Tech Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling & UI** | Tailwind CSS v4, Lucide React, Framer Motion |
| **Data Visualization** | Recharts (Responsive Line, Bar, Pie, and Area Charts) |
| **Backend & Routing** | Express.js, Server-Sent Events (SSE), tsx, esbuild |
| **AI & LLM** | Google GenAI SDK (`@google/genai`), Gemini 3.7 & 2.5 Flash |
| **Unit Testing** | Vitest (33 test suites covering edge cases and benchmarking) |

---


