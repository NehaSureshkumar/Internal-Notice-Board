import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/app-context";
import { ExportData } from "@/types";

export function ExportModal() {
  const { notices, knowledgeItems, categories } = useAppContext();
  const [open, setOpen] = useState(false);

  // Listen for the custom event to open the export modal
  useEffect(() => {
    const handleOpenExport = () => {
      setOpen(true);
    };

    window.addEventListener("open-export", handleOpenExport);
    return () => {
      window.removeEventListener("open-export", handleOpenExport);
    };
  }, []);

  const exportData = (type: 'all' | 'notices' | 'knowledge') => {
    let dataToExport: ExportData = {};
    
    if (type === 'all' || type === 'notices') {
      dataToExport.notices = notices;
    }
    
    if (type === 'all' || type === 'knowledge') {
      dataToExport.knowledgeItems = knowledgeItems;
      dataToExport.categories = categories;
    }
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `knowledge-hub-export-${type}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Export all your notices and knowledge base items as a JSON file.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose which data you would like to export:
          </p>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              onClick={() => exportData('all')}
              className="flex items-center justify-center"
            >
              <i className="ri-download-2-line mr-2"></i>
              Export All Data
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => exportData('notices')}
              className="flex items-center justify-center"
            >
              <i className="ri-notification-3-line mr-2"></i>
              Notices Only
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => exportData('knowledge')}
              className="flex items-center justify-center"
            >
              <i className="ri-book-open-line mr-2"></i>
              Knowledge Only
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
