/* =========================================================
   FORMA — УПАКОВКИ НА ПЕРВОМ ЭКРАНЕ

   center — первая главная упаковка.
   orbit — остальные упаковки, которые появляются позади.

   Можно использовать до 8 PNG-файлов суммарно.
   Каждые 4.6 секунды следующая упаковка становится главной.

   Как заменить:
   1. Загрузите PNG с прозрачным фоном в assets/images/hero/
   2. Замените пути ниже.
========================================================= */

window.FORMA_HERO_PACKS = {
  center: "assets/images/hero/162.png",

  orbit: [
    "assets/images/hero/163.png",
    "assets/images/hero/164.png",
    "assets/images/hero/165.png",
    "assets/images/hero/166.png",
    "assets/images/hero/167.png",
    "assets/images/hero/168.png"
  ]
};
