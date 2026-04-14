'use client';

import { useEffect, useState } from 'react';

const REGION_STORAGE_KEY = 'tri_dharma_region';
const DEFAULT_REGION = 'Surabaya';

export function useRegionFilter(initialRegion?: string) {
  const [region, setRegion] = useState<string>(initialRegion || DEFAULT_REGION);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRegion = localStorage.getItem(REGION_STORAGE_KEY);
      if (storedRegion) {
        setRegion(storedRegion);
      }
    }
    setMounted(true);
  }, []);

  // Save to localStorage when region changes
  const updateRegion = (newRegion: string) => {
    setRegion(newRegion);
    if (typeof window !== 'undefined') {
      localStorage.setItem(REGION_STORAGE_KEY, newRegion);
    }
  };

  return { region: mounted ? region : (initialRegion || DEFAULT_REGION), updateRegion, mounted };
}
