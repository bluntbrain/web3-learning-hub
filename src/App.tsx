import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BookOpen, Search, Plus, RefreshCw, Home, Filter } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useResourceStore } from './lib/store';
import ResourceCard from './components/ResourceCard';
import ResourceForm from './components/ResourceForm';
import CategoryFilter from './components/CategoryFilter';
import Dialog from './components/Dialog';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const { resources, setResources, shouldRefetch } = useResourceStore();

  useEffect(() => {
    if (shouldRefetch()) {
      loadResources();
    }
  }, []);

  const loadResources = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      let query = supabase.from('resources').select('*').order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      setResources(data || []);
    } catch (error) {
      console.error('Error loading resources:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter((resource) => !selectedCategory || resource.category === selectedCategory);

  return (
    <div className="min-h-screen pb-20">
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'glass-card border-yale/30',
          style: {
            background: 'rgba(0, 29, 61, 0.9)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      
      <header className="sticky top-0 z-40 bg-rich/80 backdrop-blur-xl border-b border-yale/20">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <BookOpen size={24} className="gradient-text shrink-0" />
              <h1 className="text-lg font-bold gradient-text truncate">
                Web3 Learning Hub
              </h1>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-yale/50 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="btn btn-secondary p-2.5"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {selectedCategory && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-400">Filtered by:</span>
            <button
              onClick={() => setSelectedCategory('')}
              className="btn btn-secondary py-1 px-3 text-sm flex items-center gap-2"
            >
              {selectedCategory}
              <span className="text-gray-400">×</span>
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 rounded-full border-3 border-yale/20 border-t-yale animate-spin" />
          </div>
        ) : isError ? (
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-red-400">Unable to load resources. Please try again.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onVoteSuccess={loadResources}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="glass-card rounded-xl p-6 inline-block">
              <p className="text-gray-400">No resources found. Be the first to add one!</p>
            </div>
          </div>
        )}
      </main>

      <nav className="mobile-menu flex items-center justify-around">
        <button
          onClick={() => setSelectedCategory('')}
          className="p-2 text-gray-400 hover:text-white flex flex-col items-center gap-1"
        >
          <Home size={20} />
          <span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => setShowFilters(true)}
          className="p-2 text-gray-400 hover:text-white flex flex-col items-center gap-1"
        >
          <Filter size={20} />
          <span className="text-xs">Filter</span>
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="p-2 text-gray-400 hover:text-white flex flex-col items-center gap-1"
        >
          <Plus size={20} />
          <span className="text-xs">Add</span>
        </button>
        <button
          onClick={loadResources}
          className="p-2 text-gray-400 hover:text-white flex flex-col items-center gap-1"
          disabled={isLoading}
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          <span className="text-xs">Refresh</span>
        </button>
      </nav>

      <Dialog
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Submit a Resource"
      >
        <ResourceForm
          onSuccess={() => {
            loadResources();
            setShowForm(false);
          }}
        />
      </Dialog>

      <Dialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Resources"
      >
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            setShowFilters(false);
          }}
        />
      </Dialog>
    </div>
  );
}

export default App;