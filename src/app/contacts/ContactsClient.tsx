'use client';

import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSettings } from '@/hooks/useApi';

export function ContactsClient() {
  const { data: settings } = useSettings();
  
  const phone = settings?.phone || '+7 985 800 97 19';
  const telegram = settings?.telegram || 'https://t.me/marketshow';
  const max = settings?.max || 'https://max.ru/chat/marketshow';

  const contactMethods = [
    {
      icon: Phone,
      title: 'Телефон',
      value: phone,
      href: `tel:${phone.replace(/\s/g, '')}`,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Send,
      title: 'Telegram',
      value: '@marketshow',
      href: telegram,
      color: 'text-[#0088cc]',
      bgColor: 'bg-[#0088cc]/10',
    },
    {
      icon: MessageCircle,
      title: 'Max',
      value: 'Написать в Max',
      href: max,
      color: 'text-[#6B52AE]',
      bgColor: 'bg-[#6B52AE]/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/10 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              <span className="gradient-text">Контакты</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-foreground/60"
            >
              Мы всегда рады помочь вам с выбором и ответить на любые вопросы
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 glass-card border-0 hover:shadow-xl transition-all duration-300 h-full group">
                    <motion.div 
                      className={`w-14 h-14 rounded-full ${method.bgColor} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
                      whileHover={{ rotate: 5 }}
                    >
                      <method.icon className={`h-7 w-7 ${method.color}`} />
                    </motion.div>
                    <h3 className="font-semibold text-foreground mb-2">{method.title}</h3>
                    <a
                      href={method.href}
                      target={method.href.startsWith('http') ? '_blank' : undefined}
                      rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className={`${method.color} hover:underline font-medium`}
                    >
                      {method.value}
                    </a>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 glass-card border-0 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Режим работы</h3>
                      <p className="text-foreground/70">{settings?.workingHours || 'Пн-Вс: 9:00 - 21:00'}</p>
                      <p className="text-sm text-foreground/50 mt-1">Принимаем заказы без выходных</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 glass-card border-0 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Адрес</h3>
                      <p className="text-foreground/70">{settings?.address || 'Москва'}</p>
                      <p className="text-sm text-foreground/50 mt-1">Доставка по всей Москве</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Не можете определиться с выбором?
              </h3>
              <p className="text-foreground/60 mb-6 max-w-xl mx-auto">
                Наши консультанты помогут подобрать идеальную композицию для вашего праздника.
                Просто напишите или позвоните нам!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
                  >
                    <a href={`tel:${phone.replace(/\s/g, '')}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Позвонить
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-[#0088cc]/30 text-[#0088cc] hover:bg-[#0088cc]/10 px-6"
                  >
                    <a href={telegram} target="_blank" rel="noopener noreferrer">
                      <Send className="h-4 w-4 mr-2" />
                      Telegram
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-[#6B52AE]/30 text-[#6B52AE] hover:bg-[#6B52AE]/10 px-6"
                  >
                    <a href={max} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Max
                    </a>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            mainEntity: {
              '@type': 'LocalBusiness',
              name: 'Маркет Шоу',
              telephone: phone.replace(/\s/g, ''),
              address: {
                '@type': 'PostalAddress',
                addressLocality: settings?.address || 'Москва',
                addressCountry: 'RU',
              },
              openingHours: 'Mo-Su 09:00-21:00',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: phone.replace(/\s/g, ''),
                contactType: 'customer service',
                availableLanguage: ['Russian'],
              },
            },
          }),
        }}
      />
    </div>
  );
}
