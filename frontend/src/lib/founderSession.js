export const ACTIVE_FOUNDER_KEY = 'launch.activeFounderId';

export const readActiveFounderId = () => {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(ACTIVE_FOUNDER_KEY);
};

export const persistActiveFounderId = (founderId) => {
  if (typeof window === 'undefined') return;
  if (founderId) {
    window.sessionStorage.setItem(ACTIVE_FOUNDER_KEY, founderId);
  } else {
    window.sessionStorage.removeItem(ACTIVE_FOUNDER_KEY);
  }
};
