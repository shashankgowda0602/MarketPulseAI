# 📊 MarketPulse AI – Marketing Campaign Intelligence Agent

> An AI-powered, mathematically deterministic marketing intelligence platform that transforms raw campaign data into verified executive insights, root-cause diagnostics, and actionable growth recommendations.

---

## ⚡ Highlights & Key Capabilities

- **Zero-Hallucination Deterministic Engine**: All key metrics (ROAS, CPA, CTR, CPC, CPM, Conversion Rates, and Funnel Drop-offs) are calculated using a verified, pure TypeScript arithmetic engine with zero LLM math inaccuracies.
- **Fast AI Chat Assistant ("Ask Pulse")**: Low-latency Server-Sent Events (SSE) streaming with multi-model fallback (`gemini-2.5-flash`, `gemini-3.7-flash`) and client-side query caching.
- **Automated Data Quality Audit**: Ingestion pipeline for CSV and Excel files that validates schema completeness, checks for duplicate entries, isolates zero-impression anomalies, and outputs an audit score.
- **Automated Campaign Classification**: Multi-factor classification into *Winning*, *Needs Attention*, and *Underperforming* clusters with sample-size guardrails to prevent statistical bias on small datasets.
- **Predictive Horizon Forecasting**: 30, 60, and 90-day predictive run-rate projections with confidence intervals for spend, conversions, revenue, and ROAS.
- **Capital Leakage & Sustainability Intelligence**: Identifies ad creative fatigue, keyword saturation, and inefficient ad sets to calculate reclaimed budget potential.
- **Secure Server-Side AI Architecture**: API keys are isolated within a backend Express proxy; client bundles contain zero sensitive keys or tokens.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Framer Motion
- **Backend / API**: Node.js, Express, Server-Sent Events (SSE)
- **AI Intelligence**: Google GenAI SDK (`@google/genai`), Gemini Flash Models with deterministic offline failover
- **Testing & Quality Assurance**: Vitest unit test suite (33+ tests covering edge cases, division-by-zero, and 50,000-row stress testing)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
\`\`\`bash
git clone https://github.com/your-username/marketpulse-ai.git
cd marketpulse-ai
npm install
\`\`\`

### 2. Configure Environment Variables
\`\`\`bash
cp .env.example .env
# Set your GEMINI_API_KEY in .env (kept strictly on the server-side)
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit \`http://localhost:3000\` to access the application.

### 4. Run Unit Tests
\`\`\`bash
npm test
\`\`\`
