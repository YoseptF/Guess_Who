import { FakerProvider } from './faker/fakerProvider';
import { RandomWordsApiProvider } from './randomwords/randomWordsProvider';
import { KushApiProvider } from './kush/kushProvider';
import { HerokuWordProvider } from './heroku/herokuProvider';
import type { WordProvider } from '../types';

export const wordProviders: WordProvider[] = [
  new FakerProvider(),
  new RandomWordsApiProvider(),
  new KushApiProvider(),
  new HerokuWordProvider(),
];

export const getProviderByName = (name: string): WordProvider | undefined =>
  wordProviders.find(provider => provider.name === name);

export * from './faker/fakerProvider';
export * from './randomwords/randomWordsProvider';
export * from './kush/kushProvider';
export * from './heroku/herokuProvider';
