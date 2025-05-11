import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KnowledgeItem } from "@/types";
import { formatDate, truncateText } from "@/lib/utils";
import { useState } from "react";
import { useAppContext } from "@/context/app-context";

interface KnowledgeCardProps {
  item: KnowledgeItem;
  categoryName: string;
  onEdit: (item: KnowledgeItem) => void;
  onDelete: (id: string) => void;
}

export function KnowledgeCard({ item, categoryName, onEdit, onDelete }: KnowledgeCardProps) {
  const { setSelectedKnowledgeItem } = useAppContext();
  const [isHover, setIsHover] = useState(false);

  const handleView = () => {
    setSelectedKnowledgeItem(item);
  };

  return (
    <Card 
      className="bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow duration-300"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white truncate">
            {item.title}
          </h3>
          <div className="flex">
            <Button 
              variant="ghost" 
              size="sm"
              className={`text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 ${isHover ? 'opacity-100' : 'opacity-0 md:opacity-100'} transition-opacity`}
              onClick={() => onEdit(item)}
            >
              <i className="ri-edit-line"></i>
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={`ml-2 text-gray-400 hover:text-red-500 ${isHover ? 'opacity-100' : 'opacity-0 md:opacity-100'} transition-opacity`}
              onClick={() => onDelete(item.id)}
            >
              <i className="ri-delete-bin-line"></i>
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
        <div className="mt-2 max-h-24 overflow-hidden text-sm text-gray-500 dark:text-gray-400">
          {truncateText(item.content, 100)}
        </div>
        <div className="mt-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <i className="ri-calendar-line mr-1"></i>
            <span>{formatDate(item.updated)}</span>
            <span className="mx-2">•</span>
            <i className="ri-folder-line mr-1"></i>
            <span>{categoryName}</span>
          </div>
          <div className="mt-2">
            <Button 
              variant="link" 
              className="text-secondary hover:text-secondary/80 p-0 h-auto font-medium"
              onClick={handleView}
            >
              Read more
              <i className="ri-arrow-right-line ml-1"></i>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
