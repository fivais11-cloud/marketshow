'use client';

import { motion } from 'framer-motion';
import { PostsGrid } from '@/components/posts/PostsGrid';
import { useSettings, useHashtags, useHashtagClick } from '@/hooks/useApi';
import { useAppStore } from '@/store/useAppStore';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Phone, Clock, MapPin, Truck, Sparkles, Heart, Camera, Gift, Crown } from 'lucide-react';
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

  // Categories - refined
  const categories = [
    { 
      id: 'all',
      name: 'Все', 
      icon: Sparkles,
      filter: null 
    },
    { 
      id: 'свадьба',
      name: 'Свадьба', 
      icon: Heart,
      filter: 'свадьба' 
    },
    { 
      id: 'детскийпраздник',
      name: 'Детские', 
      icon: Gift,
      filter: 'детскийпраздник' 
    },
    { 
      id: 'фотозона',
      name: 'Фотозоны', 
      icon: Camera,
      filter: 'фотозона' 
    },
    { 
      id: 'корпоратив',
      name: 'Корпоратив', 
      icon: Crown,
      filter: 'корпоратив' 
    },
  ];
  
  return (
    <div className="min-h-screen pattern-seigaiha">
      {/* Hero Section - Japanese Minimalism */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-36 md:pb-32">
        {/* Subtle background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#264348]/[0.02] to-transparent" />
        
        {/* Enso Circle - Large decorative element */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#264348"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="450 565"
              transform="rotate(-45 100 100)"
            />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Small Enso Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-8"
            >
              <div className="w-16 h-16 md:w-20 md:h-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
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
            </motion.div>
            
            {/* Title - Elegant Serif */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-wide mb-4 text-[#264348] dark:text-white"
              style={{ fontFamily: 'Cinzel, Georgia, serif' }}
            >
              Маркет Шоу
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm md:text-base tracking-[0.3em] uppercase text-[#C9A962] mb-8"
            >
              Premium Balloon Art
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-[#264348]/60 dark:text-white/50 mb-10 max-w-xl mx-auto leading-relaxed"
            >
              Создаём незабываемые моменты с премиум оформлением.
              Доставка по Москве с заботой о каждом празднике.
            </motion.p>
            
            {/* Quick Info - Minimal */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm mb-10"
            >
              <div className="flex items-center gap-2 text-[#264348]/50 dark:text-white/40">
                <Truck className="h-4 w-4" />
                <span>Доставка бесплатно от 3000₽</span>
              </div>
              <div className="flex items-center gap-2 text-[#264348]/50 dark:text-white/40">
                <MapPin className="h-4 w-4" />
                <span>Москва</span>
              </div>
            </motion.div>
            
            {/* CTA - Single prominent button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href={`tel:${settings?.phone?.replace(/\s/g, '') || '+79858009719'}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C9A962] hover:bg-[#C9A962]/90 text-white text-sm font-medium rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-[#C9A962]/20"
                >
                  <Phone className="h-4 w-4" />
                  Заказать
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/delivery"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-[#264348]/70 dark:text-white/60 text-sm font-medium rounded-full border border-[#264348]/10 dark:border-white/10 hover:border-[#C9A962] hover:text-[#C9A962] transition-all duration-300"
                >
                  Условия доставки
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Categories - Minimal pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-16"
          >
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2 justify-center flex-wrap">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  const isActive = selectedHashtag === category.filter || (!selectedHashtag && category.filter === null);
                  
                  return (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (category.filter) {
                          const tag = hashtags?.find(t => t.name === category.filter);
                          if (tag) handleHashtagClick(tag);
                        } else {
                          setSelectedHashtag(null);
                        }
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#264348] text-white shadow-lg shadow-[#264348]/10' 
                          : 'bg-white/60 dark:bg-white/5 text-[#264348]/70 dark:text-white/60 hover:bg-[#264348]/5 dark:hover:bg-white/10 border border-[#264348]/5 dark:border-white/5'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {category.name}
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
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <PostsGrid />
        </div>
      </section>
      
      {/* Bottom CTA - Minimal */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto"
          >
            <h2 
              className="text-2xl md:text-3xl font-medium text-[#264348] dark:text-white mb-4"
              style={{ fontFamily: 'Cinzel, Georgia, serif' }}
            >
              Не нашли то, что искали?
            </h2>
            <p className="text-[#264348]/50 dark:text-white/40 mb-8">
              Создадим уникальную композицию специально для вас.
              Свяжитесь с нами, и наши дизайнеры воплотят любую идею.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contacts"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A962] hover:bg-[#C9A962]/90 text-white text-sm font-medium rounded-full transition-all duration-300"
              >
                Связаться с нами
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 text-[#264348]/70 dark:text-white/60 text-sm font-medium rounded-full border border-[#264348]/10 dark:border-white/10 hover:border-[#C9A962] hover:text-[#C9A962] transition-all duration-300"
              >
                О компании
              </Link>
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
