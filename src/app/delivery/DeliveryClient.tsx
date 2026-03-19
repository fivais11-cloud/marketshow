'use client';

import { motion } from 'framer-motion';
import { Truck, CreditCard, Clock, MapPin, CheckCircle, Phone, Send, MessageCircle, Package, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSettings } from '@/hooks/useApi';

const deliveryZones = [
  { zone: 'Центральный округ (ЦАО)', price: 'Бесплатно от 3 000₽', time: '1-2 часа' },
  { zone: 'Северный округ (САО)', price: 'Бесплатно от 3 000₽', time: '2-3 часа' },
  { zone: 'Северо-Восточный округ (СВАО)', price: 'Бесплатно от 3 500₽', time: '2-3 часа' },
  { zone: 'Восточный округ (ВАО)', price: 'Бесплатно от 3 500₽', time: '2-3 часа' },
  { zone: 'Юго-Восточный округ (ЮВАО)', price: 'Бесплатно от 3 500₽', time: '2-3 часа' },
  { zone: 'Южный округ (ЮАО)', price: 'Бесплатно от 3 500₽', time: '2-3 часа' },
  { zone: 'Юго-Западный округ (ЮЗАО)', price: 'Бесплатно от 3 000₽', time: '2-3 часа' },
  { zone: 'Западный округ (ЗАО)', price: 'Бесплатно от 3 000₽', time: '2-3 часа' },
  { zone: 'Северо-Западный округ (СЗАО)', price: 'Бесплатно от 3 500₽', time: '2-3 часа' },
  { zone: 'За МКАД (до 10 км)', price: 'Бесплатно от 5 000₽', time: '3-4 часа' },
];

const paymentMethods = [
  {
    icon: CreditCard,
    title: 'Оплата картой',
    description: 'Visa, MasterCard, МИР при получении или онлайн',
    color: 'from-blue-400 to-blue-600',
  },
  {
    icon: Package,
    title: 'Наличными',
    description: 'Оплата наличными курьеру при получении заказа',
    color: 'from-green-400 to-green-600',
  },
  {
    icon: Shield,
    title: 'Безналичный расчёт',
    description: 'Для юридических лиц с выставлением счёта',
    color: 'from-purple-400 to-purple-600',
  },
];

export function DeliveryClient() {
  const { data: settings } = useSettings();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        
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
              <Truck className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Доставка по всей Москве</span>
            </motion.div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Доставка и оплата</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/60 mb-8 max-w-2xl mx-auto leading-relaxed">
              Доставляем воздушные шары с заботой о каждом заказе. 
              Бесплатная доставка от 3 000₽ по Москве.
            </p>
            
            {/* Quick Info */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm mb-10">
              <div className="flex items-center gap-2 text-foreground/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span>Срочная: 2 часа</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span>По всей Москве</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <span>Гарантия 24 часа</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Delivery Features */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
          >
            <Card className="glass-card border-0 p-6 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Срочная доставка</h3>
              <p className="text-sm text-foreground/60">Доставим ваш заказ за 2 часа при наличии товара</p>
            </Card>
            <Card className="glass-card border-0 p-6 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">По всей Москве</h3>
              <p className="text-sm text-foreground/60">Доставляем во все округа и за МКАД</p>
            </Card>
            <Card className="glass-card border-0 p-6 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Бережная доставка</h3>
              <p className="text-sm text-foreground/60">Специальная упаковка гарантирует сохранность</p>
            </Card>
          </motion.div>

          {/* Delivery Zones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              <span className="gradient-text">Зоны доставки</span>
            </h2>
            
            <Card className="glass-card border-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80">Район доставки</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80">Стоимость</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/80">Время</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryZones.map((zone, index) => (
                      <tr key={index} className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
                        <td className="px-6 py-4 text-foreground/70">{zone.zone}</td>
                        <td className="px-6 py-4 text-primary font-medium">{zone.price}</td>
                        <td className="px-6 py-4 text-foreground/60">{zone.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            
            <p className="text-sm text-foreground/50 mt-4 text-center">
              * При заказе до суммы бесплатной доставки стоимость доставки составляет 300-500₽
            </p>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              <span className="gradient-text">Способы оплаты</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paymentMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="glass-card border-0 p-6 h-full hover:shadow-xl transition-all duration-300 group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <method.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{method.title}</h3>
                    <p className="text-sm text-foreground/60">{method.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <Card className="glass-card border-0 p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Важная информация</h3>
              <ul className="space-y-4 max-w-2xl mx-auto">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/70">Доставка осуществляется ежедневно с 9:00 до 21:00</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/70">Возможна доставка к конкретному времени (предзаказ за 24 часа)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/70">Подъем на этаж осуществляется бесплатно при наличии лифта</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/70">Гарантия на шары — 24 часа с момента доставки при правильном хранении</span>
                </li>
              </ul>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Остались вопросы?
            </h3>
            <p className="text-foreground/60 mb-8">
              Свяжитесь с нами любым удобным способом
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                >
                  <a href={`tel:${settings?.phone?.replace(/\s/g, '') || '+79858009719'}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    {settings?.phone || '+7 985 800 97 19'}
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full px-8 border-primary/20 hover:bg-primary/5"
                >
                  <a href={settings?.telegram || 'https://t.me/TanyaShow'} target="_blank" rel="noopener noreferrer">
                    <Send className="h-4 w-4 mr-2" />
                    Telegram
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full px-8 border-primary/20 hover:bg-primary/5"
                >
                  <a href={settings?.max || 'https://max.ru/chat/marketshow'} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Max
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
