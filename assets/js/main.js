document.addEventListener("DOMContentLoaded", () => {
  const c = window.FORMA_CONTENT;
  const works = window.FORMA_PORTFOLIO || [];

  const $ = (id) => document.getElementById(id);
  const setText = (id, value) => { const el = $(id); if (el) el.textContent = value; };

  setText("studio-name", c.studioName);
  setText("footer-studio-name", c.studioName);
  setText("footer-location", c.contacts.location);
  setText("hero-eyebrow", c.hero.eyebrow);
  $("hero-title").innerHTML = `${c.hero.titleBefore}<span class="gradient-text">${c.hero.titleAccent}</span>${c.hero.titleAfter}`;
  setText("hero-description", c.hero.description);
  setText("hero-primary", c.hero.primaryButton);
  setText("hero-secondary", c.hero.secondaryButton);
  setText("portfolio-eyebrow", c.portfolio.eyebrow);
  setText("portfolio-title", c.portfolio.title);
  setText("portfolio-description", c.portfolio.description);
  setText("load-more", c.portfolio.loadMoreButton);
  setText("full-price", c.pricing.fullPrice);
  setText("ai-price", c.pricing.aiPrice);
  setText("contact-email-text", c.contacts.email);

  const whatsapp = `https://wa.me/${c.contacts.whatsappNumber}`;
  const telegram = `https://t.me/${c.contacts.telegramUsername}`;
  const email = `mailto:${c.contacts.email}`;
  document.querySelectorAll("[data-whatsapp]").forEach(a => a.href = whatsapp);
  document.querySelectorAll("[data-telegram]").forEach(a => a.href = telegram);
  document.querySelectorAll("[data-email]").forEach(a => a.href = email);



  // Hero showcase: главный продукт спереди, остальные позади.
  const packs = window.FORMA_HERO_PACKS || { center: "", orbit: [] };
  const stage = $("hero-orbit-stage");
  const ring = $("hero-orbit-ring");
  const empty = $("hero-orbit-empty");

  const packSources = [packs.center, ...(packs.orbit || [])]
    .filter(Boolean)
    .slice(0, 8);

  const desktopLayouts = [
    { x:"0%",   y:"15%",  scale:1.00, rotate:"0deg",   opacity:1,    z:10, blur:"0px", shadow:.24 },
    { x:"-44%", y:"0%",   scale:.76, rotate:"-3deg",  opacity:.96,  z:7,  blur:"0px", shadow:.17 },
    { x:"43%",  y:"1%",   scale:.74, rotate:"3deg",   opacity:.95,  z:7,  blur:"0px", shadow:.17 },
    { x:"-61%", y:"-29%", scale:.56, rotate:"-5deg",  opacity:.88,  z:5,  blur:".15px", shadow:.13 },
    { x:"60%",  y:"-28%", scale:.55, rotate:"5deg",   opacity:.87,  z:5,  blur:".15px", shadow:.13 },
    { x:"-30%", y:"-48%", scale:.46, rotate:"-2deg",  opacity:.80,  z:3,  blur:".35px", shadow:.10 },
    { x:"30%",  y:"-48%", scale:.45, rotate:"2deg",   opacity:.79,  z:3,  blur:".35px", shadow:.10 },
    { x:"0%",   y:"-57%", scale:.40, rotate:"0deg",   opacity:.72,  z:2,  blur:".55px", shadow:.08 }
  ];

  const mobileLayouts = [
    { x:"0%",   y:"17%",  scale:1.00, rotate:"0deg",  opacity:1,   z:10, blur:"0px", shadow:.23 },
    { x:"-40%", y:"1%",   scale:.70, rotate:"-3deg", opacity:.94, z:7,  blur:"0px", shadow:.15 },
    { x:"40%",  y:"2%",   scale:.68, rotate:"3deg",  opacity:.93, z:7,  blur:"0px", shadow:.15 },
    { x:"-54%", y:"-31%", scale:.49, rotate:"-5deg", opacity:.83, z:4,  blur:".2px", shadow:.10 },
    { x:"54%",  y:"-30%", scale:.48, rotate:"5deg",  opacity:.82, z:4,  blur:".2px", shadow:.10 },
    { x:"-24%", y:"-49%", scale:.40, rotate:"-2deg", opacity:.72, z:2,  blur:".4px", shadow:.07 },
    { x:"24%",  y:"-49%", scale:.39, rotate:"2deg",  opacity:.71, z:2,  blur:".4px", shadow:.07 },
    { x:"0%",   y:"-58%", scale:.34, rotate:"0deg",  opacity:.64, z:1,  blur:".6px", shadow:.05 }
  ];

  const productNodes = [];
  let activeIndex = 0;

  const getLayouts = () =>
    window.matchMedia("(max-width: 640px)").matches
      ? mobileLayouts
      : desktopLayouts;

  const setLayout = (node, layout, isMain, orderIndex) => {
    node.style.setProperty("--x", layout.x);
    node.style.setProperty("--y", layout.y);
    node.style.setProperty("--scale", layout.scale);
    node.style.setProperty("--rotate", layout.rotate);
    node.style.setProperty("--opacity", layout.opacity);
    node.style.setProperty("--z", layout.z);
    node.style.setProperty("--blur", layout.blur);
    node.style.setProperty("--shadow", layout.shadow);
    node.style.setProperty("--delay", `${orderIndex * 80}ms`);
    node.classList.toggle("is-main", isMain);
  };

  const updateShowcase = (withEntrance = false) => {
    const layouts = getLayouts();

    productNodes.forEach((node, originalIndex) => {
      const relativeIndex =
        (originalIndex - activeIndex + productNodes.length) % productNodes.length;
      const layout = layouts[relativeIndex] || layouts[layouts.length - 1];

      setLayout(node, layout, relativeIndex === 0, relativeIndex);

      if (withEntrance) {
        node.classList.remove("is-entering");
        void node.offsetWidth;
        node.classList.add("is-entering");
      } else {
        node.classList.remove("is-entering");
      }
    });
  };

  packSources.forEach((src, index) => {
    const node = document.createElement("div");
    node.className = "hero-product";

    const image = document.createElement("img");
    image.src = src;
    image.alt = index === 0 ? "Главная упаковка" : `Упаковка ${index + 1}`;
    image.loading = "eager";
    image.decoding = "async";

    image.addEventListener("load", () => {
      stage.classList.add("has-packs");
    });

    image.addEventListener("error", () => {
      const nodeIndex = productNodes.indexOf(node);
      if (nodeIndex >= 0) productNodes.splice(nodeIndex, 1);
      node.remove();
      updateShowcase();
    });

    node.appendChild(image);
    ring.appendChild(node);
    productNodes.push(node);
  });

  if (productNodes.length) {
    empty.hidden = true;
    updateShowcase(true);

    if (
      productNodes.length > 1 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      window.setInterval(() => {
        activeIndex = (activeIndex + 1) % productNodes.length;
        updateShowcase(false);
      }, 4600);
    }

    window.addEventListener("resize", () => updateShowcase(false));
  }

  // Изображения AI-to-Print: прозрачный фон после загрузки
  const loadOptionalImage = (imageId, boxId, src) => {
    const image = $(imageId);
    const box = $(boxId);
    if (!image || !box || !src) return;
    image.src = src;
    image.hidden = false;
    image.addEventListener("load", () => box.classList.add("has-image"));
    image.addEventListener("error", () => {
      image.hidden = true;
      box.classList.remove("has-image");
    });
  };
  if (c.aiToPrint) {
    loadOptionalImage("ai-before-image", "ai-before-box", c.aiToPrint.beforeImage);
    loadOptionalImage("ai-after-image", "ai-after-box", c.aiToPrint.afterImage);
  }

  const grid = $("portfolio-grid");
  const button = $("load-more");
  let visible = 0;
  const render = (amount) => {
    works.slice(visible, visible + amount).forEach(item => {
      const card = document.createElement("article");
      card.className = "portfolio-card reveal";
      card.innerHTML = `
        <img src="${item.image}" alt="Дизайн упаковки ${item.brand}" loading="lazy">
        <div class="portfolio-fallback">Загрузите изображение</div>
        <div class="portfolio-overlay"><h3>${item.brand}</h3></div>`;
      const image = card.querySelector("img");
      image.addEventListener("load", () => card.classList.add("has-image"));
      image.addEventListener("error", () => {
        image.hidden = true;
        card.classList.add("image-missing");
      });
      grid.appendChild(card);
    });
    visible = Math.min(visible + amount, works.length);
    if (visible >= works.length) button.hidden = true;
    reveal();
  };
  button.addEventListener("click", () => render(4));
  render(8);
  reveal();
});

function reveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal:not(.visible)").forEach(el => observer.observe(el));
}
