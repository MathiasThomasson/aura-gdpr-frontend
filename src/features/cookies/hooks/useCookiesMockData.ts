import { useState } from 'react';
import { CookieItem } from '../types';

export function useCookiesMockData() {
  const [cookies, setCookies] = useState<CookieItem[]>([
    {
      id: 'cookie_001',
      name: '_ga',
      domain: 'example.com',
      duration: '2 years',
      category: 'analytics',
      purpose: 'Google Analytics visitor tracking.',
      provider: 'Google Analytics',
      type: 'third_party',
      source: 'scanner',
      createdAt: '2025-01-10T09:00:00Z',
      lastUpdated: '2025-03-01T10:00:00Z',
    },
    {
      id: 'cookie_002',
      name: '_gid',
      domain: 'example.com',
      duration: '24 hours',
      category: 'analytics',
      purpose: 'Google Analytics session tracking.',
      provider: 'Google Analytics',
      type: 'third_party',
      source: 'scanner',
      createdAt: '2025-02-12T09:00:00Z',
      lastUpdated: '2025-03-05T10:00:00Z',
    },
    {
      id: 'cookie_003',
      name: 'session_id',
      domain: 'example.com',
      duration: 'Session',
      category: 'necessary',
      purpose: 'Maintain user session for authenticated users.',
      provider: 'Internal',
      type: 'first_party',
      source: 'manual',
      createdAt: '2025-01-01T08:00:00Z',
      lastUpdated: '2025-02-20T12:00:00Z',
    },
    {
      id: 'cookie_004',
      name: 'marketing_banner_seen',
      domain: 'example.com',
      duration: '30 days',
      category: 'marketing',
      purpose: 'Track dismissal of marketing banner.',
      provider: 'Internal',
      type: 'first_party',
      source: 'manual',
      createdAt: '2025-02-15T09:00:00Z',
      lastUpdated: '2025-03-10T11:00:00Z',
    },
    {
      id: 'cookie_005',
      name: 'language_pref',
      domain: 'example.com',
      duration: '1 year',
      category: 'preferences',
      purpose: 'Store user language preference.',
      provider: 'Internal',
      type: 'first_party',
      source: 'imported',
      createdAt: '2025-02-20T09:00:00Z',
      lastUpdated: '2025-03-15T10:30:00Z',
    },
  ]);

  return { cookies, setCookies, isLoading: false, isError: false };
}

export default useCookiesMockData;
