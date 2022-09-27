const setItem = (key: string, value: object) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key: string) => {
  const storageItem = localStorage.getItem(key);
  return storageItem ? JSON.parse(storageItem) : undefined;
};

const clear = () => {
  localStorage.clear();
};

export const storage = {
  getItem,
  setItem,
  clear,
};
