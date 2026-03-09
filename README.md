# Psychologist Portfolio Website

A modern, responsive portfolio website for a psychologist.

## Features

- Sticky navigation bar with active link highlighting
- Hero section with portrait and welcome message
- About section and methods section
- Client benefits and review carousel
- Blog section with category filters and sorting
- Full article page (`post.html`) opened from `Read more`
- Smooth scrolling and reveal-on-scroll animations
- Mobile-friendly responsive layout
- SEO-friendly meta tags

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- JSON data source for blog posts (`posts.json`)

## Project Structure

- `index.html` - Main landing page
- `style.css` - Site styles
- `script.js` - Main page interactions and blog rendering
- `posts.json` - Blog data source
- `post.html` - Full article template page
- `post.js` - Full article page logic
- `assets/` - Images and media files

## How Blog Content Works

All blog cards and full article pages are generated from `posts.json`.

Each post object should follow this format:

```json
{
  "id": "unique-post-id",
  "title": "Post title",
  "description": "Short preview text",
  "category": "Category",
  "date": "2026-03-09",
  "content": ["Paragraph 1", "Paragraph 2"]
}
```

## Running Locally

Use a local server (recommended), because `fetch()` is used to load `posts.json`.

Example with VS Code Live Server:

1. Open the project folder.
2. Start Live Server on `index.html`.
3. Open the generated localhost URL.

Or with Node.js:

```bash
npx serve .
```

## Notes

- To add, edit, or remove blog posts, update `posts.json`.
- Make sure every post has a unique `id`.
- The `Read more` link uses `post.html?id=...` and must match that `id`.
