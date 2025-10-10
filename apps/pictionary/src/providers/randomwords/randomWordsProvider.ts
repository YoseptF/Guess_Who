import type { WordProvider } from '../../types';

export class RandomWordsApiProvider implements WordProvider {
  name = 'Random Words API';

  async fetchWords(count: number): Promise<string[]> {
    try {
      const words: string[] = [];

      for (let i = 0; i < count; i++) {
        const wordType = Math.random() > 0.5 ? 'noun' : 'verb';
        const response = await fetch(`https://random-words-api.vercel.app/${wordType}`);

        if (!response.ok) {
          console.debug(`Failed to fetch word ${i + 1} from Random Words API`);
          continue;
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0 && data[0].word) {
          words.push(data[0].word.toLowerCase());
        }
      }

      return words.length > 0 ? words : this.getFallbackWords(count);
    } catch (error) {
      console.error('Error fetching from Random Words API:', error);
      return this.getFallbackWords(count);
    }
  }

  private getFallbackWords(count: number): string[] {
    const fallbackWords = [
      'cat', 'dog', 'tree', 'house', 'car', 'phone', 'book', 'sun', 'moon', 'star',
      'run', 'jump', 'swim', 'fly', 'dance', 'sing', 'read', 'write', 'draw', 'paint'
    ];

    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      words.push(fallbackWords[Math.floor(Math.random() * fallbackWords.length)]);
    }
    return words;
  }
}
