import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Markdown } from "@/components/ui/markdown";
import { useAppContext } from "@/context/app-context";
import { useEffect,useState } from "react";

export function NoticeDetail() {
  const { selectedNotice, setSelectedNotice } = useAppContext();
  const [open, setOpen] = useState(false);

  // Open dialog when notice is selected
  useEffect(() => {
    setOpen(!!selectedNotice);
  }, [selectedNotice]);

  // Handle dialog state changes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => setSelectedNotice(null), 300); // Delay for animation
    }
  };

  // Handle printing
  const handlePrint = () => {
    if (!selectedNotice) return;
    
    const printContent = `
      <html>
      <head>
        <title>${selectedNotice.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { font-size: 24px; margin-bottom: 10px; }
          .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
          .content { font-size: 16px; white-space: pre-line; }
        </style>
      </head>
      <body>
        <h1>${selectedNotice.title}</h1>
        <div class="meta">
          <p>Date: ${formatDate(selectedNotice.date)} | Author: ${selectedNotice.author} | Priority: ${selectedNotice.priority}</p>
        </div>
        <div class="content">
          ${selectedNotice.content}
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

  if (!selectedNotice) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{selectedNotice.title}</DialogTitle>
          <div className="flex justify-end space-x-2 mt-2">
            <Button variant="ghost" size="sm" onClick={handlePrint} title="Print">
              <i className="ri-printer-line"></i>
              <span className="sr-only">Print</span>
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <i className="ri-calendar-line mr-1"></i>
          <span>{formatDate(selectedNotice.date)}</span>
          <span className="mx-2">•</span>
          <i className="ri-user-line mr-1"></i>
          <span>{selectedNotice.author}</span>
          {selectedNotice.priority === 'high' && (
            <Badge variant="destructive" className="ml-2">
              High Priority
            </Badge>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <Markdown content={selectedNotice.content} />
        </div>
        
        <DialogFooter>
          <Button onClick={() => handleOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}