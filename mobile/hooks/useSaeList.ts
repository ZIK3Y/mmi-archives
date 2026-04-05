import { useEffect, useState, useCallback } from 'react';
import { Sae } from '@/types/types';
import { fetchAllSae, fetchSaeByAnnee, fetchSaeByDomaine, fetchSaeByNote } from '@/api/SaeApi';

type FilterMode = 'all' | 'annee' | 'domaine' | 'classement';

export function useSaeList(mode: FilterMode = 'all', filterValue?: string) {
  const [saes, setSaes] = useState<Sae[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSaes([]);

      let data: Sae[] = [];

      if (mode === 'annee' && filterValue) {
        data = await fetchSaeByAnnee(filterValue);
      } else if (mode === 'domaine' && filterValue) {
        data = await fetchSaeByDomaine(filterValue);
      } else if (mode === 'classement') {
        data = await fetchSaeByNote();
      } else {
        data = await fetchAllSae();
      }

      setSaes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('useSaeList error:', err);
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [mode, filterValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { saes, loading, error, refetch: fetchData };
}
