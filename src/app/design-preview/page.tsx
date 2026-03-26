export default function DesignPreview() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-[#264348] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            🎨 Дизайн-концепция
          </h1>
          <p className="text-[#6B4E71] text-lg">
            Японский минимализм премиум-класса
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-[#264348] text-white rounded-full text-sm">
            Маркет Шоу — новый дизайн
          </div>
        </header>

        {/* Color Palette */}
        <section className="mb-12">
          <h2 className="text-xl text-[#264348] mb-4 font-medium">Цветовая палитра</h2>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="/design/color-palette-concept.png" 
              alt="Цветовая палитра" 
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            <div className="text-center">
              <div className="w-full aspect-square rounded-xl bg-[#264348] mb-2"></div>
              <span className="text-xs text-gray-600">Japan Blue</span>
            </div>
            <div className="text-center">
              <div className="w-full aspect-square rounded-xl bg-[#C9A962] mb-2"></div>
              <span className="text-xs text-gray-600">Gold</span>
            </div>
            <div className="text-center">
              <div className="w-full aspect-square rounded-xl bg-[#6B4E71] mb-2"></div>
              <span className="text-xs text-gray-600">Purple</span>
            </div>
            <div className="text-center">
              <div className="w-full aspect-square rounded-xl bg-[#D4A5A5] mb-2"></div>
              <span className="text-xs text-gray-600">Coral</span>
            </div>
            <div className="text-center">
              <div className="w-full aspect-square rounded-xl bg-[#FAFAF8] border mb-2"></div>
              <span className="text-xs text-gray-600">Cream</span>
            </div>
          </div>
        </section>

        {/* Hero Concept */}
        <section className="mb-12">
          <h2 className="text-xl text-[#264348] mb-4 font-medium">Hero-секция</h2>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="/design/hero-concept.png" 
              alt="Hero секция" 
              className="w-full"
            />
          </div>
          <p className="text-gray-500 text-sm mt-3">
            ✓ Enso-круг как декоративный элемент<br/>
            ✓ Много воздуха (принцип Ma)<br/>
            ✓ Золотая CTA-кнопка
          </p>
        </section>

        {/* Overall Design */}
        <section className="mb-12">
          <h2 className="text-xl text-[#264348] mb-4 font-medium">Общий вид сайта</h2>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="/design/design-concept.png" 
              alt="Общая концепция" 
              className="w-full"
            />
          </div>
          <p className="text-gray-500 text-sm mt-3">
            ✓ Минималистичная навигация<br/>
            ✓ Glass-эффекты с blur<br/>
            ✓ Асимметричная композиция
          </p>
        </section>

        {/* Product Card */}
        <section className="mb-12">
          <h2 className="text-xl text-[#264348] mb-4 font-medium">Карточка товара</h2>
          <div className="rounded-2xl overflow-hidden shadow-lg max-w-xs mx-auto">
            <img 
              src="/design/product-card-concept.png" 
              alt="Карточка товара" 
              className="w-full"
            />
          </div>
          <p className="text-gray-500 text-sm mt-3 text-center">
            ✓ Много белого пространства<br/>
            ✓ Золотые акценты<br/>
            ✓ Seigaiha паттерн
          </p>
        </section>

        {/* Summary */}
        <section className="bg-[#264348] rounded-2xl p-6 text-white">
          <h2 className="text-xl mb-4 font-medium">Ключевые изменения</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="text-[#C9A962] mb-2">Цвета</h3>
              <ul className="space-y-1 opacity-90">
                <li>• Розовый → Japan Blue</li>
                <li>• Акцент → Золотой</li>
                <li>• Фон → Кремовый</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#C9A962] mb-2">Дизайн</h3>
              <ul className="space-y-1 opacity-90">
                <li>• Enso-круг как логотип</li>
                <li>• Seigaiha паттерн</li>
                <li>• Больше воздуха</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-400 text-sm">
          <p>Если нравится — реализуем! 🚀</p>
        </footer>
      </div>
    </main>
  );
}
