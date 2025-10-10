import type { WordProvider } from '../../types';

export class KushApiProvider implements WordProvider {
  name = 'Kush Words API';

  async fetchWords(count: number): Promise<string[]> {
    try {
      const category = Math.random() > 0.5 ? 'noun' : 'verb';
      const response = await fetch(
        `https://random-words-api.kushcreates.com/word/${category}?count=${count}`
      );

      if (!response.ok) {
        return this.getFallbackWords(count);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        return data.map(item => {
          if (typeof item === 'string') {
            return item.toLowerCase();
          }
          if (item && typeof item.word === 'string') {
            return item.word.toLowerCase();
          }
          return '';
        }).filter(word => word.length > 0);
      }

      return this.getFallbackWords(count);
    } catch (error) {
      console.error('Error fetching from Kush API:', error);
      return this.getFallbackWords(count);
    }
  }

  private getFallbackWords(count: number): string[] {
    const fallbackWords = [
      'apple', 'banana', 'orange', 'grape', 'mountain', 'river', 'ocean', 'forest',
      'walk', 'talk', 'think', 'laugh', 'cry', 'smile', 'sleep', 'eat'
    ];

    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      words.push(fallbackWords[Math.floor(Math.random() * fallbackWords.length)]);
    }
    return words;
  }
}
