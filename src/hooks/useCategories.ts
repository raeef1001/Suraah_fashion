import { useState, useEffect } from 'react';
import { FirestoreCategory } from '@/types/firestore';
import { 
  getAllCategories,
  getActiveCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  subscribeToCategories,
  getCategoryStatistics
} from '@/services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState<FirestoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch };
};

export const useRealtimeCategories = () => {
  const [categories, setCategories] = useState<FirestoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToCategories((updatedCategories) => {
      setCategories(updatedCategories);
      setLoading(false);
      setError(null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { categories, loading, error };
};

export const useCategory = (id: string) => {
  const [category, setCategory] = useState<FirestoreCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const fetchedCategory = await getCategoryById(id);
        setCategory(fetchedCategory);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  return { category, loading, error };
};

export const useCategoryMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCategory = async (categoryData: Omit<FirestoreCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const categoryId = await createCategory(categoryData);
      return categoryId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const editCategory = async (id: string, updates: Partial<Omit<FirestoreCategory, 'id' | 'createdAt'>>) => {
    try {
      setLoading(true);
      setError(null);
      await updateCategory(id, updates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeCategory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteCategory(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    addCategory,
    editCategory,
    deleteCategory: removeCategory,
    loading,
    error
  };
};

export const useCategoryStatistics = () => {
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    inactive: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statistics = await getCategoryStatistics();
        setStats(statistics);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};