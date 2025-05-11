import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { ConfirmDialog } from "../confirm-dialog";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { categories, resetToSampleData } = useAppContext();
  const [location] = useLocation();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handlePrintCurrentView = () => {
    window.print();
  };

  const handleResetData = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = async () => {
    await resetToSampleData();
    setShowResetConfirm(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <>
      <aside 
        className={`no-print w-64 sm:block fixed md:sticky top-0 z-20 h-screen md:h-auto transition-all duration-300 ease-in-out
                  ${sidebarOpen ? 'block bg-white dark:bg-gray-800 shadow-lg md:shadow-none translate-x-0' : '-translate-x-full md:translate-x-0 hidden md:block'}`}
      >
        <div className="h-full overflow-y-auto py-6 px-4 pt-16 md:pt-6 bg-white dark:bg-gray-800">
          <div className="md:hidden absolute top-4 right-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setSidebarOpen(false)}
            >
              <i className="ri-close-line text-xl"></i>
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          
          <nav className="mt-2 space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Main</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/">
                    <div className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                      isActive('/') 
                        ? 'bg-primary bg-opacity-20 text-primary font-bold dark:text-white dark:bg-opacity-30' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}>
                      <i className="ri-dashboard-line mr-3 text-lg"></i>
                      <span>Dashboard</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/notices">
                    <div className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                      isActive('/notices') 
                        ? 'bg-primary bg-opacity-20 text-primary font-bold dark:text-white dark:bg-opacity-30' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}>
                      <i className="ri-notification-3-line mr-3 text-lg"></i>
                      <span>Notices</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge">
                    <div className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                      isActive('/knowledge') 
                        ? 'bg-primary bg-opacity-20 text-primary font-bold dark:text-white dark:bg-opacity-30' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}>
                      <i className="ri-book-open-line mr-3 text-lg"></i>
                      <span>Knowledge Base</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Categories</h3>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/knowledge?category=${category.id}`}>
                      <div 
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer
                          ${location === `/knowledge?category=${category.id}` 
                            ? 'bg-primary bg-opacity-20 text-primary font-bold dark:text-white dark:bg-opacity-30' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                      >
                        <i className={`${category.icon} mr-3 text-lg`}></i>
                        <span>{category.name}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">System</h3>
              <ul className="space-y-1">
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 h-auto text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handlePrintCurrentView}
                  >
                    <i className="ri-printer-line mr-3 text-lg"></i>
                    <span>Print Current View</span>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 h-auto text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleResetData}
                  >
                    <i className="ri-refresh-line mr-3 text-lg"></i>
                    <span>Reset to Sample Data</span>
                  </Button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      {showResetConfirm && (
        <ConfirmDialog
          title="Reset to Sample Data"
          description="This will reset all data to sample content. Any changes you have made will be lost. Continue?"
          confirmText="Reset Data"
          cancelText="Cancel"
          onConfirm={confirmReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </>
  );
}
