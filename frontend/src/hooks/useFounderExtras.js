import { useEffect, useMemo } from 'react';
import { createDefaultFounderExtras } from '../data/founderExtras.js';
import { useAppStore } from '../store/useAppStore.js';
import { useAuth } from '../context/useAuth.js';

const cloneExtras = (extras) => ({
  marketplaceListing: extras.marketplaceListing
    ? { ...extras.marketplaceListing }
    : null,
  successFeeRequest: extras.successFeeRequest ? { ...extras.successFeeRequest } : null,
  serviceRequests: Array.isArray(extras.serviceRequests)
    ? extras.serviceRequests.map((item) => ({ ...item }))
    : [],
});

export const useFounderExtras = (founderId) => {
  const { token } = useAuth();
  const rawExtras = useAppStore((state) =>
    founderId ? state.founderExtras[founderId] : undefined,
  );
  const fetchFounderExtras = useAppStore((state) => state.fetchFounderExtras);
  const upsertMarketplace = useAppStore((state) => state.upsertFounderMarketplace);
  const recordSuccessFee = useAppStore((state) => state.recordFounderSuccessFee);
  const addServiceRequest = useAppStore((state) => state.addFounderServiceRequest);
  const clearFounderExtras = useAppStore((state) => state.clearFounderExtras);

  useEffect(() => {
    if (!founderId) return;
    fetchFounderExtras(founderId, token).catch((error) => {
      console.error('Failed to load founder extras', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [founderId, token]);

  const extras = useMemo(() => {
    if (!founderId) {
      return createDefaultFounderExtras();
    }
    if (!rawExtras) {
      return createDefaultFounderExtras();
    }
    return cloneExtras(rawExtras);
  }, [founderId, rawExtras]);

  return {
    extras,
    setMarketplaceListing: async (listing) => {
      if (!founderId) return null;
      return upsertMarketplace(founderId, listing, token);
    },
    recordSuccessFeeRequest: async (request) => {
      if (!founderId) return null;
      return recordSuccessFee(founderId, request, token);
    },
    addServiceRequest: async (request) => {
      if (!founderId) return null;
      return addServiceRequest(founderId, request, token);
    },
    clearExtras: () => {
      if (!founderId) return;
      clearFounderExtras(founderId);
    },
  };
};
