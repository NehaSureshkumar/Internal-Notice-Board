import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { Markdown } from "@/components/ui/markdown";
import { useAppContext } from "@/context/app-context";
import { useEffect, useState } from "react";

export function KnowledgeDetail() {
  const { selectedKnowledgeItem, setSelectedKnowledgeItem, categories } = useAppContext();
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  // Set category name when item is selected
  useEffect(() => {
    if (selectedKnowledgeItem) {
      const category = categories.find(c => c.id === selectedKnowledgeItem.categoryId);
      setCategoryName(category?.name || "Uncategorized");
    }
  }, [selectedKnowledgeItem, categories]);

  // Open dialog when knowledge item is selected
  useEffect(() => {
    setOpen(!!selectedKnowledgeItem);
  }, [selectedKnowledgeItem]);

  // Handle dialog state changes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => setSelectedKnowledgeItem(null), 300); // Delay for animation
    }
  };

  // Handle printing
  const handlePrint = () => {
    if (!selectedKnowledgeItem) return;
    
    const printContent = `
      <html>
      <head>
        <title>${selectedKnowledgeItem.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { font-size: 24px; margin-bottom: 10px; }
          .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
          .content { font-size: 16px; white-space: pre-line; }
        </style>
      </head>
      <body>
        <h1>${selectedKnowledgeItem.title}</h1>
        <div class="meta">
          <p>Last Updated: ${formatDate(selectedKnowledgeItem.updated)} | Category: ${categoryName}</p>
        </div>
        <div class="content">
          ${selectedKnowledgeItem.content}
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      };
    }
  };

  if (!selectedKnowledgeItem) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{selectedKnowledgeItem.title}</DialogTitle>
          <div className="flex justify-end space-x-2 mt-2">
            <Button variant="ghost" size="sm" onClick={handlePrint} title="Print">
              <i className="ri-printer-line"></i>
              <span className="sr-only">Print</span>
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <i className="ri-calendar-line mr-1"></i>
          <span>Updated: {formatDate(selectedKnowledgeItem.updated)}</span>
          <span className="mx-2">•</span>
          <i className="ri-folder-line mr-1"></i>
          <span>{categoryName}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <Markdown content={selectedKnowledgeItem.content} />
        </div>
        
        <DialogFooter>
          <Button onClick={() => handleOpenChange(false)} variant="secondary">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}