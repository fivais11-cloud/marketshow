'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PostCard } from './PostCard';
import { useAppStore } from '@/store/useAppStore';
import { usePosts } from '@/hooks/useApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Loader2, Sparkles } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
            <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-foreground/50">Загружаем товары...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Active Filters */}
      {(selectedHashtag || searchQuery) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-3 flex-wrap"
        >
          <span className="text-sm text-foreground/50">Фильтры:</span>
          {selectedHashtag && (
            <Badge className="bg-primary text-primary-foreground gap-1 px-3 py-1 rounded-full">
              #{selectedHashtag}
              <button onClick={() => setSelectedHashtag(null)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge className="bg-accent text-accent-foreground gap-1 px-3 py-1 rounded-full">
              {searchQuery}
              <button onClick={() => setSearchQuery('')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-foreground/50 hover:text-foreground"
          >
            Сбросить все
          </Button>
        </motion.div>
      )}
      
      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-4xl">🎈</span>
          </div>
          <h3 className="text-xl font-medium text-foreground mb-2">
            Ничего не найдено
          </h3>
          <p className="text-foreground/50 mb-6 max-w-md mx-auto">
            Попробуйте изменить параметры поиска или выбрать другой хэштег
          </p>
          <Button
            onClick={clearFilters}
            className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Сбросить фильтры
          </Button>
        </motion.div>
      )}
    </div>
  );
}
