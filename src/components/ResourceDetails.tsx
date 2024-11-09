import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, ExternalLink, Send } from 'lucide-react';
import { Resource, Comment, supabase } from '../lib/supabase';
import { useResourceStore } from '../lib/store';
import toast from 'react-hot-toast';

interface ResourceDetailsProps {
  resource: Resource;
}

export default function ResourceDetails({ resource }: ResourceDetailsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [localVotes, setLocalVotes] = useState({
    upvotes: resource.upvotes,
    downvotes: resource.downvotes,
  });
  const updateResource = useResourceStore((state) => state.updateResource);

  useEffect(() => {
    loadComments();
  }, [resource.id]);

  useEffect(() => {
    setLocalVotes({
      upvotes: resource.upvotes,
      downvotes: resource.downvotes,
    });
  }, [resource]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('resource_id', resource.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleVote = async (type: 'up' | 'down') => {
    try {
      // Optimistic update
      const newVotes = {
        ...localVotes,
        [type === 'up' ? 'upvotes' : 'downvotes']: type === 'up' ? localVotes.upvotes + 1 : localVotes.downvotes + 1,
      };
      setLocalVotes(newVotes);

      const { data, error } = await supabase
        .from('resources')
        .update({
          [type === 'up' ? 'upvotes' : 'downvotes']: type === 'up' ? localVotes.upvotes + 1 : localVotes.downvotes + 1,
        })
        .eq('id', resource.id)
        .select()
        .single();

      if (error) throw error;

      // Update the store with the new resource data
      updateResource(data);
      toast.success(`Successfully ${type === 'up' ? 'upvoted' : 'downvoted'}`);
    } catch (error) {
      // Revert optimistic update on error
      setLocalVotes({
        upvotes: resource.upvotes,
        downvotes: resource.downvotes,
      });
      toast.error('Failed to vote');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ resource_id: resource.id, content: newComment }])
        .select();

      if (error) throw error;

      setComments(prev => [data[0], ...prev]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-gray-300">{resource.description}</p>
        
        <div className="flex items-center justify-between">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ExternalLink size={18} />
            <span>Visit Resource</span>
          </a>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleVote('up')}
              className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-all hover:bg-green-500/10 rounded-lg px-3 py-2"
            >
              <ThumbsUp size={18} />
              <span>{localVotes.upvotes}</span>
            </button>
            <button
              onClick={() => handleVote('down')}
              className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-all hover:bg-red-500/10 rounded-lg px-3 py-2"
            >
              <ThumbsDown size={18} />
              <span>{localVotes.downvotes}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800/50 pt-6">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        
        <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 glass-input rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all"
          />
          <button
            type="submit"
            className="gradient-border px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600/10 to-indigo-600/10 hover:from-purple-600/20 hover:to-indigo-600/20 transition-all duration-300"
          >
            <Send size={18} />
          </button>
        </form>

        {isLoadingComments ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="glass-card rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-2">{comment.content}</p>
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}