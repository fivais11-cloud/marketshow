'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Heart, ShoppingBag, Share2, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/hooks/useApi';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import { fetchApi } from '@/lib/api';

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  likes: number;
  hashtags: { hashtag: { id: string; name: string } }[];
}

export function ProductClient() {
  const params = useParams();
  const router = useRouter();
  const { data: settings } = useSettings();
  const { cart, addToCart, likedPosts, toggleLike } = useAppStore();

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ['post', params.id],
    queryFn: () => fetchApi(`/api/posts/${params.id}`),
    enabled: !!params.id,
  });

  const isLiked = post ? likedPosts.includes(post.id) : false;
  const isInCart = post ? cart.some(item => item.postId === post.id) : false;

  const handleAddToCart = () => {
    if (post) {
      addToCart({ postId: post.id, quantity: 1 });
      toast.success('Добавлено в корзину');
    }
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      await navigator.share({
        title: post.title,
        text: `Посмотри эту композицию: ${post.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Ссылка скопирована');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-primary/10 rounded mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-primary/10 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-primary/10 rounded w-3/4" />
                <div className="h-6 bg-primary/10 rounded w-1/4" />
                <div className="h-20 bg-primary/10 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
          <Button asChild>
            <Link href="/">Вернуться на главную</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('ru-RU') + ' ₽';
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-foreground/70 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </motion.div>

        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-foreground/50">
          <Link href="/" className="hover:text-primary">Главная</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{post.title}</span>
        </nav>

        {/* Product Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card border-0 overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Hashtags */}
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.hashtags.map((h) => (
                  <Link key={h.hashtag.id} href={`/?hashtag=${h.hashtag.name}`}>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                    >
                      #{h.hashtag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

            {/* Price */}
            <div className="text-3xl font-bold text-primary mb-6">
              {formatPrice(post.price)}
            </div>

            {/* Description */}
            <p className="text-foreground/70 leading-relaxed mb-8">
              {post.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-foreground/50 mb-8">
              <div className="flex items-center gap-1">
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{post.likes + (isLiked ? 1 : 0)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-auto">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={handleAddToCart}
                  className={`w-full btn-premium rounded-xl py-6 ${isInCart ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  {isInCart ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      В корзине
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Заказать
                    </>
                  )}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleLike(post.id)}
                  className="h-14 w-14 rounded-xl"
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="h-14 w-14 rounded-xl"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            {/* Contact CTA */}
            <Card className="glass-card border-0 p-6 mt-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-medium mb-1">Остались вопросы?</p>
                  <p className="text-sm text-foreground/60">Свяжитесь с нами для консультации</p>
                </div>
                <Button
                  asChild
                  className="btn-premium rounded-full"
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
    </div>
  );
}
