import { useCallback } from 'react';
import { getProviderByName } from '../providers';

export const useWordProviders = () => {
  const fetchWord = useCallback(async (enabledProviders: string[]): Promise<string> => {
    if (enabledProviders.length === 0) {
      return 'cat';
    }

    const randomProvider = enabledProviders[Math.floor(Math.random() * enabledProviders.length)];
    const provider = getProviderByName(randomProvider);

    if (!provider) {
      return 'dog';
    }

    try {
      const words = await provider.fetchWords(1);
      return words.length > 0 ? words[0] : 'tree';
    } catch (error) {
      console.error('Error fetching word:', error);
      return 'house';
    }
  }, []);

  return { fetchWord };
};
