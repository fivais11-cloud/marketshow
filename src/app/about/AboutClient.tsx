'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users, Truck, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Heart,
    title: 'С любовью к деталям',
    description: 'Каждая композиция создаётся индивидуально с учётом ваших пожеланий и тематики праздника',
    gradient: 'from-pink-400 to-rose-400',
  },
  {
    icon: Award,
    title: 'Премиум качество',
    description: 'Используем только сертифицированные шары от ведущих мировых производителей',
    gradient: 'from-amber-400 to-orange-400',
  },
  {
    icon: Users,
    title: 'Опытная команда',
    description: 'Профессиональные декораторы с опытом более 5 лет в оформлении праздников',
    gradient: 'from-purple-400 to-violet-400',
  },
  {
    icon: Truck,
    title: 'Бережная доставка',
    description: 'Доставляем шары в специальной упаковке, чтобы они долетели до вас идеальными',
    gradient: 'from-blue-400 to-cyan-400',
  },
];

const stats = [
  { value: '5+', label: 'лет опыта' },
  { value: '5000+', label: 'мероприятий' },
  { value: '98%', label: 'довольных клиентов' },
  { value: '24/7', label: 'поддержка' },
];

const achievements = [
  'Более 5000 оформленных мероприятий',
  'Работаем с крупнейшими компаниями Москвы',
  'Сертифицированные материалы от мировых брендов',
  'Гарантия качества на все изделия',
  'Индивидуальный подход к каждому клиенту',
  'Доставка по всей Москве и области',
];

export function AboutClient() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/10 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">О нашей компании</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              <span className="gradient-text">Маркет Шоу</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-foreground/60"
            >
              Создаём незабываемые праздники с 2019 года
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-8 mb-12"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Наша история</h2>
              <div className="space-y-4 text-foreground/70 leading-relaxed">
                <p>
                  <strong className="text-foreground">Маркет Шоу</strong> — это команда профессионалов, 
                  влюблённых в своё дело. Мы начали свой путь в 2019 году с простой идеи: делать праздники 
                  незабываемыми. С тех пор мы оформили более 5000 мероприятий — от маленьких семейных 
                  праздников до масштабных корпоративных событий.
                </p>
                <p>
                  Мы используем только качественные материалы от проверенных поставщиков. Наши шары дольше 
                  сохраняют форму и цвет, а профессиональные декораторы создают настоящие произведения искусства. 
                  Каждый заказ для нас — это возможность подарить радость и создать волшебную атмосферу.
                </p>
                <p>
                  За годы работы мы накопили огромный опыт в оформлении самых разных мероприятий: 
                  свадеб, дней рождения, детских праздников, корпоративов, выпускных и юбилеев. 
                  Мы знаем, как сделать каждый праздник особенным!
                </p>
              </div>
            </motion.div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="p-6 glass-card border-0 h-full hover:shadow-xl transition-all duration-300 group">
                    <div className="flex gap-4">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-foreground/60 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-card rounded-2xl p-8 mb-12"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                    <div className="text-foreground/50 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass-card rounded-2xl p-8 mb-12"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Почему выбирают нас</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground/70">{achievement}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center"
            >
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Готовы сделать ваш праздник особенным?
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
                  >
                    <Link href="/">Смотреть каталог</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-primary/20 hover:bg-primary/5 px-6"
                  >
                    <Link href="/contacts">Связаться с нами</Link>
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
            '@type': 'AboutPage',
            mainEntity: {
              '@type': 'LocalBusiness',
              name: 'Маркет Шоу',
              description: 'Доставка воздушных шаров премиум-класса по Москве. Оформление праздников, фотозон, гирлянд и композиций из шаров.',
              foundingDate: '2019',
              numberOfEmployees: '10-20',
              telephone: '+79858009719',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Москва',
                addressCountry: 'RU',
              },
            },
          }),
        }}
      />
    </div>
  );
}
