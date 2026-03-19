from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# Register fonts
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
pdfmetrics.registerFont(TTFont('Microsoft YaHei', '/usr/share/fonts/truetype/chinese/msyh.ttf'))
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('SimHei', normal='SimHei', bold='SimHei')
registerFontFamily('Microsoft YaHei', normal='Microsoft YaHei', bold='Microsoft YaHei')
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
doc = SimpleDocTemplate(
    "/home/z/my-project/download/SEO_AIO_Guide_2025.pdf",
    pagesize=A4,
    rightMargin=2*cm,
    leftMargin=2*cm,
    topMargin=2*cm,
    bottomMargin=2*cm,
    title="SEO и AIO Гайд 2025-2026",
    author='Z.ai',
    creator='Z.ai',
    subject='Руководство по SEO и AI-оптимизации для малого бизнеса'
)

# Styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'Title',
    fontName='Microsoft YaHei',
    fontSize=28,
    leading=36,
    alignment=TA_CENTER,
    spaceAfter=20
)

heading1_style = ParagraphStyle(
    'Heading1',
    fontName='Microsoft YaHei',
    fontSize=18,
    leading=24,
    spaceBefore=20,
    spaceAfter=12,
    textColor=colors.HexColor('#1F4E79')
)

heading2_style = ParagraphStyle(
    'Heading2',
    fontName='Microsoft YaHei',
    fontSize=14,
    leading=18,
    spaceBefore=14,
    spaceAfter=8,
    textColor=colors.HexColor('#2E75B6')
)

body_style = ParagraphStyle(
    'Body',
    fontName='SimHei',
    fontSize=11,
    leading=18,
    alignment=TA_LEFT,
    spaceAfter=8,
    wordWrap='CJK'
)

bullet_style = ParagraphStyle(
    'Bullet',
    fontName='SimHei',
    fontSize=11,
    leading=16,
    leftIndent=20,
    spaceAfter=4,
    wordWrap='CJK'
)

highlight_style = ParagraphStyle(
    'Highlight',
    fontName='SimHei',
    fontSize=11,
    leading=18,
    backColor=colors.HexColor('#FFF3CD'),
    borderPadding=10,
    spaceAfter=12,
    wordWrap='CJK'
)

story = []

# Title
story.append(Spacer(1, 100))
story.append(Paragraph("SEO и AIO для малого бизнеса", title_style))
story.append(Paragraph("Актуальные стратегии 2025-2026", ParagraphStyle(
    'Subtitle',
    fontName='SimHei',
    fontSize=16,
    alignment=TA_CENTER,
    textColor=colors.grey
)))
story.append(Spacer(1, 40))
story.append(Paragraph("Как сделать ваш сайт видимым для поисковых систем и ИИ", ParagraphStyle(
    'Desc',
    fontName='SimHei',
    fontSize=12,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666')
)))
story.append(PageBreak())

# Part 1: SEO
story.append(Paragraph("ЧАСТЬ 1: Классическое SEO в 2025-2026", heading1_style))

story.append(Paragraph("Что изменилось с 2017 года?", heading2_style))
story.append(Paragraph(
    "Если ваши знания SEO заканчиваются 2017 годом, вы пропустили несколько революционных изменений. "
    "Google теперь использует нейросети для ранжирования (BERT, MUM), Яндекс внедрил алгоритмы на базе машинного обучения, "
    "а мобильная версия сайта стала единственной версией для индексации. Важно понимать, что SEO больше не сводится "
    "к простому набору ключевых слов — это комплексная дисциплина, учитывающая пользовательский опыт, скорость загрузки, "
    "безопасность и качество контента.",
    body_style
))

story.append(Paragraph("Ключевые изменения в SEO:", heading2_style))

story.append(Paragraph("<b>1. Core Web Vitals — метрики качества сайта</b>", body_style))
story.append(Paragraph(
    "С 2021 года Google официально включил Core Web Vitals в факторы ранжирования. Это три метрики: "
    "LCP (Largest Contentful Paint) — время загрузки основного контента (должно быть менее 2.5 сек), "
    "FID (First Input Delay) — время до первого взаимодействия (менее 100 мс), "
    "CLS (Cumulative Layout Shift) — стабильность макета (менее 0.1). "
    "Ваш сайт должен проходить эти тесты в Google PageSpeed Insights.",
    body_style
))

story.append(Paragraph("<b>2. Mobile-First Indexing</b>", body_style))
story.append(Paragraph(
    "С 2019 года Google индексирует исключительно мобильную версию сайта. "
    "Если у вас отдельная мобильная версия (m.site.ru) или адаптивный дизайн, "
    "поисковый робот анализирует именно её. Десктопная версия практически не учитывается. "
    "Это означает, что весь контент, структуру и метаданные нужно оптимизировать для мобильных устройств.",
    body_style
))

story.append(Paragraph("<b>3. E-E-A-T (Опыт, Экспертность, Авторитетность, Надёжность)</b>", body_style))
story.append(Paragraph(
    "В 2022 году Google добавил букву E — Experience (опыт). Теперь алгоритмы оценивают не только экспертность автора, "
    "но и практический опыт. Для сайта воздушных шаров это означает: показывайте реальные фото своих работ, "
    "отзывы клиентов, кейсы с описанием процесса создания композиций. Авторство контента должно быть прозрачным.",
    body_style
))

story.append(Paragraph("<b>4. Полезный контент (Helpful Content Update)</b>", body_style))
story.append(Paragraph(
    "С августа 2022 года Google пессимизирует сайты, созданные для поисковых систем, а не для людей. "
    "Контент должен отвечать на вопросы пользователей, давать практическую пользу, быть уникальным. "
    "Страницы с пустым или поверхностным контентом, переоптимизированные под ключевые слова, попадают под фильтр.",
    body_style
))

story.append(Paragraph("<b>5. ИИ-контент и его индексация</b>", body_style))
story.append(Paragraph(
    "В 2023-2024 годах Google и Яндекс официально заявили, что ИИ-контент не запрещён, но должен быть качественным. "
    "Автоматически сгенерированные тексты без редактуры и пользы для пользователя будут пессимизироваться. "
    "Рекомендуется добавлять уникальные данные, личный опыт, экспертные комментарии к ИИ-контенту.",
    body_style
))

story.append(PageBreak())

# Yandex specific
story.append(Paragraph("Особенности Яндекса для российского рынка", heading2_style))
story.append(Paragraph(
    "Для компании Маркет Шоу Яндекс является основным источником трафика из поисковых систем в России. "
    "Доля Яндекса на российском рынке поиска составляет около 60%, поэтому оптимизация под его алгоритмы критически важна. "
    "Яндекс использует собственные технологии машинного обучения, отличные от Google, и имеет специфические требования к сайтам.",
    body_style
))

story.append(Paragraph("<b>Ключевые факторы ранжирования в Яндексе:</b>", body_style))
story.append(Paragraph("• Яндекс Справочник (Я.Бизнес) — обязательная регистрация для локального бизнеса", bullet_style))
story.append(Paragraph("• Геопривязка — указание адреса, карты, региона обслуживания", bullet_style))
story.append(Paragraph("• ТИЦ (тематический индекс цитирования) — аналог PageRank для Рунета", bullet_style))
story.append(Paragraph("• Возраст домена — Яндекс доверяет старым доменам больше Google", bullet_style))
story.append(Paragraph("• Поведенческие факторы — время на сайте, глубина просмотра, отказы", bullet_style))

story.append(Paragraph(
    "Критически важно зарегистрироваться в Яндекс Справочнике с полным описанием услуг, фотографиями работ, "
    "контактами и режимом работы. Это бесплатный инструмент, который значительно повышает видимость в локальном поиске "
    "и на Яндекс Картах. При поиске «воздушные шары москва» или «доставка шаров [район]» ваш бизнес будет показан "
    "в блоке организаций на первом экране результатов поиска.",
    body_style
))

# Part 2: AIO
story.append(Spacer(1, 20))
story.append(Paragraph("ЧАСТЬ 2: AI Optimization (AIO) — новая эра поиска", heading1_style))

story.append(Paragraph("Что такое AIO и почему это важно?", heading2_style))
story.append(Paragraph(
    "AIO (AI Optimization) — это оптимизация контента для искусственного интеллекта. "
    "С появлением ChatGPT, Claude, Perplexity, Google Gemini и ЯндексGPT, пользователи всё чаще задают вопросы напрямую ИИ, "
    "а не ищут в классических поисковиках. По данным исследований 2024 года, до 40% пользователей в возрасте 18-34 лет "
    "используют ИИ-ассистентов для поиска товаров и услуг. Это принципиально новый канал привлечения клиентов.",
    body_style
))

story.append(Paragraph("Как ИИ находит и рекомендует бизнес?", heading2_style))
story.append(Paragraph(
    "ИИ-ассистенты формируют ответы на основе обучающих данных из интернета. Они анализируют сайты, отзывы, "
    "статьи в СМИ, профили в соцсетях, карточки организаций. Когда пользователь спрашивает «Где заказать воздушные шары в Москве?» — "
    "ИИ вспоминает (из обучающих данных) или ищет (если есть доступ к сети) релевантные варианты. "
    "Ваша задача — стать тем бизнесом, который ИИ «знает» и «любит» рекомендовать.",
    body_style
))

story.append(PageBreak())

story.append(Paragraph("Стратегии AIO для малого бизнеса", heading2_style))

story.append(Paragraph("<b>1. Структурированные данные (Schema.org)</b>", body_style))
story.append(Paragraph(
    "ИИ лучше понимает структурированную информацию. Разметка Schema.org помогает чётко указать: "
    "тип бизнеса (LocalBusiness), название, адрес, телефон, режим работы, ассортимент, цены. "
    "На вашем сайте уже есть базовая разметка LocalBusiness. Рекомендуется добавить разметку для товаров (Product), "
    "отзывов (Review), вопросов-ответов (FAQPage). Это поможет ИИ корректно интерпретировать информацию о компании.",
    body_style
))

story.append(Paragraph("<b>2. Присутствие на авторитетных площадках</b>", body_style))
story.append(Paragraph(
    "ИИ обучается на контенте с разных источников. Чем больше качественных упоминаний вашего бизнеса — тем выше вероятность "
    "попасть в рекомендации. Обязательно зарегистрируйтесь на: Яндекс Справочник, 2ГИС, Google Business Profile, "
    "Авито, Юла, Profi.ru, Zoon.ru. Каждая карточка с описанием, фото и отзывами увеличивает «вес» вашего бренда в глазах ИИ.",
    body_style
))

story.append(Paragraph("<b>3. Отзывы и репутация</b>", body_style))
story.append(Paragraph(
    "ИИ учитывает тональность и количество отзывов. Компания с 50 положительными отзывами на Яндекс Картах "
    "получит приоритет перед компанией без отзывов. Важно: отзывы должны быть настоящими, с конкретными деталями. "
    "ИИ распознаёт накрутку и фейковые отзывы. Попросите довольных клиентов оставить отзывы с упоминанием конкретных услуг — "
    "например, «заказывали свадебную арку из шаров, доставили вовремя, выглядит шикарно».",
    body_style
))

story.append(Paragraph("<b>4. Экспертный контент</b>", body_style))
story.append(Paragraph(
    "Создавайте контент, который ИИ будет цитировать. Статьи «Как выбрать воздушные шары для свадьбы», "
    "«Сколько стоят шары в 2025 году», «Какие шары летают дольше» — такие материалы попадают в обучающие выборки ИИ "
    "и формируют образ вашего бренда как эксперта. Публикуйте статьи на сайте, дублируйте на VC.ru, Дзен, в Telegram-канале.",
    body_style
))

story.append(Paragraph("<b>5. Чёткое позиционирование</b>", body_style))
story.append(Paragraph(
    "ИИ проще рекомендовать бизнес с чётким позиционированием. Вместо «мы делаем всё» — «мы специализируемся на свадебных "
    "арках и фотозонах из воздушных шаров». Чёткое УТП (уникальное торговое предложение) помогает ИИ понять, "
    "в каких запросах рекомендовать именно вас. Определите 3-5 ключевых специализаций и сделайте их заметными на сайте.",
    body_style
))

# Part 3: Checklist
story.append(PageBreak())
story.append(Paragraph("ЧАСТЬ 3: Практический чек-лист для Маркет Шоу", heading1_style))

story.append(Paragraph("Технические задачи (приоритет высокий)", heading2_style))

# Create checklist table
checklist_data = [
    [Paragraph('<b>Задача</b>', ParagraphStyle('th', fontName='Microsoft YaHei', fontSize=10, textColor=colors.white)),
     Paragraph('<b>Статус</b>', ParagraphStyle('th', fontName='Microsoft YaHei', fontSize=10, textColor=colors.white)),
     Paragraph('<b>Приоритет</b>', ParagraphStyle('th', fontName='Microsoft YaHei', fontSize=10, textColor=colors.white))],
    [Paragraph('Регистрация в Яндекс Справочнике', body_style), Paragraph('Не сделано', body_style), Paragraph('Критично', body_style)],
    [Paragraph('Регистрация в 2ГИС', body_style), Paragraph('Не сделано', body_style), Paragraph('Высокий', body_style)],
    [Paragraph('Регистрация в Google Business', body_style), Paragraph('Не сделано', body_style), Paragraph('Высокий', body_style)],
    [Paragraph('Проверка Core Web Vitals', body_style), Paragraph('Требует проверки', body_style), Paragraph('Высокий', body_style)],
    [Paragraph('Schema.org разметка товаров', body_style), Paragraph('Частично', body_style), Paragraph('Средний', body_style)],
    [Paragraph('HTTPS сертификат', body_style), Paragraph('Сделано', body_style), Paragraph('Выполнено', body_style)],
    [Paragraph('Мобильная адаптация', body_style), Paragraph('Сделано', body_style), Paragraph('Выполнено', body_style)],
    [Paragraph('Страница «О нас» с экспертностью', body_style), Paragraph('Требует улучшения', body_style), Paragraph('Средний', body_style)],
    [Paragraph('Блог/статьи с советами', body_style), Paragraph('Не сделано', body_style), Paragraph('Средний', body_style)],
]

checklist_table = Table(checklist_data, colWidths=[8*cm, 4*cm, 3*cm])
checklist_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, -1), 'SimHei'),
    ('FONTSIZE', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))
story.append(checklist_table)

story.append(Spacer(1, 20))
story.append(Paragraph("Контент-стратегия", heading2_style))
story.append(Paragraph("Рекомендуемые статьи для блога:", body_style))
story.append(Paragraph("• «Как выбрать воздушные шары для свадьбы: полное руководство 2025»", bullet_style))
story.append(Paragraph("• «Цены на воздушные шары в Москве: что влияет на стоимость»", bullet_style))
story.append(Paragraph("• «Фотозона из шаров своими руками или заказать у профессионалов?»", bullet_style))
story.append(Paragraph("• «Сколько держатся воздушные шары: советы по уходу»", bullet_style))
story.append(Paragraph("• «ТОП-10 популярных композиций из шаров для детских праздников»", bullet_style))

story.append(Spacer(1, 15))
story.append(Paragraph("Что уже сделано на вашем сайте правильно:", heading2_style))
story.append(Paragraph("• Schema.org LocalBusiness разметка присутствует", bullet_style))
story.append(Paragraph("• Мета-теги title и description настроены", bullet_style))
story.append(Paragraph("• Структура URL логичная и понятная", bullet_style))
story.append(Paragraph("• Контактные данные указаны на всех страницах", bullet_style))
story.append(Paragraph("• Адаптивный дизайн для мобильных устройств", bullet_style))

# Conclusion
story.append(Spacer(1, 30))
story.append(Paragraph("Заключение", heading1_style))
story.append(Paragraph(
    "SEO и AIO — это не разовые работы, а постоянный процесс. Основные приоритеты для вашего бизнеса: "
    "регистрация в геосправочниках (Яндекс, 2ГИС, Google), накопление отзывов, создание экспертного контента. "
    "ИИ-ассистенты становятся важным каналом привлечения клиентов, и компании, которые позаботятся о своём присутствии "
    "в интернете сегодня, получат преимущество завтра. Ваш сайт уже имеет хорошую техническую базу — "
    "теперь важно нарастить контентную массу и репутацию на внешних площадках.",
    body_style
))

# Build
doc.build(story)
print("PDF создан: /home/z/my-project/download/SEO_AIO_Guide_2025.pdf")
