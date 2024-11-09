import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, ExternalLink } from 'lucide-react';
import { Resource } from '../lib/supabase';
import Dialog from './Dialog';
import ResourceDetails from './ResourceDetails';

interface ResourceCardProps {
  resource: Resource;
  onVoteSuccess?: () => void;
}

export default function ResourceCard({ resource, onVoteSuccess }: ResourceCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div 
        className="glass-card rounded-xl overflow-hidden hover-card"
        onClick={() => setShowDetails(true)}
      >
        <div className="p-4">
          <div className="flex justify-between items-start gap-3 mb-3">
            <h3 className="text-lg font-medium line-clamp-1">
              {resource.title}
            </h3>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 p-2 hover:bg-yale/20 rounded-lg transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={18} className="text-yale" />
            </a>
          </div>

          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {resource.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs px-3 py-1 rounded-full glass-card border-yale/30 text-gray-300">
              {resource.category}
            </span>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-400">
                <ThumbsUp size={14} />
                <span>{resource.upvotes}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <MessageCircle size={14} />
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={resource.title}
      >
        <ResourceDetails 
          resource={resource} 
          onVoteSuccess={onVoteSuccess}
        />
      </Dialog>
    </>
  );
}