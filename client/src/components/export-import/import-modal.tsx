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
import { Notice, KnowledgeItem, Category } from "@/types";
import { db } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/app-context";

export function ImportModal() {
  const { toast } = useToast();
  const { resetToSampleData } = useAppContext();
  const [open, setOpen] = useState(false);
  const [categoriesFile, setCategoriesFile] = useState<File | null>(null);
  const [knowledgeItemsFile, setKnowledgeItemsFile] = useState<File | null>(null);
  const [noticesFile, setNoticesFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState("");
  const [importSuccess, setImportSuccess] = useState(false);

  // Open Modal and reset state
  useEffect(() => {
    const handleOpenImport = () => {
      setOpen(true);
      setCategoriesFile(null);
      setKnowledgeItemsFile(null);
      setNoticesFile(null);
      setImportStatus("");
      setImportSuccess(false);
    };

    window.addEventListener("open-import", handleOpenImport);
    return () => {
      window.removeEventListener("open-import", handleOpenImport);
    };
  }, []);

  // Handle File Upload
  const handleFileUpload = (setter: (file: File | null) => void) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type === "application/json") {
        setter(file);
        setImportStatus(`File "${file.name}" ready to import.`);
      } else {
        setImportStatus("Only JSON files are supported");
        setImportSuccess(false);
      }
    };

  // Read JSON File
  const readFileContent = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (Array.isArray(json)) {
            resolve(json);
          } else {
            reject(new Error("Invalid JSON format. Expected an array."));
          }
        } catch (err) {
          reject(new Error("Failed to parse JSON file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  // Type Guards
  const isValidNotice = (item: any): item is Notice =>
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.content === "string" &&
    typeof item.date === "string";

  const isValidKnowledgeItem = (item: any): item is KnowledgeItem =>
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.content === "string";

  const isValidCategory = (item: any): item is Category =>
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.name === "string";

  // Import Data Logic
  const importData = async () => {
    try {
      setImportStatus("Importing data...");
      await Promise.all([
        db.categories.clear(),
        db.notices.clear(),
        db.knowledgeItems.clear()
      ]);

      const promises = [];
      let importedItems = 0;

      if (categoriesFile) {
        const categories = await readFileContent(categoriesFile);
        const validCategories = categories.filter(isValidCategory);
        if (validCategories.length > 0) {
          promises.push(db.categories.bulkPut(validCategories));
          importedItems += validCategories.length;
        }
      }

      if (knowledgeItemsFile) {
        const knowledgeItems = await readFileContent(knowledgeItemsFile);
        const validKnowledgeItems = knowledgeItems.filter(isValidKnowledgeItem);
        if (validKnowledgeItems.length > 0) {
          promises.push(db.knowledgeItems.bulkPut(validKnowledgeItems));
          importedItems += validKnowledgeItems.length;
        }
      }

      if (noticesFile) {
        const notices = await readFileContent(noticesFile);
        const validNotices = notices.filter(isValidNotice);
        if (validNotices.length > 0) {
          promises.push(db.notices.bulkPut(validNotices));
          importedItems += validNotices.length;
        }
      }

      await Promise.all(promises);

      if (importedItems > 0) {
        setImportStatus(`Successfully imported ${importedItems} items.`);
        setImportSuccess(true);
        
        // Refresh all data in the app
        await resetToSampleData();

        toast({
          title: "Import Successful",
          description: `Imported ${importedItems} items successfully.`,
          variant: "default",
        });
      } else {
        throw new Error("No valid data found in the selected files.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setImportStatus(`Import failed: ${errorMessage}`);
      setImportSuccess(false);
      toast({
        title: "Import Failed",
        description: `Error: ${errorMessage}`,
        variant: "destructive",
      });
      console.error(error);
    }
  };

  // Render Modal
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>Upload JSON files to import data.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <input type="file" accept=".json" onChange={handleFileUpload(setCategoriesFile)} />
          <input type="file" accept=".json" onChange={handleFileUpload(setKnowledgeItemsFile)} />
          <input type="file" accept=".json" onChange={handleFileUpload(setNoticesFile)} />
        </div>
        {importStatus && (
          <div className={`mt-4 ${importSuccess ? "text-green-500" : "text-red-500"}`}>
            {importStatus}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={importData} disabled={!categoriesFile && !knowledgeItemsFile && !noticesFile}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}