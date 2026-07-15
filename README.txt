FORMA WEBSITE v2

Редактировать нужно в основном два файла:

1. assets/js/content.js
   Контакты, главный заголовок, описание и цены.

2. assets/js/portfolio.js
   Список работ портфолио.

КАК ДОБАВИТЬ РАБОТУ

1. В GitHub откройте assets/images/portfolio/
2. Нажмите Add file → Upload files
3. Загрузите изображение
4. Откройте assets/js/portfolio.js
5. Добавьте:

{ brand: "Название бренда", image: "assets/images/portfolio/имя-файла.jpg" },

6. Нажмите Commit changes

Сайт показывает первые 8 работ. Кнопка «Показать еще» открывает еще по 4.
Размер и пропорции изображения определяются автоматически.
Название бренда располагается внутри картинки на нижнем градиенте.

КОНТАКТЫ

В assets/js/content.js замените:
whatsappNumber: "992000000000"
telegramUsername: "yourstudio"
email: "hello@yourstudio.com"

WhatsApp: номер без +, пробелов и скобок.

PNG-КАРУСЕЛЬ НА ПЕРВОМ ЭКРАНЕ

1. Загрузите PNG упаковок с прозрачным фоном в:
   assets/images/hero/
2. Откройте:
   assets/js/hero-packs.js
3. В center укажите центральную упаковку.
4. В orbit перечислите остальные PNG.
5. Карусель вращается автоматически, а упаковки остаются вертикальными.

AI-TO-PRINT ИЗОБРАЖЕНИЯ

В assets/js/content.js заполните:
  aiToPrint: {
    beforeImage: "assets/images/...",
    afterImage: "assets/images/..."
  }
