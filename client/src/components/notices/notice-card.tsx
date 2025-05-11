import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Notice } from "@/types";
import { formatDate, truncateText } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useAppContext } from "@/context/app-context";

interface NoticeCardProps {
  notice: Notice;
  onEdit: (notice: Notice) => void;
  onDelete: (id: string) => void;
}

export function NoticeCard({ notice, onEdit, onDelete }: NoticeCardProps) {
  const { setSelectedNotice } = useAppContext();
  const [isHover, setIsHover] = useState(false);

  const handleView = () => {
    setSelectedNotice(notice);
  };

  return (
    <Card 
      className="bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow duration-300 overflow-hidden"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className={`border-l-4 h-full ${notice.priority === 'high' ? 'border-red-500' : 'border-green-500'}`}>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white truncate">
              {notice.title}
            </h3>
            <div className="flex">
              <Button 
                variant="ghost" 
                size="sm"
                className={`text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 ${isHover ? 'opacity-100' : 'opacity-0 md:opacity-100'} transition-opacity`}
                onClick={() => onEdit(notice)}
              >
                <i className="ri-edit-line"></i>
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`ml-2 text-gray-400 hover:text-red-500 ${isHover ? 'opacity-100' : 'opacity-0 md:opacity-100'} transition-opacity`}
                onClick={() => onDelete(notice.id)}
              >
                <i className="ri-delete-bin-line"></i>
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
          <div className="mt-2 max-h-24 overflow-hidden text-sm text-gray-500 dark:text-gray-400">
            {truncateText(notice.content, 100)}
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <i className="ri-calendar-line mr-1"></i>
              <span>{formatDate(notice.date)}</span>
              <span className="mx-2">•</span>
              <i className="ri-user-line mr-1"></i>
              <span>{notice.author}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                {notice.priority === 'high' && (
                  <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900">
                    High Priority
                  </Badge>
                )}
                {notice.priority === 'normal' && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0 hover:bg-green-100 dark:hover:bg-green-900">
                    Normal Priority
                  </Badge>
                )}
              </div>
              <Button 
                variant="link" 
                className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
                onClick={handleView}
              >
                Read more
                <i className="ri-arrow-right-line ml-1"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
