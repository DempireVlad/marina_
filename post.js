const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

const articleMetaEl = document.getElementById("article-meta");
const articleTitleEl = document.getElementById("article-title");
const articleContentEl = document.getElementById("article-content");

function renderMissingPost() {
  articleMetaEl.textContent = "Статтю не знайдено";
  articleTitleEl.textContent =
    "Цю статтю ще не опубліковано або її було видалено";
  articleContentEl.textContent = "";
  const paragraphEl = document.createElement("p");
  paragraphEl.textContent = "Спробуйте повернутися до списку блогу та обрати інший матеріал.";
  articleContentEl.append(paragraphEl);
}

function renderPost(post) {
  articleMetaEl.textContent = `${post.category} · ${new Date(post.date).toLocaleDateString("uk-UA")}`;
  articleTitleEl.textContent = post.title;

  articleContentEl.textContent = "";
  post.content.forEach((paragraph) => {
    const paragraphEl = document.createElement("p");
    paragraphEl.textContent = paragraph;
    articleContentEl.append(paragraphEl);
  });

  document.title = `${post.title} | Психолог Олена Коваль`;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute("content", post.description);
  }
}

async function loadPosts() {
  const response = await fetch("./posts.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load posts");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

async function initArticle() {
  if (!postId) {
    renderMissingPost();
    return;
  }

  try {
    const posts = await loadPosts();
    const foundPost = posts.find((post) => post.id === postId);

    if (!foundPost) {
      renderMissingPost();
      return;
    }

    renderPost(foundPost);
  } catch (error) {
    renderMissingPost();
  }
}

initArticle();
