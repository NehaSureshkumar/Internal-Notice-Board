import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KnowledgeItem } from "@/types";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/app-context";

interface KnowledgeEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: KnowledgeItem;
  onSave: (item: Omit<KnowledgeItem, 'id'>) => void;
}

export function KnowledgeEditor({ open, onOpenChange, item, onSave }: KnowledgeEditorProps) {
  const { categories } = useAppContext();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const isEditing = !!item;
  const today = new Date().toISOString().split("T")[0];

  // Reset form when the modal opens with an item
  useEffect(() => {
    if (open) {
      if (item) {
        setTitle(item.title);
        setContent(item.content);
        setCategoryId(item.categoryId);
      } else {
        // Default values for new item
        setTitle("");
        setContent("");
        setCategoryId(categories[0]?.id || "");
      }
      setErrors({});
    }
  }, [open, item, categories]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!content.trim()) {
      newErrors.content = "Content is required";
    }
    
    if (!categoryId) {
      newErrors.categoryId = "Category is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave({
        title,
        content,
        categoryId,
        created: item?.created || today,
        updated: today,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Knowledge Article" : "Create New Knowledge Article"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for your knowledge article. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category" className={errors.categoryId ? "text-destructive" : ""}>
              Category
            </Label>
            <Select 
              value={categoryId} 
              onValueChange={setCategoryId}
            >
              <SelectTrigger id="category" className={errors.categoryId ? "border-destructive" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content" className={errors.content ? "text-destructive" : ""}>
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className={errors.content ? "border-destructive" : ""}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">You can use markdown formatting</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="secondary"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
