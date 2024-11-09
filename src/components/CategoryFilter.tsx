import React from 'react';

const categories = [
  'All',
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

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="grid grid-cols-2 gap-2 p-1">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category === 'All' ? '' : category)}
          className={`
            p-3 rounded-xl text-sm transition-all duration-300
            ${(category === 'All' && !selectedCategory) || category === selectedCategory
              ? 'btn-primary'
              : 'btn-secondary'}
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
}