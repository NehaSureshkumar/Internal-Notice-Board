import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import { useState, useEffect } from "react";
import { KnowledgeCard } from "@/components/knowledge/knowledge-card";
import { KnowledgeEditor } from "@/components/knowledge/knowledge-editor";
import { KnowledgeDetail } from "@/components/knowledge/knowledge-detail";
import { KnowledgeItem, SortOption } from "@/types";
import { filterKnowledgeItems, sortKnowledgeItems } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

export default function Knowledge() {
  const { knowledgeItems, categories, addKnowledgeItem, updateKnowledgeItem, deleteKnowledgeItem, selectedKnowledgeItem, isLoading } = useAppContext();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  
  const [itemToEdit, setItemToEdit] = useState<KnowledgeItem | undefined>(undefined);
  const [showEditor, setShowEditor] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [knowledgeSort, setKnowledgeSort] = useState<SortOption>("updated-desc");
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Parse category from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const category = params.get("category");
    if (category) {
      setCategoryFilter(category);
    }
  }, [location]);

  // Effect to dispatch location change event when route changes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("location-changed"));
  }, []);

  const handleCreateNewKnowledgeItem = () => {
    setItemToEdit(undefined);
    setShowEditor(true);
  };

  const handleEditKnowledgeItem = (item: KnowledgeItem) => {
    setItemToEdit(item);
    setShowEditor(true);
  };

  const handleDeleteKnowledgeItem = (id: string) => {
    setItemToDelete(id);
    
    // Use the confirm dialog
    window.dispatchEvent(
      new CustomEvent("confirm-dialog", {
        detail: {
          title: "Delete Knowledge Article",
          description: "Are you sure you want to delete this knowledge article? This action cannot be undone.",
          confirmText: "Delete",
          cancelText: "Cancel",
          onConfirm: async () => {
            try {
              await deleteKnowledgeItem(id);
            } catch (error) {
              console.error("Failed to delete knowledge item:", error);
            }
          },
          onCancel: () => {
            setItemToDelete(null);
          }
        }
      })
    );
  };

  const handleSaveKnowledgeItem = async (itemData: Omit<KnowledgeItem, "id">) => {
    try {
      if (itemToEdit) {
        // Update existing item
        await updateKnowledgeItem({ ...itemData, id: itemToEdit.id });
      } else {
        // Add new item
        await addKnowledgeItem(itemData);
      }
      setShowEditor(false);
    } catch (error) {
      console.error("Failed to save knowledge item:", error);
      toast({
        title: "Error",
        description: "Failed to save knowledge article",
        variant: "destructive",
      });
    }
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Uncategorized";
  };

  // Apply filtering and sorting
  const filteredAndSortedItems = sortKnowledgeItems(
    filterKnowledgeItems(knowledgeItems, categoryFilter),
    knowledgeSort
  );

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Knowledge Base</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Internal documentation and references</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={handleCreateNewKnowledgeItem}
            variant="secondary"
            className="inline-flex items-center"
          >
            <i className="ri-add-line -ml-1 mr-2 h-5 w-5"></i>
            New Article
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-64">
          <label htmlFor="knowledge-category-filter" className="sr-only">Filter by Category</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-folder-line text-gray-400"></i>
            </div>
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
              <SelectTrigger id="knowledge-category-filter" className="pl-10 pr-10 py-2">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="w-full sm:w-64">
          <label htmlFor="knowledge-sort" className="sr-only">Sort Articles</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-sort-desc text-gray-400"></i>
            </div>
            <Select value={knowledgeSort} onValueChange={(value) => setKnowledgeSort(value as SortOption)}>
              <SelectTrigger id="knowledge-sort" className="pl-10 pr-10 py-2">
                <SelectValue placeholder="Sort articles" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="updated-desc">Recently Updated</SelectItem>
                  <SelectItem value="updated-asc">Oldest Updated</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/6 mb-4" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedItems.map((item) => (
            <KnowledgeCard
              key={item.id}
              item={item}
              categoryName={getCategoryName(item.categoryId)}
              onEdit={handleEditKnowledgeItem}
              onDelete={handleDeleteKnowledgeItem}
            />
          ))}
          {filteredAndSortedItems.length === 0 && (
            <div className="col-span-full bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
              <i className="ri-book-line text-4xl text-gray-400 mb-2"></i>
              <p className="text-gray-500 dark:text-gray-400">No knowledge articles found</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <KnowledgeEditor
        open={showEditor}
        onOpenChange={setShowEditor}
        item={itemToEdit}
        onSave={handleSaveKnowledgeItem}
      />
      
      <KnowledgeDetail />
    </div>
  );
}
