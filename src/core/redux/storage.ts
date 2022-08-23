const setItem = (key: string, value: object) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key: string) => {
  const storedState = localStorage.getItem(key);

  if (!storedState) return null;

  try {
    return JSON.parse(storedState);
  } catch (err) {
    return storedState;
  }
};

const clear = () => {
  localStorage.clear();
};

export const storage = {
  getItem,
  setItem,
  clear,
};
