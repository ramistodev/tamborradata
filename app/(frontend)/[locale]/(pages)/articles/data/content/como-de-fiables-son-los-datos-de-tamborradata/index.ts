import type { Locale } from '@/app/types/locale';
import type { ArticleTexts } from '../../../types/article.types';
import en from './en';
import es from './es';
import eu from './eu';

export const texts: Record<Locale, ArticleTexts> = { es, en, eu };
