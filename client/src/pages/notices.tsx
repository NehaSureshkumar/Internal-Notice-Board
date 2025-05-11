import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import { useState, useEffect } from "react";
import { NoticeCard } from "@/components/notices/notice-card";
import { NoticeEditor } from "@/components/notices/notice-editor";
import { NoticeDetail } from "@/components/notices/notice-detail";
import { Notice, FilterOption, SortOption } from "@/types";
import { filterNotices, sortNotices } from "@/lib/utils";
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

export default function Notices() {
  const { notices, addNotice, updateNotice, deleteNotice, selectedNotice, isLoading } = useAppContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [noticeToEdit, setNoticeToEdit] = useState<Notice | undefined>(undefined);
  const [showEditor, setShowEditor] = useState(false);
  const [noticeFilter, setNoticeFilter] = useState<FilterOption>("all");
  const [noticeSort, setNoticeSort] = useState<SortOption>("date-desc");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<string | null>(null);

  // Effect to dispatch location change event when route changes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("location-changed"));
  }, []);

  const handleCreateNewNotice = () => {
    setNoticeToEdit(undefined);
    setShowEditor(true);
  };

  const handleEditNotice = (notice: Notice) => {
    setNoticeToEdit(notice);
    setShowEditor(true);
  };

  const handleDeleteNotice = (id: string) => {
    setNoticeToDelete(id);
    
    // Use the confirm dialog
    window.dispatchEvent(
      new CustomEvent("confirm-dialog", {
        detail: {
          title: "Delete Notice",
          description: "Are you sure you want to delete this notice? This action cannot be undone.",
          confirmText: "Delete",
          cancelText: "Cancel",
          onConfirm: async () => {
            try {
              await deleteNotice(id);
            } catch (error) {
              console.error("Failed to delete notice:", error);
            }
          },
          onCancel: () => {
            setNoticeToDelete(null);
          }
        }
      })
    );
  };

  const handleSaveNotice = async (noticeData: Omit<Notice, "id">) => {
    try {
      if (noticeToEdit) {
        // Update existing notice
        await updateNotice({ ...noticeData, id: noticeToEdit.id });
      } else {
        // Add new notice
        await addNotice(noticeData);
      }
      setShowEditor(false);
    } catch (error) {
      console.error("Failed to save notice:", error);
      toast({
        title: "Error",
        description: "Failed to save notice",
        variant: "destructive",
      });
    }
  };

  // Apply filtering and sorting
  const filteredAndSortedNotices = sortNotices(filterNotices(notices, noticeFilter), noticeSort);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Notices</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Company announcements and updates</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={handleCreateNewNotice}
            className="inline-flex items-center"
          >
            <i className="ri-add-line -ml-1 mr-2 h-5 w-5"></i>
            New Notice
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-64">
          <label htmlFor="notice-filter" className="sr-only">Filter Notices</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-filter-line text-gray-400"></i>
            </div>
            <Select value={noticeFilter} onValueChange={(value) => setNoticeFilter(value as FilterOption)}>
              <SelectTrigger id="notice-filter" className="pl-10 pr-10 py-2">
                <SelectValue placeholder="Filter notices" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Notices</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="normal">Normal Priority</SelectItem>
                  <SelectItem value="recent">Recent (Last 7 days)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="w-full sm:w-64">
          <label htmlFor="notice-sort" className="sr-only">Sort Notices</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-sort-desc text-gray-400"></i>
            </div>
            <Select value={noticeSort} onValueChange={(value) => setNoticeSort(value as SortOption)}>
              <SelectTrigger id="notice-sort" className="pl-10 pr-10 py-2">
                <SelectValue placeholder="Sort notices" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="priority-desc">Priority (High-Low)</SelectItem>
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
          {filteredAndSortedNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onEdit={handleEditNotice}
              onDelete={handleDeleteNotice}
            />
          ))}
          {filteredAndSortedNotices.length === 0 && (
            <div className="col-span-full bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
              <i className="ri-inbox-line text-4xl text-gray-400 mb-2"></i>
              <p className="text-gray-500 dark:text-gray-400">No notices found</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <NoticeEditor
        open={showEditor}
        onOpenChange={setShowEditor}
        notice={noticeToEdit}
        onSave={handleSaveNotice}
      />
      
      <NoticeDetail />
    </div>
  );
}
