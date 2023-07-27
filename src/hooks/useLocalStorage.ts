import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  useEffect(() => {
    const setValue = (value: T) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    };

    if (storedValue) {
      setValue(storedValue);
    }
  }, [storedValue, key]);

  return [storedValue, setStoredValue];
};
