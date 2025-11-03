import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import { readActiveFounderId } from '../lib/founderSession.js';

export const useActiveFounder = () => {
  const founders = useAppStore((state) => state.founders);
  const persistedId = readActiveFounderId();

  const activeFounder = useMemo(() => {
    if (!founders?.length) return null;
    if (persistedId) {
      const match = founders.find((founder) => founder.id === persistedId);
      if (match) return match;
    }
    return founders[0];
  }, [founders, persistedId]);

  return {
    activeFounder,
    founderId: activeFounder?.id ?? null,
  };
};
