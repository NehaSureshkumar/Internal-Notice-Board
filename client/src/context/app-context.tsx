import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Notice, KnowledgeItem, Category } from '@/types';
import { db } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  notices: Notice[];
  knowledgeItems: KnowledgeItem[];
  categories: Category[];
  addNotice: (notice: Omit<Notice, 'id'>) => Promise<Notice>;
  updateNotice: (notice: Notice) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
  addKnowledgeItem: (item: Omit<KnowledgeItem, 'id'>) => Promise<KnowledgeItem>;
  updateKnowledgeItem: (item: KnowledgeItem) => Promise<void>;
  deleteKnowledgeItem: (id: string) => Promise<void>;
  selectedNotice: Notice | null;
  selectedKnowledgeItem: KnowledgeItem | null;
  setSelectedNotice: (notice: Notice | null) => void;
  setSelectedKnowledgeItem: (item: KnowledgeItem | null) => void;
  resetToSampleData: () => Promise<void>;
  isLoading: boolean;
}

const defaultContextValue: AppContextType = {
  notices: [],
  knowledgeItems: [],
  categories: [],
  addNotice: async () => ({ id: '', title: '', content: '', author: '', date: '', priority: 'normal' }),
  updateNotice: async () => {},
  deleteNotice: async () => {},
  addKnowledgeItem: async () => ({ id: '', title: '', content: '', categoryId: '', created: '', updated: '' }),
  updateKnowledgeItem: async () => {},
  deleteKnowledgeItem: async () => {},
  selectedNotice: null,
  selectedKnowledgeItem: null,
  setSelectedNotice: () => {},
  setSelectedKnowledgeItem: () => {},
  resetToSampleData: async () => {},
  isLoading: false
};

const AppContext = createContext<AppContextType>(defaultContextValue);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedKnowledgeItem, setSelectedKnowledgeItem] = useState<KnowledgeItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, noticesData, knowledgeItemsData] = await Promise.all([
        db.categories.toArray(),
        db.notices.toArray(),
        db.knowledgeItems.toArray()
      ]);

      setCategories(categoriesData);
      setNotices(noticesData);
      setKnowledgeItems(knowledgeItemsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data from database',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetToSampleData = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addNotice = async (notice: Omit<Notice, 'id'>): Promise<Notice> => {
    const newNotice: Notice = { ...notice, id: Date.now().toString() };
    await db.notices.add(newNotice);
    setNotices((prev) => [...prev, newNotice]);
    return newNotice;
  };

  const updateNotice = async (notice: Notice): Promise<void> => {
    await db.notices.update(notice.id, notice);
    setNotices((prev) => prev.map((n) => (n.id === notice.id ? notice : n)));
  };

  const deleteNotice = async (id: string): Promise<void> => {
    await db.notices.delete(id);
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const addKnowledgeItem = async (item: Omit<KnowledgeItem, 'id'>): Promise<KnowledgeItem> => {
    const newItem: KnowledgeItem = { ...item, id: Date.now().toString() };
    await db.knowledgeItems.add(newItem);
    setKnowledgeItems((prev) => [...prev, newItem]);
    return newItem;
  };

  const updateKnowledgeItem = async (item: KnowledgeItem): Promise<void> => {
    await db.knowledgeItems.update(item.id, item);
    setKnowledgeItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
  };

  const deleteKnowledgeItem = async (id: string): Promise<void> => {
    await db.knowledgeItems.delete(id);
    setKnowledgeItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        notices,
        knowledgeItems,
        categories,
        addNotice,
        updateNotice,
        deleteNotice,
        addKnowledgeItem,
        updateKnowledgeItem,
        deleteKnowledgeItem,
        selectedNotice,
        selectedKnowledgeItem,
        setSelectedNotice,
        setSelectedKnowledgeItem,
        resetToSampleData,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);