import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  const [renderedHtml, setRenderedHtml] = useState("");

  useEffect(() => {
    const loadMarked = async () => {
      try {
        // Dynamically import marked
        const marked = (await import("marked")).marked;
        
        // Configure options
        marked.setOptions({
          breaks: true,
          gfm: true,
        });
        
        // Render markdown
        const html = marked(content || "");
        setRenderedHtml(html);
      } catch (error) {
        console.error("Error loading or rendering markdown:", error);
        setRenderedHtml(`<p class="text-red-500">Error rendering content</p>`);
      }
    };

    loadMarked();
  }, [content]);

  return (
    <div 
      className={cn("prose prose-sm sm:prose max-w-none dark:prose-invert", className)}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
