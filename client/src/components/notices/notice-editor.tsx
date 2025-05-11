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
import { Notice } from "@/types";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/app-context";

interface NoticeEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice?: Notice;
  onSave: (notice: Omit<Notice, 'id'>) => void;
}

export function NoticeEditor({ open, onOpenChange, notice, onSave }: NoticeEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [priority, setPriority] = useState<"normal" | "high">("normal");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const isEditing = !!notice;

  // Reset form when the modal opens with a notice
  useEffect(() => {
    if (open) {
      if (notice) {
        setTitle(notice.title);
        setContent(notice.content);
        setAuthor(notice.author);
        setDate(notice.date);
        setPriority(notice.priority);
      } else {
        // Default values for new notice
        setTitle("");
        setContent("");
        setAuthor("");
        setDate(new Date().toISOString().split("T")[0]);
        setPriority("normal");
      }
      setErrors({});
    }
  }, [open, notice]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!content.trim()) {
      newErrors.content = "Content is required";
    }
    
    if (!author.trim()) {
      newErrors.author = "Author is required";
    }
    
    if (!date) {
      newErrors.date = "Date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave({
        title,
        content,
        author,
        date,
        priority,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Notice" : "Create New Notice"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for your notice. Click save when you're done.
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
            <Label htmlFor="author" className={errors.author ? "text-destructive" : ""}>
              Author
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={errors.author ? "border-destructive" : ""}
            />
            {errors.author && (
              <p className="text-sm text-destructive">{errors.author}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date" className={errors.date ? "text-destructive" : ""}>
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={errors.date ? "border-destructive" : ""}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={priority} 
                onValueChange={(value) => setPriority(value as "normal" | "high")}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content" className={errors.content ? "text-destructive" : ""}>
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
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
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
