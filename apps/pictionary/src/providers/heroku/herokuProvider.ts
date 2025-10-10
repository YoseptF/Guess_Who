import type { WordProvider } from '../../types';

export class HerokuWordProvider implements WordProvider {
  name = 'Heroku Words';

  async fetchWords(count: number): Promise<string[]> {
    try {
      const response = await fetch(
        `https://random-word-api.herokuapp.com/word?number=${count}`
      );

      if (!response.ok) {
        console.debug('Failed to fetch from Heroku API');
        return this.getFallbackWords(count);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        return data.map(word => (typeof word === 'string' ? word.toLowerCase() : '')).filter(word => word.length > 0);
      }

      return this.getFallbackWords(count);
    } catch (error) {
      console.error('Error fetching from Heroku API:', error);
      return this.getFallbackWords(count);
    }
  }

  private getFallbackWords(count: number): string[] {
    const fallbackWords = [
      'circle', 'square', 'triangle', 'heart', 'butterfly', 'flower', 'rainbow', 'cloud',
      'bicycle', 'guitar', 'piano', 'drum', 'soccer', 'basketball', 'tennis', 'volleyball'
    ];

    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      words.push(fallbackWords[Math.floor(Math.random() * fallbackWords.length)]);
    }
    return words;
  }
}
