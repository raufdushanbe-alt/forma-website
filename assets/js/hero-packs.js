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
  center: "assets/images/hero/pack-01.png",

  orbit: [
    "assets/images/hero/pack-02.png",
    "assets/images/hero/pack-03.png",
    "assets/images/hero/pack-04.png",
    "assets/images/hero/pack-05.png",
    "assets/images/hero/pack-06.png",
    "assets/images/hero/pack-07.png"
  ]
};
