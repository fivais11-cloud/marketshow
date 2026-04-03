'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Phone, Heart, ShoppingBag, Share2, Check, 
  Send, MessageCircle, Truck, Shield, Clock, ChevronDown,
  Minus, Plus, X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSettings, useLikeMutation } from '@/hooks/useApi';
import { useAppStore, Post } from '@/store/useAppStore';
import { toast } from 'sonner';
import { fetchApi } from '@/lib/api';
import { useState } from 'react';

interface Hashtag {
  id: string;
  name: string;
}

interface ProductPost {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  likes: number;
  hashtags: Hashtag[];
}

export function ProductClient() {
  const params = useParams();
  const router = useRouter();
  const { data: settings } = useSettings();
  const { cart, addToCart, updateQuantity, removeFromCart, likedPosts, toggleLike } = useAppStore();
  const likeMutation = useLikeMutation();
  const [quantity, setQuantity] = useState(1);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  const { data: post, isLoading, error } = useQuery<ProductPost>({
    queryKey: ['post', params.id],
    queryFn: () => fetchApi(`/api/posts/${params.id}`),
    enabled: !!params.id,
  });

  const isLiked = post ? likedPosts.includes(post.id) : false;
  const cartItem = post ? cart.find(item => item.postId === post.id) : null;

  const handleLike = () => {
    if (post) {
      likeMutation.mutate({ postId: post.id });
      toggleLike(post.id);
    }
  };

  const handleAddToCart = () => {
    if (post) {
      addToCart({
        postId: post.id,
        title: post.title || 'Товар',
        imageUrl: post.imageUrl,
        price: post.price,
      });
      toast.success('Добавлено в корзину', {
        description: post.title,
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: `Посмотри эту композицию: ${post.title}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Ссылка скопирована');
    }
  };

  const handleMessengerClick = (type: 'telegram' | 'max') => {
    if (!post) return;
    const text = `Здравствуйте! Интересует товар: "${post.title}"`;
    
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

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 bg-[#FAFAF8] dark:bg-[#0f1419]">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-10 w-32 bg-[#264348]/10 dark:bg-white/5 rounded-full mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
              <div className="aspect-square bg-[#264348]/10 dark:bg-white/5 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-[#264348]/10 dark:bg-white/5 rounded w-3/4" />
                <div className="h-10 bg-[#264348]/10 dark:bg-white/5 rounded w-1/3" />
                <div className="h-24 bg-[#264348]/10 dark:bg-white/5 rounded" />
                <div className="h-12 bg-[#264348]/10 dark:bg-white/5 rounded-full w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 bg-[#FAFAF8] dark:bg-[#0f1419] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#264348]/10 dark:bg-white/5 flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-[#264348]/30 dark:text-white/20" />
          </div>
          <h1 className="text-2xl font-bold text-[#264348] dark:text-white mb-2" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
            Товар не найден
          </h1>
          <p className="text-[#264348]/50 dark:text-white/40 mb-6">
            Возможно, товар был удален или ссылка неверна
          </p>
          <Button 
            asChild
            className="bg-[#264348] hover:bg-[#264348]/90 text-white rounded-full px-8"
          >
            <Link href="/">Вернуться на главную</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 pb-8 md:pb-12 bg-[#FAFAF8] dark:bg-[#0f1419]">
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 md:mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-[#264348]/60 dark:text-white/50 hover:text-[#264348] dark:hover:text-white hover:bg-transparent pl-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </motion.div>

        {/* Breadcrumbs - Hidden on mobile */}
        <nav className="hidden md:flex mb-6 text-sm text-[#264348]/40 dark:text-white/30">
          <Link href="/" className="hover:text-[#C9A962] transition-colors">Главная</Link>
          <span className="mx-2">/</span>
          <span className="text-[#264348]/70 dark:text-white/50">{post.title}</span>
        </nav>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div 
              className="aspect-square relative rounded-2xl overflow-hidden bg-white dark:bg-[#1a1f21] shadow-sm cursor-zoom-in"
              onClick={() => setIsImageFullscreen(true)}
            >
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs backdrop-blur-sm">
                Нажмите для увеличения
              </div>
            </div>

            {/* Thumbnail strip for future multiple images */}
            <div className="hidden md:flex gap-2 mt-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[#C9A962]">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Hashtags */}
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.hashtags.map((tag) => (
                  <Link key={tag.id} href={`/?hashtag=${tag.name}`}>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer bg-transparent text-[#6B4E71]/60 dark:text-white/30 hover:text-[#C9A962] hover:bg-[#C9A962]/10 transition-all text-[10px] tracking-wider uppercase border border-[#6B4E71]/20 dark:border-white/10"
                    >
                      #{tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#264348] dark:text-white mb-3 leading-tight"
              style={{ fontFamily: 'Cinzel, Georgia, serif' }}
            >
              {post.title}
            </h1>

            {/* Price */}
            <div 
              className="text-2xl md:text-3xl font-bold text-[#C9A962] mb-4"
              style={{ fontFamily: 'Cinzel, Georgia, serif' }}
            >
              {formatPrice(post.price)} ₽
            </div>

            {/* Description */}
            <p className="text-[#264348]/60 dark:text-white/40 leading-relaxed mb-6 text-sm md:text-base">
              {post.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-[#264348]/40 dark:text-white/30 mb-6">
              <div className="flex items-center gap-1.5">
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-[#D4A5A5] text-[#D4A5A5]' : ''}`} />
                <span>{post.likes + (isLiked ? 1 : 0)} нравится</span>
              </div>
            </div>

            {/* Quantity & Add to Cart - Desktop */}
            <div className="hidden md:flex items-center gap-4 mb-6">
              <div className="flex items-center border border-[#264348]/10 dark:border-white/10 rounded-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions - Desktop */}
            <div className="hidden md:flex flex-wrap gap-3 mb-8">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 min-w-[200px]">
                <Button
                  onClick={handleAddToCart}
                  className={`w-full h-14 rounded-full text-base font-medium transition-all ${
                    cartItem 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-[#264348] hover:bg-[#264348]/90 text-white'
                  }`}
                >
                  {cartItem ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      В корзине ({cartItem.quantity})
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Добавить в корзину
                    </>
                  )}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLike}
                  className="h-14 w-14 rounded-full border-[#264348]/10 dark:border-white/10"
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-[#D4A5A5] text-[#D4A5A5]' : ''}`} />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="h-14 w-14 rounded-full border-[#264348]/10 dark:border-white/10"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            {/* Contact Buttons - Desktop */}
            <div className="hidden md:flex gap-3 mb-8">
              <Button
                variant="outline"
                onClick={() => handleMessengerClick('telegram')}
                className="flex-1 h-12 rounded-full border-[#264348]/10 dark:border-white/10 hover:border-[#C9A962] hover:text-[#C9A962]"
              >
                <Send className="h-4 w-4 mr-2" />
                Telegram
              </Button>
              <Button
                variant="outline"
                onClick={() => handleMessengerClick('max')}
                className="flex-1 h-12 rounded-full border-[#264348]/10 dark:border-white/10 hover:border-[#C9A962] hover:text-[#C9A962]"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Max
              </Button>
            </div>

            {/* Features */}
            <div className="hidden md:grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-xl bg-white dark:bg-[#1a1f21] border border-[#264348]/5 dark:border-white/5">
                <Truck className="h-6 w-6 mx-auto mb-2 text-[#C9A962]" />
                <span className="text-xs text-[#264348]/60 dark:text-white/40">Доставка</span>
              </div>
              <div className="text-center p-4 rounded-xl bg-white dark:bg-[#1a1f21] border border-[#264348]/5 dark:border-white/5">
                <Shield className="h-6 w-6 mx-auto mb-2 text-[#C9A962]" />
                <span className="text-xs text-[#264348]/60 dark:text-white/40">Гарантия</span>
              </div>
              <div className="text-center p-4 rounded-xl bg-white dark:bg-[#1a1f21] border border-[#264348]/5 dark:border-white/5">
                <Clock className="h-6 w-6 mx-auto mb-2 text-[#C9A962]" />
                <span className="text-xs text-[#264348]/60 dark:text-white/40">Вовремя</span>
              </div>
            </div>

            {/* Contact CTA - Desktop */}
            <Card className="hidden md:block bg-white dark:bg-[#1a1f21] border border-[#264348]/5 dark:border-white/5 p-6 mt-auto">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-medium text-[#264348] dark:text-white mb-1">Остались вопросы?</p>
                  <p className="text-sm text-[#264348]/50 dark:text-white/40">Свяжитесь с нами для консультации</p>
                </div>
                <Button
                  asChild
                  className="bg-[#C9A962] hover:bg-[#C9A962]/90 text-white rounded-full"
                >
                  <a href={`tel:${settings?.phone?.replace(/\s/g, '') || '+79858009719'}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Позвонить
                  </a>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1f21] border-t border-[#264348]/5 dark:border-white/5 p-4 z-40">
        <div className="flex items-center gap-3">
          <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
            <Button
              onClick={handleAddToCart}
              className={`w-full h-12 rounded-full font-medium ${
                cartItem 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-[#264348] hover:bg-[#264348]/90 text-white'
              }`}
            >
              {cartItem ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  В корзине
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  В корзину · {formatPrice(post.price)} ₽
                </>
              )}
            </Button>
          </motion.div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleLike}
            className="h-12 w-12 rounded-full border-[#264348]/10 dark:border-white/10 shrink-0"
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-[#D4A5A5] text-[#D4A5A5]' : ''}`} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            className="h-12 w-12 rounded-full border-[#264348]/10 dark:border-white/10 shrink-0"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile messenger buttons */}
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            onClick={() => handleMessengerClick('telegram')}
            className="flex-1 h-10 rounded-full text-xs border-[#264348]/10 dark:border-white/10"
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Telegram
          </Button>
          <Button
            variant="outline"
            onClick={() => handleMessengerClick('max')}
            className="flex-1 h-10 rounded-full text-xs border-[#264348]/10 dark:border-white/10"
          >
            <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
            Max
          </Button>
          <Button
            variant="outline"
            asChild
            className="flex-1 h-10 rounded-full text-xs border-[#264348]/10 dark:border-white/10"
          >
            <a href={`tel:${settings?.phone?.replace(/\s/g, '') || '+79858009719'}`}>
              <Phone className="h-3.5 w-3.5 mr-1.5" />
              Позвонить
            </a>
          </Button>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {isImageFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setIsImageFullscreen(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full h-12 w-12"
              onClick={() => setIsImageFullscreen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full h-full max-w-4xl max-h-[80vh] m-4"
            >
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
