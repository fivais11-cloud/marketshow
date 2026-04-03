'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, MessageCircle, ShoppingBag, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Post, useAppStore } from '@/store/useAppStore';
import { useLikeMutation, useHashtagClick, useSettings } from '@/hooks/useApi';
import { toast } from 'sonner';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { setSelectedHashtag, addToCart, triggerCartAnimation } = useAppStore();
  const likeMutation = useLikeMutation();
  const hashtagClick = useHashtagClick();
  const { data: settings } = useSettings();
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    likeMutation.mutate({ postId: post.id });
  };
  
  const handleHashtagClick = (e: React.MouseEvent, hashtag: { id: string; name: string }) => {
    e.preventDefault();
    e.stopPropagation();
    hashtagClick.mutateAsync(hashtag.id);
    setSelectedHashtag(hashtag.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleMessengerClick = (e: React.MouseEvent, type: 'telegram' | 'max') => {
    e.preventDefault();
    e.stopPropagation();
    const shortTitle = post.title || post.description.slice(0, 30);
    const text = `Здравствуйте! Интересует товар: "${shortTitle}"`;
    
    if (type === 'telegram') {
      const url = settings?.telegram 
        ? `${settings.telegram}?text=${encodeURIComponent(text)}`
        : `https://t.me/TanyaShow?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    } else {
      const url = settings?.max 
        ? `${settings.max}?text=${encodeURIComponent(text)}`
        : `https://max.ru/chat/marketshow?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      postId: post.id,
      title: post.title || 'Товар',
      imageUrl: post.imageUrl,
      price: post.price,
    });
    
    // Trigger header cart animation
    triggerCartAnimation();
    
    // Show check mark animation
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
    
    toast.success('Добавлено в корзину', {
      description: post.title || 'Товар добавлен в корзину',
    });
  };
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU');
  };

  // Check if description is long enough for "Read more"
  const DESCRIPTION_LIMIT = 80;
  const isLongDescription = post.description.length > DESCRIPTION_LIMIT;
  const displayDescription = isExpanded || !isLongDescription 
    ? post.description 
    : post.description.slice(0, DESCRIPTION_LIMIT) + '...';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Link href={`/product/${post.id}`} className="block h-full">
        <Card className="group overflow-hidden h-full bg-white dark:bg-[#1a1f21] border-0 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl">
          {/* Image Container - More space */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#FAFAF8] dark:bg-[#1a1f21]">
            <Image
              src={post.imageUrl}
              alt={post.title || post.description.slice(0, 50)}
              fill
              className={`object-cover transition-all duration-700 ${
                imageLoaded ? 'scale-100 blur-0 opacity-100' : 'scale-105 blur-md opacity-0'
              } group-hover:scale-[1.02]`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-[#FAFAF8] dark:bg-[#1a1f21] animate-pulse" />
            )}
            
            {/* Price Badge - Minimal gold */}
            {post.price > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#1a1f21]/95 backdrop-blur-sm text-sm font-medium text-[#C9A962] shadow-sm"
                style={{ fontFamily: 'Cinzel, Georgia, serif' }}
              >
                {formatPrice(post.price)} ₽
              </motion.div>
            )}
          </div>
          
          {/* Content - Generous padding */}
          <div className="p-5 md:p-6">
            {/* Title - Serif */}
            {post.title && (
              <h3 
                className="font-medium text-[#264348] dark:text-white mb-2 line-clamp-2 text-lg"
                style={{ fontFamily: 'Cinzel, Georgia, serif' }}
              >
                {post.title}
              </h3>
            )}
            
            {/* Description */}
            <p className="text-[#264348]/50 dark:text-white/40 text-sm leading-relaxed mb-3">
              {displayDescription}
            </p>
            
            {/* Read More */}
            {isLongDescription && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="flex items-center gap-1 text-[#C9A962] text-xs mt-1 hover:text-[#C9A962]/80 transition-colors"
              >
                {isExpanded ? (
                  <>Свернуть <ChevronUp className="h-3 w-3" /></>
                ) : (
                  <>Читать далее <ChevronDown className="h-3 w-3" /></>
                )}
              </button>
            )}
            
            {/* Hashtags - Minimal */}
            {post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {post.hashtags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    onClick={(e) => handleHashtagClick(e, tag)}
                    className="text-[10px] tracking-wide text-[#6B4E71]/60 dark:text-white/30 hover:text-[#C9A962] dark:hover:text-[#C9A962] transition-colors cursor-pointer uppercase"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
            
            {/* Actions - Clean */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#264348]/5 dark:border-white/5">
              {/* Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 transition-colors ${
                  post.userLiked 
                    ? 'text-[#D4A5A5]' 
                    : 'text-[#264348]/30 dark:text-white/30 hover:text-[#D4A5A5]'
                }`}
              >
                <motion.div
                  whileTap={{ scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Heart 
                    className={`h-4 w-4 ${post.userLiked ? 'fill-current' : ''}`} 
                  />
                </motion.div>
                <span className="text-xs font-medium">{post.likes || 0}</span>
              </button>
              
              {/* Action Icons */}
              <div className="flex items-center gap-0.5">
                {/* Cart Button with Animation */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddToCart}
                  className="h-8 w-8 p-0 hover:bg-transparent"
                >
                  <div className="relative w-4 h-4">
                    <AnimatePresence mode="wait">
                      {justAdded ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check className="h-4 w-4 text-[#C9A962]" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="cart"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <ShoppingBag className="h-4 w-4 text-[#264348]/40 dark:text-white/40 group-hover:text-[#C9A962] transition-colors" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleMessengerClick(e, 'telegram')}
                  className="h-8 w-8 p-0 text-[#264348]/40 dark:text-white/40 hover:text-[#C9A962] hover:bg-transparent"
                >
                  <Send className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleMessengerClick(e, 'max')}
                  className="h-8 w-8 p-0 text-[#264348]/40 dark:text-white/40 hover:text-[#C9A962] hover:bg-transparent"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
