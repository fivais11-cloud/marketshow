'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings, useCallbackMutation } from '@/hooks/useApi';
import { toast } from 'sonner';

interface FloatingContactButtonProps {
  source?: string;
}

export function FloatingContactButton({ source }: FloatingContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCallback, setShowCallback] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { data: settings } = useSettings();
  const callbackMutation = useCallbackMutation();
  const pathname = usePathname();
  
  // Скрываем кнопку на странице товара (там уже есть кнопки связи)
  const isProductPage = pathname?.startsWith('/product/');
  if (isProductPage) return null;
  
  const handleTelegramClick = () => {
    const text = source 
      ? `Здравствуйте! Интересует товар: ${source}` 
      : 'Здравствуйте! Хочу узнать подробнее о ваших услугах.';
    const url = settings?.telegram 
      ? `${settings.telegram}?text=${encodeURIComponent(text)}`
      : `https://t.me/TanyaShow?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };
  
  const handleMaxClick = () => {
    const text = source 
      ? `Здравствуйте! Интересует товар: ${source}` 
      : 'Здравствуйте! Хочу узнать подробнее о ваших услугах.';
    const url = settings?.max 
      ? `${settings.max}?text=${encodeURIComponent(text)}`
      : `https://max.ru/chat/marketshow?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };
  
  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      toast.error('Введите номер телефона');
      return;
    }
    
    // Format phone
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = '7' + formattedPhone;
    } else if (formattedPhone.startsWith('8')) {
      formattedPhone = '7' + formattedPhone.slice(1);
    }
    
    if (formattedPhone.length !== 11) {
      toast.error('Неверный формат телефона');
      return;
    }
    
    try {
      await callbackMutation.mutateAsync({
        name: name || undefined,
        phone: formattedPhone,
        source,
        type: 'callback',
      });
      toast.success('Заявка отправлена!', {
        description: 'Мы перезвоним вам в ближайшее время',
      });
      setShowCallback(false);
      setIsOpen(false);
      setName('');
      setPhone('');
    } catch (error) {
      toast.error('Ошибка отправки заявки');
    }
  };
  
  return (
    <>
      {/* Floating Button - Gold accent */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-xl transition-all duration-300 ${
            isOpen 
              ? 'bg-[#264348] hover:bg-[#264348]/90 rotate-0' 
              : 'bg-[#C9A962] hover:bg-[#C9A962]/90'
          } text-white`}
        >
          {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        </Button>
      </motion.div>
      
      {/* Quick Actions Menu - Minimal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col gap-2"
          >
            {/* Telegram */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                onClick={handleTelegramClick}
                className="bg-white dark:bg-[#1a1f21] text-[#264348] dark:text-white rounded-full px-5 h-11 shadow-lg border border-[#264348]/5 dark:border-white/5 hover:border-[#C9A962] hover:text-[#C9A962] transition-all"
              >
                <Send className="h-4 w-4 mr-2" />
                Telegram
              </Button>
            </motion.div>
            
            {/* Max */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Button
                onClick={handleMaxClick}
                className="bg-white dark:bg-[#1a1f21] text-[#264348] dark:text-white rounded-full px-5 h-11 shadow-lg border border-[#264348]/5 dark:border-white/5 hover:border-[#C9A962] hover:text-[#C9A962] transition-all"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Max
              </Button>
            </motion.div>
            
            {/* Callback */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={() => setShowCallback(true)}
                className="bg-[#264348] hover:bg-[#264348]/90 text-white rounded-full px-5 h-11 shadow-lg"
              >
                <Phone className="h-4 w-4 mr-2" />
                Перезвонить
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Callback Dialog - Refined */}
      <Dialog open={showCallback} onOpenChange={setShowCallback}>
        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-[#1a1f21] border-[#264348]/5 dark:border-white/5">
          <DialogHeader>
            <DialogTitle 
              className="text-[#264348] dark:text-white"
              style={{ fontFamily: 'Cinzel, Georgia, serif' }}
            >
              Заказать звонок
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCallbackSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#264348]/60 dark:text-white/40 text-xs uppercase tracking-wider">Ваше имя</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Как к вам обращаться?"
                className="border-[#264348]/10 dark:border-white/10 focus:border-[#C9A962] focus:ring-[#C9A962]/20 bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="callback-phone" className="text-[#264348]/60 dark:text-white/40 text-xs uppercase tracking-wider">Телефон *</Label>
              <Input
                id="callback-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                className="border-[#264348]/10 dark:border-white/10 focus:border-[#C9A962] focus:ring-[#C9A962]/20 bg-transparent"
                required
              />
            </div>
            {source && (
              <p className="text-xs text-[#264348]/40 dark:text-white/30">
                Интересует: <span className="text-[#C9A962]">{source}</span>
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-[#C9A962] hover:bg-[#C9A962]/90 text-white rounded-full"
              disabled={callbackMutation.isPending}
            >
              {callbackMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                'Отправить заявку'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
