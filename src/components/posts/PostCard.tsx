'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, MessageCircle, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
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
  const { setSelectedHashtag, addToCart } = useAppStore();
  const likeMutation = useLikeMutation();
  const hashtagClick = useHashtagClick();
  const { data: settings } = useSettings();
  
  const handleLike = () => {
    likeMutation.mutate({ postId: post.id });
  };
  
  const handleHashtagClick = async (hashtag: { id: string; name: string }) => {
    await hashtagClick.mutateAsync(hashtag.id);
    setSelectedHashtag(hashtag.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleMessengerClick = (type: 'telegram' | 'max') => {
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
  
  const handleAddToCart = () => {
    addToCart({
      postId: post.id,
      title: post.title || 'Товар',
      imageUrl: post.imageUrl,
      price: post.price,
    });
    toast.success('Добавлено в корзину', {
      description: post.title || 'Товар добавлен в корзину',
    });
  };
  
  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('ru-RU');
  };

  // Check if description is long enough for "Read more"
  const DESCRIPTION_LIMIT = 60;
  const isLongDescription = post.description.length > DESCRIPTION_LIMIT;
  const displayDescription = isExpanded || !isLongDescription 
    ? post.description 
    : post.description.slice(0, DESCRIPTION_LIMIT) + '...';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group overflow-hidden glass-card border-0 hover:shadow-xl transition-all duration-500">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
          <Image
            src={post.imageUrl}
            alt={post.title || post.description.slice(0, 50)}
            fill
            className={`object-cover transition-all duration-700 ${
              imageLoaded ? 'scale-100 blur-0' : 'scale-110 blur-lg'
            } group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 animate-pulse" />
          )}
          
          {/* Price Badge */}
          {post.price > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full glass text-sm font-semibold price-tag"
            >
              {formatPrice(post.price)} ₽
            </motion.div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Content */}
        <div className="p-4 md:p-5">
          {/* Title */}
          {post.title && (
            <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
              {post.title}
            </h3>
          )}
          
          {/* Description */}
          <p className="text-foreground/70 text-sm leading-relaxed">
            {displayDescription}
          </p>
          
          {/* Read More Button */}
          {isLongDescription && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-primary text-sm mt-2 hover:text-primary/80 transition-colors"
            >
              {isExpanded ? (
                <>Свернуть <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>Читать далее <ChevronDown className="h-4 w-4" /></>
              )}
            </button>
          )}
          
          {/* Hashtags */}
          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.hashtags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs rounded-full px-2.5 py-0.5"
                  onClick={() => handleHashtagClick(tag)}
                >
                  #{tag.name}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-primary/10">
            {/* Like Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`gap-1.5 rounded-full px-3 ${
                post.userLiked 
                  ? 'text-primary hover:text-primary' 
                  : 'text-foreground/50 hover:text-primary'
              }`}
            >
              <motion.div
                whileTap={{ scale: 1.3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Heart 
                  className={`h-5 w-5 ${post.userLiked ? 'fill-primary' : ''}`} 
                />
              </motion.div>
              <span className="text-xs font-medium">{post.likes}</span>
            </Button>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {/* Add to Cart */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddToCart}
                  className="rounded-full text-accent hover:bg-accent/10 hover:text-accent"
                  title="Добавить в корзину"
                >
                  <ShoppingBag className="h-4 w-4" />
                </Button>
              </motion.div>
              
              {/* Telegram */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMessengerClick('telegram')}
                  className="rounded-full text-[#0088cc] hover:bg-[#0088cc]/10"
                  title="Написать в Telegram"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </motion.div>
              
              {/* Max */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMessengerClick('max')}
                  className="rounded-full text-[#6B52AE] hover:bg-[#6B52AE]/10"
                  title="Написать в Max"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
