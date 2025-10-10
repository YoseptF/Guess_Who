import { faker } from '@faker-js/faker';
import type { WordProvider } from '../../types';

export class FakerProvider implements WordProvider {
  name = 'Faker (Offline)';

  async fetchWords(count: number): Promise<string[]> {
    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      const wordType = Math.floor(Math.random() * 3);
      let word: string;

      switch (wordType) {
        case 0:
          word = faker.word.noun();
          break;
        case 1:
          word = faker.word.verb();
          break;
        case 2:
          word = faker.word.adjective();
          break;
        default:
          word = faker.word.sample();
      }

      words.push(word.toLowerCase());
    }

    return words;
  }
}
