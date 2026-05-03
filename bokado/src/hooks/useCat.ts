import { useState, useEffect, useCallback } from 'react';

interface CatResponse {
  id: string;
  url: string;
  width?: number;
  height?: number;
}

export const useCats = (count: number = 3) => { 
  const [cats, setCats] = useState<CatResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.thecatapi.com/v1/images/search?limit=${count}`
      );
      const data = await response.json();
      setCats(data.slice(0, count)); 
    } catch (err) {
      setError('Не вдалося завантажити котиків');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [count]);

  useEffect(() => {
    fetchCats();
  }, [fetchCats]);

  return { cats, loading, error, refetch: fetchCats };
};