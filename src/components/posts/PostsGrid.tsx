'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PostCard } from './PostCard';
import { useAppStore } from '@/store/useAppStore';
import { usePosts } from '@/hooks/useApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';

export function PostsGrid() {
  const { posts, searchQuery, selectedHashtag, setSelectedHashtag, setSearchQuery } = useAppStore();
  const { isLoading, refetch } = usePosts(searchQuery || undefined, selectedHashtag || undefined);
  
  useEffect(() => {
    refetch();
  }, [searchQuery, selectedHashtag, refetch]);
  
  const clearFilters = () => {
    setSelectedHashtag(null);
    setSearchQuery('');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          {/* Enso loader */}
          <div className="relative w-16 h-16 mx-auto mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#C9A962"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="220 260"
                transform="rotate(-45 50 50)"
              />
            </svg>
          </div>
          <p className="text-[#264348]/40 dark:text-white/40 text-sm">Загружаем товары...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Active Filters - Minimal */}
      {(selectedHashtag || searchQuery) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center gap-3 flex-wrap"
        >
          <span className="text-xs text-[#264348]/40 dark:text-white/30 uppercase tracking-wider">Фильтр:</span>
          {selectedHashtag && (
            <Badge 
              className="bg-[#264348] text-white gap-1.5 px-3 py-1 rounded-full text-xs font-normal"
            >
              #{selectedHashtag}
              <button 
                onClick={() => setSelectedHashtag(null)}
                className="hover:text-[#C9A962] transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge 
              className="bg-[#6B4E71] text-white gap-1.5 px-3 py-1 rounded-full text-xs font-normal"
            >
              {searchQuery}
              <button 
                onClick={() => setSearchQuery('')}
                className="hover:text-[#C9A962] transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-[#264348]/40 dark:text-white/30 hover:text-[#264348] dark:hover:text-white h-7 px-2"
          >
            Сбросить
          </Button>
        </motion.div>
      )}
      
      {/* Posts Grid - More spacing (Ma principle) */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 mx-auto mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#264348"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="220 260"
                transform="rotate(-45 50 50)"
                className="dark:stroke-white"
              />
            </svg>
          </div>
          <h3 
            className="text-xl font-medium text-[#264348] dark:text-white mb-2"
            style={{ fontFamily: 'Cinzel, Georgia, serif' }}
          >
            Ничего не найдено
          </h3>
          <p className="text-[#264348]/40 dark:text-white/30 mb-8 max-w-md mx-auto text-sm">
            Попробуйте изменить параметры поиска
          </p>
          <Button
            onClick={clearFilters}
            className="bg-[#C9A962] hover:bg-[#C9A962]/90 text-white rounded-full px-6"
          >
            Сбросить фильтры
          </Button>
        </motion.div>
      )}
    </div>
  );
}
