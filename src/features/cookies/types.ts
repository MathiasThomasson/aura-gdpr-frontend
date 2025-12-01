export type CookieCategory = 'necessary' | 'preferences' | 'analytics' | 'marketing' | 'unclassified';

export type CookieSource = 'manual' | 'scanner' | 'imported';

export interface CookieItem {
  id: string;
  name: string;
  domain: string;
  duration: string;
  category: CookieCategory;
  purpose: string;
  provider: string;
  type: 'first_party' | 'third_party';
  source: CookieSource;
  createdAt: string;
  lastUpdated: string;
}
