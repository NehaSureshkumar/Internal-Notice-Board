import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/app-context";
import { searchItems, truncateText } from "@/lib/utils";

export function SearchModal() {
  const { notices, knowledgeItems, setSelectedNotice, setSelectedKnowledgeItem } = useAppContext();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    notices: typeof notices;
    knowledgeItems: typeof knowledgeItems;
  }>({ notices: [], knowledgeItems: [] });

  // Listen for the custom event to open the search modal
  useEffect(() => {
    const handleOpenSearch = () => {
      setOpen(true);
      setSearchQuery("");
      setSearchResults({ notices: [], knowledgeItems: [] });
    };

    window.addEventListener("open-search", handleOpenSearch);
    return () => {
      window.removeEventListener("open-search", handleOpenSearch);
    };
  }, []);

  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchItems(searchQuery, notices, knowledgeItems);
      setSearchResults(results);
    } else {
      setSearchResults({ notices: [], knowledgeItems: [] });
    }
  }, [searchQuery, notices, knowledgeItems]);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const input = document.getElementById("search-input");
        if (input) {
          input.focus();
        }
      }, 100);
    }
  }, [open]);

  const handleViewNotice = (noticeId: string) => {
    const notice = notices.find(n => n.id === noticeId);
    if (notice) {
      setSelectedNotice(notice);
      setOpen(false);
    }
  };

  const handleViewKnowledgeItem = (itemId: string) => {
    const item = knowledgeItems.find(i => i.id === itemId);
    if (item) {
      setSelectedKnowledgeItem(item);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="relative">
          <Input
            id="search-input"
            placeholder="Search notices and knowledge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-3 py-2"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="ri-search-line text-gray-400"></i>
          </div>
        </div>
        
        <div className="mt-4 max-h-60 overflow-y-auto">
          {searchResults.notices.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Notices
              </h4>
              <ul className="space-y-2">
                {searchResults.notices.map((result) => (
                  <li 
                    key={result.id}
                    className="px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                    onClick={() => handleViewNotice(result.id)}
                  >
                    <div className="flex items-center">
                      <i className="ri-notification-3-line text-primary mr-2"></i>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {result.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-5 mt-1">
                      {truncateText(result.content, 60)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {searchResults.knowledgeItems.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Knowledge Base
              </h4>
              <ul className="space-y-2">
                {searchResults.knowledgeItems.map((result) => (
                  <li 
                    key={result.id}
                    className="px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                    onClick={() => handleViewKnowledgeItem(result.id)}
                  >
                    <div className="flex items-center">
                      <i className="ri-book-open-line text-secondary mr-2"></i>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {result.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-5 mt-1">
                      {truncateText(result.content, 60)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {searchQuery && searchResults.notices.length === 0 && searchResults.knowledgeItems.length === 0 && (
            <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found for "<span>{searchQuery}</span>"
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Type to search across all content
          </p>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
