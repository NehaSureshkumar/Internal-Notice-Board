import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid, parseISO } from "date-fns";
import { Notice, KnowledgeItem, SortOption, FilterOption } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Date parsing error:', error);
    return 'Invalid date';
  }
}

export function truncateText(text: string | undefined, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

export function filterNotices(notices: Notice[], filter: FilterOption): Notice[] {
  if (filter === 'all') return notices;
  
  if (filter === 'high') {
    return notices.filter(notice => notice.priority === 'high');
  } 
  
  if (filter === 'normal') {
    return notices.filter(notice => notice.priority === 'normal');
  } 
  
  if (filter === 'recent') {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return notices.filter(notice => new Date(notice.date) >= oneWeekAgo);
  }
  
  return notices;
}

export function sortNotices(notices: Notice[], sort: SortOption): Notice[] {
  const sortedNotices = [...notices];
  
  if (sort === 'date-desc') {
    return sortedNotices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } 
  
  if (sort === 'date-asc') {
    return sortedNotices.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } 
  
  if (sort === 'priority-desc') {
    return sortedNotices.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } 
  
  if (sort === 'title-asc') {
    return sortedNotices.sort((a, b) => a.title.localeCompare(b.title));
  }
  
  if (sort === 'title-desc') {
    return sortedNotices.sort((a, b) => b.title.localeCompare(a.title));
  }
  
  return sortedNotices;
}

export function filterKnowledgeItems(items: KnowledgeItem[], categoryId: string): KnowledgeItem[] {
  if (categoryId === 'all') return items;
  return items.filter(item => item.categoryId === categoryId);
}

export function sortKnowledgeItems(items: KnowledgeItem[], sort: SortOption): KnowledgeItem[] {
  const sortedItems = [...items];
  
  if (sort === 'updated-desc') {
    return sortedItems.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
  } 
  
  if (sort === 'updated-asc') {
    return sortedItems.sort((a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime());
  } 
  
  if (sort === 'title-asc') {
    return sortedItems.sort((a, b) => a.title.localeCompare(b.title));
  }
  
  if (sort === 'title-desc') {
    return sortedItems.sort((a, b) => b.title.localeCompare(a.title));
  }
  
  return sortedItems;
}

export function searchItems(query: string, notices: Notice[], knowledgeItems: KnowledgeItem[]) {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return { notices: [], knowledgeItems: [] };
  }
  
  const matchedNotices = notices.filter(notice => 
    notice.title.toLowerCase().includes(normalizedQuery) || 
    notice.content.toLowerCase().includes(normalizedQuery)
  ).slice(0, 5);
  
  const matchedKnowledgeItems = knowledgeItems.filter(item => 
    item.title.toLowerCase().includes(normalizedQuery) || 
    item.content.toLowerCase().includes(normalizedQuery)
  ).slice(0, 5);
  
  return { notices: matchedNotices, knowledgeItems: matchedKnowledgeItems };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function getRecentNotices(notices: Notice[]): Notice[] {
  return [...notices]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
}

export function getActiveNoticesCount(notices: Notice[]): number {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return notices.filter(notice => new Date(notice.date) >= oneMonthAgo).length;
}

export function getPopularKnowledgeItems(items: KnowledgeItem[]): KnowledgeItem[] {
  return [...items]
    .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
    .slice(0, 3);
}
