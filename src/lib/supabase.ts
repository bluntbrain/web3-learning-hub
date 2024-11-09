import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Resource = {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
};

export type Comment = {
  id: string;
  resource_id: string;
  content: string;
  created_at: string;
};

export const DEMO_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Ethereum Development Tutorial',
    url: 'https://ethereum.org/developers',
    description: 'Official Ethereum development documentation and tutorials',
    category: 'Fundamentals',
    created_at: new Date().toISOString(),
    upvotes: 42,
    downvotes: 2
  },
  {
    id: '2',
    title: 'Web3.js Documentation',
    url: 'https://web3js.readthedocs.io/',
    description: 'Complete documentation for Web3.js library',
    category: 'Development Tools',
    created_at: new Date().toISOString(),
    upvotes: 35,
    downvotes: 1
  }
];