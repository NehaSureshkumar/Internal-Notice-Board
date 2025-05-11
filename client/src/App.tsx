import { Route, Switch } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Notices from "@/pages/notices";
import Knowledge from "@/pages/knowledge";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useEffect, useState } from "react";
import { SearchModal } from "./components/search-modal";
import { ExportModal } from "./components/export-import/export-modal";
import { ImportModal } from "./components/export-import/import-modal";
import { ConfirmDialog } from "./components/confirm-dialog";
import { useLocation } from "wouter";
import { AppProvider } from "@/context/app-context";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setLocation] = useLocation();

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-search"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Mobile view sidebar handler
  useEffect(() => {
    const handleLocationChange = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("location-changed", handleLocationChange);
    return () => window.removeEventListener("location-changed", handleLocationChange);
  }, []);

  return (
    <TooltipProvider>
      <AppProvider>
        <div className="min-h-screen bg-background">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex">
              <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

              <main className="flex-1 py-6 px-0 md:px-6">
                <Switch>
                  <Route path="/" component={Dashboard} />
                  <Route path="/notices" component={Notices} />
                  <Route path="/knowledge" component={Knowledge} />
                  <Route component={NotFound} />
                </Switch>
              </main>
            </div>
          </div>

          {/* Modals */}
          <SearchModal />
          <ExportModal />
          <ImportModal />
          <ConfirmDialog 
            title=""
            description=""
            onConfirm={() => {}}
            onCancel={() => {}}
          />
        </div>
      </AppProvider>
    </TooltipProvider>
  );
}

export default App;