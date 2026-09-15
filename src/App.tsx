import { AppProvider, useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Landing } from '@/pages/Landing';
import { Dashboard } from '@/pages/Dashboard';
import { ScanProject } from '@/pages/ScanProject';
import { ScanResults } from '@/pages/ScanResults';
import { Findings } from '@/pages/Findings';
import { ScanHistory } from '@/pages/ScanHistory';
import { SecurityReport } from '@/pages/SecurityReport';
import { PreCommit } from '@/pages/PreCommit';
import { Settings } from '@/pages/Settings';
import { Toaster } from '@/components/ui/sonner';

function AppContent() {
  const { currentPage } = useApp();

  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-background">
        <Landing />
        <Toaster />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'scan-project': return <ScanProject />;
      case 'scan-results': return <ScanResults />;
      case 'findings': return <Findings />;
      case 'scan-history': return <ScanHistory />;
      case 'security-report': return <SecurityReport />;
      case 'pre-commit': return <PreCommit />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Header />
        <div className="animate-fade-in">{renderPage()}</div>
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
