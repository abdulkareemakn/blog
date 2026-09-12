export async function searchPosts(query, limit = Infinity) {
  const pagefind = await import("/pagefind/pagefind.js");
  const found = await pagefind.search(query);
  return {
    total: found.results.length,
    items: await Promise.all(found.results.slice(0, limit).map((result) => result.data())),
  };
}

export function resultLink(item) {
  const link = document.createElement("a");
  link.href = item.url;
  link.className = "search-result";
  const title = document.createElement("span");
  title.className = "search-result-title";
  title.textContent = item.meta.title;
  const excerpt = document.createElement("span");
  excerpt.className = "search-result-meta";
  // Decode Pagefind's highlighted excerpt as text; never inject it into the page.
  excerpt.textContent = new DOMParser().parseFromString(item.excerpt, "text/html").body.textContent;
  link.append(title, excerpt);
  return link;
}
