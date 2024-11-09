import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

const categories = [
  'Fundamentals',
  'Smart Contracts',
  'DeFi',
  'NFTs',
  'DAOs',
  'Security',
  'Development Tools',
  'Tutorials',
  'Documentation',
];

interface ResourceFormProps {
  onSuccess?: () => void;
}

export default function ResourceForm({ onSuccess }: ResourceFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('resources')
        .insert([
          {
            ...formData,
            upvotes: 0,
            downvotes: 0,
          },
        ]);

      if (error) throw error;

      setFormData({
        title: '',
        url: '',
        description: '',
        category: '',
      });

      toast.success('Resource added successfully!');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to add resource');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full glass-input rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
          placeholder="Enter resource title"
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
          URL
        </label>
        <input
          type="url"
          id="url"
          required
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          className="w-full glass-input rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          required
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full glass-input rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all resize-none"
          rows={3}
          placeholder="Describe the resource..."
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
          Category
        </label>
        <select
          id="category"
          required
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full glass-input rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full gradient-border px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600/10 to-indigo-600/10 hover:from-purple-600/20 hover:to-indigo-600/20 transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <Send size={18} />
        <span>Submit Resource</span>
      </button>
    </form>
  );
}