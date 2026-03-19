'use client';

import { useState } from 'react';
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
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg btn-premium ${
            isOpen 
              ? 'bg-foreground hover:bg-foreground/90' 
              : 'bg-primary hover:bg-primary/90'
          } text-primary-foreground`}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>
      
      {/* Quick Actions Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col gap-3"
          >
            {/* Telegram */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                onClick={handleTelegramClick}
                className="bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-full px-6 shadow-lg"
              >
                <Send className="h-4 w-4 mr-2" />
                Telegram
              </Button>
            </motion.div>
            
            {/* Max */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleMaxClick}
                className="bg-[#6B52AE] hover:bg-[#5a4598] text-white rounded-full px-6 shadow-lg"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Max
              </Button>
            </motion.div>
            
            {/* Callback */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={() => setShowCallback(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 shadow-lg"
              >
                <Phone className="h-4 w-4 mr-2" />
                Перезвонить
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Callback Dialog */}
      <Dialog open={showCallback} onOpenChange={setShowCallback}>
        <DialogContent className="sm:max-w-[400px] glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="gradient-text">Заказать звонок</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCallbackSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ваше имя</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Как к вам обращаться?"
                className="border-primary/20 focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="callback-phone">Телефон *</Label>
              <Input
                id="callback-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                className="border-primary/20 focus:border-primary focus:ring-primary/20"
                required
              />
            </div>
            {source && (
              <p className="text-sm text-foreground/50">
                Интересует: <span className="text-primary">{source}</span>
              </p>
            )}
            <Button
              type="submit"
              className="w-full btn-premium bg-primary hover:bg-primary/90 text-primary-foreground"
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
