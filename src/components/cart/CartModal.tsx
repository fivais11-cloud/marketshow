'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppStore } from '@/store/useAppStore';
import { useCreateOrder } from '@/hooks/useApi';
import { toast } from 'sonner';
import Image from 'next/image';

export function CartModal() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, getCartTotal } = useAppStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const createOrder = useCreateOrder();
  
  const total = getCartTotal();
  
  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('ru-RU');
  };
  
  const handleCheckout = async () => {
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
      await createOrder.mutateAsync({
        phone: formattedPhone,
        email: email || undefined,
        items: cart.map(item => ({
          postId: item.postId,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: total,
        source: 'cart',
      });
      
      toast.success('Заказ оформлен!', {
        description: 'Мы свяжемся с вами в ближайшее время',
      });
      
      setShowCheckout(false);
      setPhone('');
      setEmail('');
      setIsCartOpen(false);
    } catch (error) {
      toast.error('Ошибка при оформлении заказа');
    }
  };
  
  return (
    <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
      <DialogContent className="sm:max-w-[480px] bg-background border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 gradient-text">
            <ShoppingBag className="h-5 w-5" />
            Корзина
          </DialogTitle>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          {!showCheckout ? (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {cart.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-primary/50" />
                  </div>
                  <p className="text-foreground/50">Корзина пуста</p>
                  <Button
                    variant="link"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 text-primary"
                  >
                    Перейти к покупкам
                  </Button>
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <motion.div
                          key={item.postId}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="flex gap-4 p-3 rounded-xl bg-primary/5"
                        >
                          <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-primary font-semibold mt-1">
                              {formatPrice(item.price)} ₽
                            </p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-full"
                                onClick={() => updateQuantity(item.postId, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-full"
                                onClick={() => updateQuantity(item.postId, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-foreground/30 hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFromCart(item.postId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <div className="border-t border-primary/10 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-foreground/70">Итого:</span>
                      <span className="text-xl font-bold gradient-text">
                        {formatPrice(total)} ₽
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={clearCart}
                        className="flex-1 border-primary/20 text-foreground/50 hover:bg-primary/5"
                      >
                        Очистить
                      </Button>
                      <Button
                        onClick={() => setShowCheckout(true)}
                        className="flex-1 btn-premium bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Оформить заказ
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl bg-primary/5">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/50">Товаров:</span>
                  <span>{cart.length}</span>
                </div>
                <div className="flex justify-between font-semibold mt-2">
                  <span>К оплате:</span>
                  <span className="gradient-text">{formatPrice(total)} ₽</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className="border-primary/20 focus:border-primary focus:ring-primary/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email (необязательно)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="border-primary/20 focus:border-primary focus:ring-primary/20"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1"
                  disabled={createOrder.isPending}
                >
                  Назад
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={createOrder.isPending || !phone.trim()}
                  className="flex-1 btn-premium bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Отправить заказ
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
