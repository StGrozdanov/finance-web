'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface FollowingContextType {
  followedAssets: Set<string>;
  followAsset: (assetId: string) => void;
  unfollowAsset: (assetId: string) => void;
  isFollowing: (assetId: string) => boolean;
  toggleFollow: (assetId: string) => void;
}

const FollowingContext = createContext<FollowingContextType | null>(null);

const STORAGE_KEY = 'finance-app-followed-assets';

interface FollowingProviderProps {
  children: ReactNode;
}

export function FollowingProvider({ children }: FollowingProviderProps) {
  const [followedAssets, setFollowedAssets] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Load followed assets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const assetIds = JSON.parse(saved) as string[];
        setFollowedAssets(new Set(assetIds));
      } catch (error) {
        console.error(
          'Failed to parse followed assets from localStorage:',
          error,
        );
      }
    }
    setMounted(true);
  }, []);

  // Save to localStorage whenever followedAssets changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(followedAssets)),
      );
    }
  }, [followedAssets, mounted]);

  const followAsset = (assetId: string) => {
    setFollowedAssets(prev => new Set([...prev, assetId]));
  };

  const unfollowAsset = (assetId: string) => {
    setFollowedAssets(prev => {
      const newSet = new Set(prev);
      newSet.delete(assetId);
      return newSet;
    });
  };

  const isFollowing = (assetId: string) => {
    return followedAssets.has(assetId);
  };

  const toggleFollow = (assetId: string) => {
    if (isFollowing(assetId)) {
      unfollowAsset(assetId);
    } else {
      followAsset(assetId);
    }
  };

  const value: FollowingContextType = {
    followedAssets,
    followAsset,
    unfollowAsset,
    isFollowing,
    toggleFollow,
  };

  return (
    <FollowingContext.Provider value={value}>
      {children}
    </FollowingContext.Provider>
  );
}

export function useFollowing(): FollowingContextType {
  const context = useContext(FollowingContext);
  if (!context) {
    throw new Error('useFollowing must be used within a FollowingProvider');
  }
  return context;
}
