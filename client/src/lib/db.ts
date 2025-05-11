import Dexie, { Table } from 'dexie';
import { Notice, KnowledgeItem, Category } from '@/types';

class KnowledgeHubDatabase extends Dexie {
  notices!: Table<Notice, string>;
  knowledgeItems!: Table<KnowledgeItem, string>;
  categories!: Table<Category, string>;

  constructor() {
    super('KnowledgeHubDatabase');
    
    this.version(1).stores({
      notices: 'id, title, author, date, priority',
      knowledgeItems: 'id, title, categoryId, created, updated',
      categories: 'id, name'
    });
  }
}

export const db = new KnowledgeHubDatabase();
