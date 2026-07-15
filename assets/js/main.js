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

  if (c.hero.image) {
    const img = $("hero-image");
    img.src = c.hero.image;
    img.hidden = false;
    $("hero-placeholder").hidden = true;
  }

  const grid = $("portfolio-grid");
  const button = $("load-more");
  let visible = 0;
  const render = (amount) => {
    works.slice(visible, visible + amount).forEach(item => {
      const card = document.createElement("article");
      card.className = "portfolio-card reveal";
      card.innerHTML = `
        <img src="${item.image}" alt="Дизайн упаковки ${item.brand}" loading="lazy"
          onerror="this.style.display='none';this.parentElement.classList.add('image-missing')">
        <div class="portfolio-fallback">Загрузите изображение</div>
        <div class="portfolio-overlay"><h3>${item.brand}</h3></div>`;
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
