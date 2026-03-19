'use client';

import { motion } from 'framer-motion';
import { PostsGrid } from '@/components/posts/PostsGrid';
import { useSettings, useHashtags, useHashtagClick } from '@/hooks/useApi';
import { useAppStore } from '@/store/useAppStore';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Phone, Clock, MapPin, Truck, Sparkles, PartyPopper, Heart, Camera, Gift, Crown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { data: settings } = useSettings();
  const { data: hashtags } = useHashtags();
  const { selectedHashtag, setSelectedHashtag } = useAppStore();
  const hashtagClick = useHashtagClick();
  
  const handleHashtagClick = async (tag: { id: string; name: string }) => {
    await hashtagClick.mutateAsync(tag.id);
    setSelectedHashtag(tag.name);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Categories in Instagram Stories style
  const categories = [
    { 
      id: 'all',
      name: 'Все', 
      gradient: 'from-primary via-accent to-primary',
      icon: Sparkles,
      filter: null 
    },
    { 
      id: 'свадьба',
      name: 'Свадьба', 
      gradient: 'from-pink-400 via-rose-300 to-pink-400',
      icon: Heart,
      filter: 'свадьба' 
    },
    { 
      id: 'детскийпраздник',
      name: 'Детские', 
      gradient: 'from-blue-400 via-cyan-300 to-blue-400',
      icon: Gift,
      filter: 'детскийпраздник' 
    },
    { 
      id: 'фотозона',
      name: 'Фотозоны', 
      gradient: 'from-purple-400 via-violet-300 to-purple-400',
      icon: Camera,
      filter: 'фотозона' 
    },
    { 
      id: 'корпоратив',
      name: 'Корпоратив', 
      gradient: 'from-amber-400 via-yellow-300 to-amber-400',
      icon: Crown,
      filter: 'корпоратив' 
    },
  ];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Floating Balloons - decorative */}
        <div className="absolute top-32 left-[5%] w-8 h-8 rounded-full bg-primary/20 blur-sm animate-float hidden lg:block" />
        <div className="absolute top-48 right-[10%] w-6 h-6 rounded-full bg-accent/20 blur-sm animate-float-slow hidden lg:block" />
        <div className="absolute bottom-32 left-[15%] w-5 h-5 rounded-full bg-primary/15 blur-sm animate-float hidden lg:block" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Премиум оформление праздников</span>
            </motion.div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Маркет Шоу</span>
              <br />
              <span className="text-foreground/80">воздушные шары</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/60 mb-8 max-w-2xl mx-auto leading-relaxed">
              Создаём незабываемые праздники с премиум оформлением. 
              Доставка по Москве с заботой о каждом клиенте.
            </p>
            
            {/* Quick Info */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm mb-10">
              <div className="flex items-center gap-2 text-foreground/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <span>Бесплатно от 3000₽</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span>{settings?.workingHours || 'Пн-Вс: 9:00 - 21:00'}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span>Москва</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                >
                  <a href={`tel:${settings?.phone?.replace(/\s/g, '') || '+79858009719'}`}>
                    <Phone className="h-5 w-5 mr-2" />
                    {settings?.phone || '+7 985 800 97 19'}
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-primary/20 hover:bg-primary/5"
                >
                  <Link href="/delivery">Условия доставки</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Categories - Instagram Stories Style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12"
          >
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-2 justify-center flex-wrap md:flex-nowrap">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  const isActive = selectedHashtag === category.filter || (!selectedHashtag && category.filter === null);
                  
                  return (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (category.filter) {
                          const tag = hashtags?.find(t => t.name === category.filter);
                          if (tag) handleHashtagClick(tag);
                        } else {
                          setSelectedHashtag(null);
                        }
                      }}
                      className="flex flex-col items-center gap-2 flex-shrink-0 group"
                    >
                      {/* Story Circle with Gradient Border */}
                      <div className={`relative p-[3px] rounded-full transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-br ' + category.gradient + ' shadow-lg ring-2 ring-primary/30' 
                          : 'bg-gradient-to-br ' + category.gradient + ' opacity-60 hover:opacity-100'
                      }`}>
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-background flex items-center justify-center overflow-hidden">
                          <Icon className={`w-7 h-7 md:w-8 md:h-8 transition-all duration-300 ${
                            isActive 
                              ? 'text-primary' 
                              : 'text-foreground/60 group-hover:text-foreground'
                          }`} />
                        </div>
                      </div>
                      {/* Category Name */}
                      <span className={`text-xs md:text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? 'text-primary' 
                          : 'text-foreground/60 group-hover:text-foreground'
                      }`}>
                        {category.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </motion.div>
        </div>
      </section>
      
      {/* Posts Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <PostsGrid />
        </div>
      </section>
      
      {/* Bottom CTA */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <PartyPopper className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Не нашли то, что искали?
            </h2>
            <p className="text-foreground/60 mb-8 max-w-xl mx-auto">
              Мы создадим уникальную композицию специально для вас! 
              Свяжитесь с нами, и наши дизайнеры воплотят любую идею.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
              >
                <Link href="/contacts">Связаться с нами</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-8 border-primary/20 hover:bg-primary/5"
              >
                <Link href="/about">О компании</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Маркет Шоу',
            description: 'Доставка воздушных шаров премиум-класса по Москве. Фотозоны, гирлянды, композиции из шаров.',
            telephone: settings?.phone || '+79858009719',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Москва',
              addressCountry: 'RU',
            },
            openingHours: 'Mo-Su 09:00-21:00',
            priceRange: '$$',
            url: 'https://marketshow.ru',
            sameAs: [
              settings?.telegram,
              settings?.max,
            ].filter(Boolean),
          }),
        }}
      />
    </div>
  );
}
