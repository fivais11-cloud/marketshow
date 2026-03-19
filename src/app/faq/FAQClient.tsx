'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const faqCategories = [
  {
    title: 'Доставка и оплата',
    questions: [
      {
        question: 'Как быстро доставляете шары?',
        answer: 'Срочная доставка по Москве занимает от 2 часов при наличии готовой композиции. Стандартная доставка — в течение дня или к конкретному времени при предзаказе за 24 часа. Доставка осуществляется ежедневно с 9:00 до 21:00.',
      },
      {
        question: 'Бесплатная доставка — от какой суммы?',
        answer: 'Бесплатная доставка по Москве (внутри МКАД) действует при заказе от 3 000 рублей. Для некоторых округов (СВАО, ВАО, ЮВАО, ЮАО, СЗАО) минимальная сумма для бесплатной доставки — 3 500 рублей. За МКАД (до 10 км) — от 5 000 рублей.',
      },
      {
        question: 'Какие способы оплаты принимаете?',
        answer: 'Принимаем оплату банковскими картами (Visa, MasterCard, МИР) при получении или онлайн, наличными курьеру, а также безналичный расчёт для юридических лиц с выставлением счёта.',
      },
      {
        question: 'Доставляете ли за МКАД?',
        answer: 'Да, доставляем за МКАД до 10 км. Минимальная сумма заказа для бесплатной доставки — 5 000 рублей. Время доставки составляет 3-4 часа. Для более удалённых районов доставка обсуждается индивидуально.',
      },
    ],
  },
  {
    title: 'Оформление и качество',
    questions: [
      {
        question: 'Какие шары вы используете?',
        answer: 'Мы используем только сертифицированные шары премиум-класса от ведущих мировых производителей: Gemar (Италия), Sempertex (Колумбия), Belbal (Бельгия), Grabo (Венгрия). Эти шары дольше сохраняют форму, цвет и не лопаются.',
      },
      {
        question: 'Сколько держатся шары с гелием?',
        answer: 'Латексные шары с гелием держатся 12-24 часа в зависимости от условий. Фольгированные шары — 3-7 дней. Мы предлагаем обработку Hi-Float, которая увеличивает время полёта латексных шаров до 2-3 дней.',
      },
      {
        question: 'Можно ли заказать индивидуальный дизайн?',
        answer: 'Да, наши декораторы создадут уникальную композицию по вашему эскизу или фотографии. Мы учитываем цветовую гамму, тематику праздника и ваши пожелания. Индивидуальный заказ требует предоплаты и бронирования за 2-3 дня.',
      },
      {
        question: 'Даёте ли гарантию на шары?',
        answer: 'Мы даём гарантию 24 часа на все изделия при правильном хранении. Если шары потеряли форму или лопнули по нашей вине — заменим бесплатно. Рекомендуем не оставлять шары на солнце, возле обогревателей и острых предметов.',
      },
    ],
  },
  {
    title: 'Заказ и цены',
    questions: [
      {
        question: 'Как сделать заказ?',
        answer: 'Выберите понравившуюся композицию в каталоге на сайте и нажмите «Заказать». Также можно заказать по телефону +7 985 800 97 19 или написать в Telegram @TanyaShow. Мы ответим в течение 15 минут в рабочее время.',
      },
      {
        question: 'Какие цены на воздушные шары?',
        answer: 'Цены начинаются от 500 рублей за простую композицию. Гирлянды из шаров — от 2 000 рублей за метр. Фотозоны — от 5 000 рублей. Индивидуальные композиции рассчитываются индивидуально. Все цены указаны на сайте в каталоге.',
      },
      {
        question: 'Можно ли отменить или изменить заказ?',
        answer: 'Да, вы можете отменить или изменить заказ за 24 часа до доставки без штрафов. При отмене в день доставки удерживается 30% стоимости (за материалы, которые уже были подготовлены). Изменения в день доставки возможны по согласованию.',
      },
      {
        question: 'Нужна ли предоплата?',
        answer: 'Для стандартных композиций из каталога предоплата не требуется — оплачиваете при получении. Для индивидуальных заказов и крупных мероприятий вносится предоплата 50% от стоимости.',
      },
    ],
  },
  {
    title: 'Услуги',
    questions: [
      {
        question: 'Оформляете ли свадьбы?',
        answer: 'Да, свадебное оформление — одно из наших главных направлений. Создаём фотозоны, арки из шаров, гирлянды для банкетного зала, декор для выездной регистрации. Работаем с ведущими площадками Москвы.',
      },
      {
        question: 'Есть ли услуги по установке?',
        answer: 'Да, наши декораторы приедут и установят любую композицию. Стоимость установки зависит от сложности и рассчитывается индивидуально. Для гирлянд и фотозон установка включена в стоимость при заказе от 5 000 рублей.',
      },
      {
        question: 'Оформляете корпоративные мероприятия?',
        answer: 'Да, работаем с юридическими лицами. Оформляем корпоративы, презентации, открытия магазинов, выставки. Предоставляем закрывающие документы, работаем по договору. Есть опыт работы с крупными компаниями Москвы.',
      },
      {
        question: 'Делаете ли фотозоны?',
        answer: 'Да, фотозоны из шаров — наша специализация. Создаём тематические фотозоны для любых мероприятий: свадьбы, дни рождения, детские праздники, корпоративы. Размер и дизайн обсуждаются индивидуально.',
      },
    ],
  },
];

export function FAQClient() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Помощь и информация</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Часто задаваемые</span>
              <br />
              <span className="text-foreground/80">вопросы</span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/60 mb-8 max-w-2xl mx-auto leading-relaxed">
              Ответы на популярные вопросы о доставке, оплате и оформлении воздушных шаров. 
              Не нашли ответ? Свяжитесь с нами!
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="mb-8"
              >
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  {category.title}
                </h2>
                <Card className="glass-card border-0 overflow-hidden">
                  {category.questions.map((item, questionIndex) => {
                    const isOpen = openItems[`${categoryIndex}-${questionIndex}`];
                    return (
                      <div
                        key={questionIndex}
                        className="border-b border-primary/10 last:border-b-0"
                      >
                        <button
                          onClick={() => toggleItem(categoryIndex, questionIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-primary/5 transition-colors"
                        >
                          <span className="font-medium text-foreground pr-4">
                            {item.question}
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <motion.div
                          initial={false}
                          animate={{
                            height: isOpen ? 'auto' : 0,
                            opacity: isOpen ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 text-foreground/70 leading-relaxed">
                            {item.answer}
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </Card>
              </motion.div>
            ))}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-8 text-center mt-12"
            >
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Остались вопросы?
              </h3>
              <p className="text-foreground/60 mb-6 max-w-xl mx-auto">
                Наши консультанты готовы ответить на любые вопросы и помочь с выбором идеальной композиции для вашего праздника.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    className="btn-premium bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
                  >
                    <a href="tel:+79858009719">
                      <Phone className="h-4 w-4 mr-2" />
                      Позвонить
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-primary/20 hover:bg-primary/5 px-6"
                  >
                    <Link href="/contacts">Все контакты</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
