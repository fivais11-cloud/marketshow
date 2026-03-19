'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, X, Phone, Send, MessageCircle, ShoppingBag, Moon, Sun, Home, Info, Truck, Mail, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/store/useAppStore';
import { useSettings, useHashtags, useHashtagClick } from '@/hooks/useApi';
import { toast } from 'sonner';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    searchQuery, 
    setSearchQuery, 
    isSearchOpen, 
    setIsSearchOpen, 
    selectedHashtag, 
    setSelectedHashtag, 
    popularHashtags,
    cart,
    isCartOpen,
    setIsCartOpen,
    theme,
    toggleTheme
  } = useAppStore();
  
  const { data: settings } = useSettings();
  const { data: hashtags } = useHashtags();
  const hashtagClick = useHashtagClick();
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const handleHashtagClick = async (hashtag: { id: string; name: string }) => {
    await hashtagClick.mutateAsync(hashtag.id);
    setSelectedHashtag(hashtag.name);
    setIsOpen(false);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
  };

  const handlePhoneClick = () => {
    if (settings?.phone) {
      window.location.href = `tel:${settings.phone.replace(/\s/g, '')}`;
    }
  };

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('ru-RU');
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <span className="text-xl md:text-2xl font-bold gradient-text">
                Маркет Шоу
              </span>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground/70 hover:text-primary transition-colors relative group">
              Главная
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/about" className="text-foreground/70 hover:text-primary transition-colors relative group">
              О нас
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/delivery" className="text-foreground/70 hover:text-primary transition-colors relative group">
              Доставка
            </Link>
            <Link href="/faq" className="text-foreground/70 hover:text-primary transition-colors relative group">
              FAQ
            </Link>
            <Link href="/contacts" className="text-foreground/70 hover:text-primary transition-colors relative group">
              Контакты
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-foreground/70 hover:text-primary"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-foreground/70 hover:text-primary"
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
            
            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="relative text-foreground/70 hover:text-primary"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
            </motion.div>
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background border-l border-primary/20">
                <SheetHeader>
                  <SheetTitle className="text-left gradient-text text-xl">Маркет Шоу</SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 flex flex-col gap-6">
                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-2">
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
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 text-foreground hover:text-primary transition-all duration-200 text-base"
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  
                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  
                  {/* Contact Section */}
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">Свяжитесь с нами</p>
                    
                    {/* Contact Icons */}
                    <div className="flex justify-center gap-4">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
                        <Button
                          onClick={handlePhoneClick}
                          size="icon"
                          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                        >
                          <Phone className="h-6 w-6" />
                        </Button>
                        <span className="text-xs text-muted-foreground">Звонок</span>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
                        <Button
                          asChild
                          size="icon"
                          variant="outline"
                          className="w-14 h-14 rounded-full border-[#0088cc]/50 hover:bg-[#0088cc] hover:text-white text-[#0088cc] transition-all"
                        >
                          <a href={settings?.telegram || 'https://t.me/TanyaShow'} target="_blank" rel="noopener noreferrer">
                            <Send className="h-6 w-6" />
                          </a>
                        </Button>
                        <span className="text-xs text-muted-foreground">Telegram</span>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
                        <Button
                          asChild
                          size="icon"
                          variant="outline"
                          className="w-14 h-14 rounded-full border-[#6B52AE]/50 hover:bg-[#6B52AE] hover:text-white text-[#6B52AE] transition-all"
                        >
                          <a href={settings?.max || 'https://max.ru/chat/marketshow'} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-6 w-6" />
                          </a>
                        </Button>
                        <span className="text-xs text-muted-foreground">Max</span>
                      </motion.div>
                    </div>
                    
                    {/* Phone Number */}
                    <div className="text-center">
                      <a 
                        href={`tel:${settings?.phone?.replace(/\s/g, '') || '+79858009719'}`}
                        className="text-base font-medium text-foreground hover:text-primary transition-colors"
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
                      className="text-xs text-foreground/30 hover:text-foreground/50 block text-center"
                    >
                      Админ-панель
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSearch} className="py-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Поиск по товарам и хэштегам..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border-primary/20 focus:border-primary focus:ring-primary/20 rounded-xl"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
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
