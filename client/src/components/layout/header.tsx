import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "wouter";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { toggleTheme, isDark } = useTheme();

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent("open-search"));
  };

  const handleOpenExport = () => {
    window.dispatchEvent(new CustomEvent("open-export"));
  };

  const handleOpenImport = () => {
    window.dispatchEvent(new CustomEvent("open-import"));
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-transparent"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="ri-menu-line text-xl"></i>
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/">
            <h1 className="text-xl font-semibold text-primary flex items-center cursor-pointer">
              <i className="ri-building-line mr-2"></i>
              <span>Internal Knowledge Hub</span>
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button
              variant="outline"
              className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 h-9"
              onClick={handleOpenSearch}
            >
              <i className="ri-search-line mr-2"></i>
              <span className="hidden sm:inline">Search...</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 hidden md:inline">
                (Ctrl+K)
              </span>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-transparent"
            onClick={toggleTheme}
          >
            <i className={`${isDark ? "ri-sun-line" : "ri-moon-line"} text-xl`}></i>
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-transparent"
            onClick={handleOpenExport}
            title="Export Data"
          >
            <i className="ri-download-2-line text-xl"></i>
            <span className="sr-only">Export Data</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-transparent"
            onClick={handleOpenImport}
            title="Import Data"
          >
            <i className="ri-upload-2-line text-xl"></i>
            <span className="sr-only">Import Data</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
