import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AskPulseChat } from './components/AskPulseChat';
import { ResponsibleAIPanel } from './components/ResponsibleAIPanel';
import { CompareCampaignsModal } from './components/CompareCampaignsModal';
import { RootCauseModal } from './components/RootCauseModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DataUploadPage } from './pages/DataUploadPage';
import { AnalyticsDashboardPage } from './pages/AnalyticsDashboardPage';
import { CampaignPerformancePage } from './pages/CampaignPerformancePage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ForecastingPage } from './pages/ForecastingPage';
import { CustomerInsightsPage } from './pages/CustomerInsightsPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { SettingsPage } from './pages/SettingsPage';

const MainContent: React.FC = () => {
  const { currentPage } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'upload':
        return <DataUploadPage />;
      case 'dashboard':
        return <AnalyticsDashboardPage />;
      case 'campaigns':
        return <CampaignPerformancePage />;
      case 'insights':
        return <AIInsightsPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'forecasting':
        return <ForecastingPage />;
      case 'customer_insights':
        return <CustomerInsightsPage />;
      case 'sustainability':
        return <SustainabilityPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <AnalyticsDashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans'] antialiased selection:bg-indigo-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Floating Elements & Modals */}
      <AskPulseChat />
      <ResponsibleAIPanel />
      <CompareCampaignsModal />
      <RootCauseModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
