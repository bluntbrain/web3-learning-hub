import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Resource } from './supabase';

interface ResourceStore {
  resources: Resource[];
  lastFetched: number | null;
  setResources: (resources: Resource[]) => void;
  updateResource: (updatedResource: Resource) => void;
  shouldRefetch: () => boolean;
}

// 2 days in milliseconds
const REFETCH_THRESHOLD = 2 * 24 * 60 * 60 * 1000;

export const useResourceStore = create<ResourceStore>()(
  persist(
    (set, get) => ({
      resources: [],
      lastFetched: null,
      setResources: (resources) => set({ resources, lastFetched: Date.now() }),
      updateResource: (updatedResource) => set((state) => ({
        resources: state.resources.map((resource) =>
          resource.id === updatedResource.id ? updatedResource : resource
        ),
      })),
      shouldRefetch: () => {
        const { lastFetched } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > REFETCH_THRESHOLD;
      },
    }),
    {
      name: 'resource-store',
    }
  )
);