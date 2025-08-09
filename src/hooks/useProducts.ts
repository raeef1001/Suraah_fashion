import { useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { 
  getAllProducts, 
  getProductById, 
  getProductsByCategory, 
  searchProducts,
  getFeaturedProducts,
  subscribeToProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateProductStock
} from '@/services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
};

export const useProductsByCategory = (category: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getProductsByCategory(category);
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  return { products, loading, error };
};

export const useProductSearch = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (searchTerm: string) => {
    try {
      setLoading(true);
      const searchResults = await searchProducts(searchTerm);
      setProducts(searchResults);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, search };
};

export const useFeaturedProducts = (limit: number = 8) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getFeaturedProducts(limit);
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  return { products, loading, error };
};

export const useRealtimeProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  return { products, loading, error };
};

export const useProductMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (product: Omit<Product, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const id = await addProduct(product);
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProductData = async (id: string, updates: Partial<Omit<Product, 'id'>>) => {
    try {
      setLoading(true);
      setError(null);
      await updateProduct(id, updates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteProduct(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      await updateProductStock(id, quantity);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update stock';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    updateProduct: updateProductData,
    deleteProduct: removeProduct,
    updateStock,
    loading,
    error
  };
};