import { useMemo } from 'react';
import { createDefaultFounderExtras } from '../data/founderExtras.js';
import { useAppStore } from '../store/useAppStore.js';

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
  const rawExtras = useAppStore((state) =>
    founderId ? state.founderExtras[founderId] : undefined,
  );
  const upsertMarketplace = useAppStore((state) => state.upsertFounderMarketplace);
  const recordSuccessFee = useAppStore((state) => state.recordFounderSuccessFee);
  const addServiceRequest = useAppStore((state) => state.addFounderServiceRequest);
  const clearFounderExtras = useAppStore((state) => state.clearFounderExtras);

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
    setMarketplaceListing: (listing) => {
      if (!founderId) return;
      upsertMarketplace(founderId, listing);
    },
    recordSuccessFeeRequest: (request) => {
      if (!founderId) return;
      recordSuccessFee(founderId, request);
    },
    addServiceRequest: (request) => {
      if (!founderId) return;
      addServiceRequest(founderId, request);
    },
    clearExtras: () => {
      if (!founderId) return;
      clearFounderExtras(founderId);
    },
  };
};
