'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, X, Phone, Send, MessageCircle, ShoppingBag, Moon, Sun, Home, Info, Truck, Mail, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAppStore } from '@/store/useAppStore';
import { useSettings } from '@/hooks/useApi';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    searchQuery, 
    setSearchQuery, 
    isSearchOpen, 
    setIsSearchOpen, 
    cart,
    theme,
    toggleTheme
  } = useAppStore();
  
  const { data: settings } = useSettings();
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
  };

  const handlePhoneClick = () => {
    if (settings?.phone) {
      window.location.href = `tel:${settings.phone.replace(/\s/g, '')}`;
    }
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1a1f21]/80 backdrop-blur-xl border-b border-[#264348]/5 dark:border-white/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo - Japanese minimalist style */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3"
            >
              {/* Enso-inspired logo mark */}
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-[#264348] dark:text-[#C9A962]"
                    strokeDasharray="220 260"
                    transform="rotate(-45 50 50)"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-medium tracking-wide text-[#264348] dark:text-white" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
                  Маркет Шоу
                </span>
                <span className="text-[10px] md:text-xs text-[#6B4E71] dark:text-[#C9A962]/70 tracking-[0.2em] uppercase hidden sm:block">
                  Premium Balloons
                </span>
              </div>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation - Minimal */}
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { href: '/', label: 'Главная' },
              { href: '/about', label: 'О нас' },
              { href: '/delivery', label: 'Доставка' },
              { href: '/faq', label: 'FAQ' },
              { href: '/contacts', label: 'Контакты' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm text-[#264348]/70 dark:text-white/60 hover:text-[#264348] dark:hover:text-white transition-colors duration-300 group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A962] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>
          
          {/* Actions - Refined */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9 md:w-10 md:h-10 text-[#264348]/60 dark:text-white/50 hover:text-[#264348] dark:hover:text-white hover:bg-[#264348]/5 dark:hover:bg-white/5 rounded-full"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
            </Button>
            
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-9 h-9 md:w-10 md:h-10 text-[#264348]/60 dark:text-white/50 hover:text-[#264348] dark:hover:text-white hover:bg-[#264348]/5 dark:hover:bg-white/5 rounded-full"
            >
              {isSearchOpen ? <X className="h-4 w-4 md:h-5 md:w-5" /> : <Search className="h-4 w-4 md:h-5 md:w-5" />}
            </Button>
            
            {/* Cart - Gold accent */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => useAppStore.getState().setIsCartOpen(true)}
                className="relative w-9 h-9 md:w-10 md:h-10 text-[#264348]/60 dark:text-white/50 hover:text-[#C9A962] dark:hover:text-[#C9A962] hover:bg-[#C9A962]/5 rounded-full"
              >
                <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 bg-[#C9A962] text-white text-[10px] md:text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
            </motion.div>
            
            {/* CTA Button - Gold accent */}
            <div className="hidden md:block ml-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href={`tel:${settings?.phone?.replace(/\s/g, '') || '+79858009719'}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9A962] hover:bg-[#C9A962]/90 text-white text-sm font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A962]/20"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden xl:inline">Заказать</span>
                </a>
              </motion.div>
            </div>
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden w-9 h-9 md:w-10 md:h-10 text-[#264348] dark:text-white hover:bg-[#264348]/5 dark:hover:bg-white/5 rounded-full"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-white dark:bg-[#1a1f21] border-l border-[#264348]/5 dark:border-white/5">
                <SheetHeader>
                  <SheetTitle className="text-left text-[#264348] dark:text-white text-lg" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
                    Маркет Шоу
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 flex flex-col gap-6">
                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-1">
                    {[
                      { href: '/', label: 'Главная', icon: Home },
                      { href: '/about', label: 'О нас', icon: Info },
                      { href: '/delivery', label: 'Доставка', icon: Truck },
                      { href: '/faq', label: 'FAQ', icon: HelpCircle },
                      { href: '/contacts', label: 'Контакты', icon: Mail },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#264348]/70 dark:text-white/60 hover:text-[#264348] dark:hover:text-white hover:bg-[#264348]/5 dark:hover:bg-white/5 transition-all duration-200 text-sm"
                      >
                        <item.icon className="h-4 w-4 text-[#C9A962]" />
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  
                  {/* Divider */}
                  <div className="h-px bg-[#264348]/5 dark:bg-white/5" />
                  
                  {/* Contact Section */}
                  <div className="space-y-4">
                    <p className="text-xs text-[#6B4E71]/60 dark:text-white/40 text-center uppercase tracking-wider">Свяжитесь с нами</p>
                    
                    {/* Contact Icons */}
                    <div className="flex justify-center gap-3">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={handlePhoneClick}
                          size="icon"
                          className="w-12 h-12 rounded-full bg-[#C9A962] hover:bg-[#C9A962]/90 text-white shadow-lg shadow-[#C9A962]/20"
                        >
                          <Phone className="h-5 w-5" />
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          asChild
                          size="icon"
                          variant="outline"
                          className="w-12 h-12 rounded-full border-[#264348]/20 hover:bg-[#264348] hover:text-white text-[#264348] dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-[#264348]"
                        >
                          <a href={settings?.telegram || 'https://t.me/TanyaShow'} target="_blank" rel="noopener noreferrer">
                            <Send className="h-5 w-5" />
                          </a>
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          asChild
                          size="icon"
                          variant="outline"
                          className="w-12 h-12 rounded-full border-[#264348]/20 hover:bg-[#264348] hover:text-white text-[#264348] dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-[#264348]"
                        >
                          <a href={settings?.max || 'https://max.ru/chat/marketshow'} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-5 w-5" />
                          </a>
                        </Button>
                      </motion.div>
                    </div>
                    
                    {/* Phone Number */}
                    <div className="text-center">
                      <a 
                        href={`tel:${settings?.phone?.replace(/\s/g, '') || '+79858009719'}`}
                        className="text-sm font-medium text-[#264348] dark:text-white hover:text-[#C9A962] dark:hover:text-[#C9A962] transition-colors"
                      >
                        {settings?.phone || '+7 985 800 97 19'}
                      </a>
                    </div>
                  </div>
                  
                  {/* Admin Link */}
                  <div className="mt-auto pt-4">
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="text-[10px] text-[#264348]/30 dark:text-white/30 hover:text-[#264348]/50 dark:hover:text-white/50 block text-center"
                    >
                      Админ-панель
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Search Bar - Minimal */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSearch} className="py-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Поиск по товарам..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#264348]/5 dark:bg-white/5 border-0 focus:bg-white dark:focus:bg-white/10 focus:ring-1 focus:ring-[#C9A962]/30 rounded-xl text-sm placeholder:text-[#264348]/40 dark:placeholder:text-white/40"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#264348]/40 dark:text-white/40" />
                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-[#264348]/40 hover:text-[#264348]"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
