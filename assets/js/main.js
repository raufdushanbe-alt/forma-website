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



  // Орбитальная карусель PNG на первом экране
  const packs = window.FORMA_HERO_PACKS || { center: "", orbit: [] };
  const orbitStage = $("hero-orbit-stage");
  const orbitRing = $("hero-orbit-ring");
  const orbitCenter = $("hero-orbit-center");
  const orbitEmpty = $("hero-orbit-empty");

  const createPackImage = (src, className, alt) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = className;
    img.alt = alt;
    img.loading = "eager";
    img.addEventListener("load", () => orbitStage.classList.add("has-packs"));
    img.addEventListener("error", () => img.remove());
    return img;
  };

  if (packs.center) {
    orbitCenter.appendChild(createPackImage(packs.center, "hero-pack-center", "Главная упаковка"));
  }

  (packs.orbit || []).forEach((src, index, list) => {
    const slot = document.createElement("div");
    slot.className = "hero-orbit-slot";
    slot.style.setProperty("--index", index);
    slot.style.setProperty("--count", list.length);
    const counter = document.createElement("div");
    counter.className = "hero-pack-counter-rotate";
    counter.appendChild(createPackImage(src, "hero-pack-orbit", `Упаковка ${index + 1}`));
    slot.appendChild(counter);
    orbitRing.appendChild(slot);
  });

  if (packs.center || (packs.orbit && packs.orbit.length)) {
    orbitEmpty.hidden = true;
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
