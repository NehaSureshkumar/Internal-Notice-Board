export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'high' | 'normal';
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  created: string;
  updated: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ExportData {
  notices?: Notice[];
  knowledgeItems?: KnowledgeItem[];
  categories?: Category[];
}

export type SortOption = 'date-desc' | 'date-asc' | 'priority-desc' | 'title-asc' | 'title-desc' | 'updated-desc' | 'updated-asc';

export type FilterOption = 'all' | 'high' | 'normal' | 'recent';
