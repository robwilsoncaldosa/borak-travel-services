import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseDataManagerOptions<T> {
  initialData: T[];
  apiService: {
    getAll: () => Promise<T[]>;
    delete: (id: string) => Promise<void>;
    create?: (data: any) => Promise<T>;
    update?: (id: string, data: any) => Promise<T>;
  };
  getItemId: (item: T) => string;
}

export function useDataManager<T>({
  initialData,
  apiService,
  getItemId,
}: UseDataManagerOptions<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const updatedData = await apiService.getAll();
      setData(updatedData || []);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  }, [apiService]);

  const deleteItem = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await apiService.delete(id);
      setData(prev => prev.filter(item => getItemId(item) !== id));
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item');
    }
  }, [apiService, getItemId]);

  const createItem = useCallback(async (itemData: any) => {
    if (!apiService.create) return;

    try {
      const newItem = await apiService.create(itemData);
      setData(prev => [...prev, newItem]);
      toast.success('Item created successfully');
      return newItem;
    } catch (error) {
      console.error('Failed to create item:', error);
      toast.error('Failed to create item');
      throw error;
    }
  }, [apiService]);

  const updateItem = useCallback(async (id: string, itemData: any) => {
    if (!apiService.update) return;

    try {
      const updatedItem = await apiService.update(id, itemData);
      setData(prev => prev.map(item => 
        getItemId(item) === id ? updatedItem : item
      ));
      toast.success('Item updated successfully');
      return updatedItem;
    } catch (error) {
      console.error('Failed to update item:', error);
      toast.error('Failed to update item');
      throw error;
    }
  }, [apiService, getItemId]);

  return {
    data,
    isLoading,
    refreshData,
    deleteItem,
    createItem,
    updateItem,
  };
}