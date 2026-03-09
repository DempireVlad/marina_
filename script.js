const reviews = [
  {
    text: "Після кількох зустрічей стало легше засинати й не накручувати себе. З'явилась ясність і спокій.",
    author: "Ольга, 29 років",
  },
  {
    text: "Навчилась говорити про свої потреби без почуття провини. Стосунки вдома стали теплішими.",
    author: "Ірина, 34 роки",
  },
  {
    text: "Нарешті зрозумів, як працювати з тривогою в робочих ситуаціях. Паніки стало значно менше.",
    author: "Світлана, 31 рік",
  },
];

let posts = [];

let currentReview = 0;
let currentCategory = "Всі";

const reviewTextEl = document.getElementById("review-text");
const reviewAuthorEl = document.getElementById("review-author");
const prevReviewBtn = document.getElementById("prev-review");
const nextReviewBtn = document.getElementById("next-review");

const filtersEl = document.getElementById("category-filters");
const sortSelectEl = document.getElementById("sort-select");
const blogListEl = document.getElementById("blog-list");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderReview() {
  const review = reviews[currentReview];
  reviewTextEl.textContent = `“${review.text}”`;
  reviewAuthorEl.textContent = review.author;
}

function nextReview() {
  currentReview = (currentReview + 1) % reviews.length;
  renderReview();
}

function prevReview() {
  currentReview = (currentReview - 1 + reviews.length) % reviews.length;
  renderReview();
}

function renderCategoryFilters() {
  const categories = ["Всі", ...new Set(posts.map((post) => post.category))];

  filtersEl.innerHTML = categories
    .map(
      (category) =>
        `<button class="filter-btn ${category === currentCategory ? "active" : ""}" data-category="${category}">${category}</button>`,
    )
    .join("");
}

function setupCategoryFilters() {
  renderCategoryFilters();

  filtersEl.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    currentCategory = target.dataset.category || "Всі";
    renderCategoryFilters();
    renderPosts();
  });
}

async function loadPosts() {
  try {
    const response = await fetch("./posts.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load posts");
    }

    const data = await response.json();
    posts = Array.isArray(data) ? data : [];
  } catch (error) {
    posts = [];
  }
}

function sortPosts(list) {
  const selectedSort = sortSelectEl.value;
  const cloned = [...list];

  if (selectedSort === "title") {
    return cloned.sort((a, b) => a.title.localeCompare(b.title, "uk"));
  }

  if (selectedSort === "oldest") {
    return cloned.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  return cloned.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderPosts() {
  const byCategory =
    currentCategory === "Всі"
      ? posts
      : posts.filter((post) => post.category === currentCategory);

  const sorted = sortPosts(byCategory);

//   if (sorted.length === 0) {
//     blogListEl.innerHTML =
//       '<article class="blog-card"><h3>Постів поки немає</h3><p>Додайте статтю в файл posts.json, і вона з\'явиться тут.</p></article>';
//     return;
//   }

  blogListEl.innerHTML = sorted
    .map(
      (post) => `
      <article class="blog-card">
        <p class="blog-meta">${escapeHtml(post.category)} · ${new Date(post.date).toLocaleDateString("uk-UA")}</p>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.description)}</p>
        <a href="./post.html?id=${encodeURIComponent(post.id)}" aria-label="Читати статтю: ${escapeHtml(post.title)}">Читати повністю →</a>
      </article>
    `,
    )
    .join("");
}

function setupActiveNav() {
  const sections = [
    document.getElementById("home"),
    document.getElementById("blog"),
    document.getElementById("contacts"),
  ];
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = entry.target.id;
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          link.classList.toggle("active", href === `#${id}`);
        });
      });
    },
    { threshold: 0.45 },
  );

  sections.forEach((section) => section && observer.observe(section));
}

function setupRevealAnimation() {
  const revealItems = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

prevReviewBtn.addEventListener("click", prevReview);
nextReviewBtn.addEventListener("click", nextReview);
sortSelectEl.addEventListener("change", renderPosts);

async function init() {
  renderReview();
  await loadPosts();
  setupCategoryFilters();
  renderPosts();
  setupActiveNav();
  setupRevealAnimation();
}

init();
