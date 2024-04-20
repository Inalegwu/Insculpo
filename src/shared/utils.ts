import type { CheerioAPI } from "cheerio";

export function debounce<A = unknown[], R = void>(
  fn: (args: A) => R,
  ms: number,
): [(args: A) => Promise<R>, () => void] {
  let t: NodeJS.Timeout;

  const debouncedFn = (args: A): Promise<R> =>
    new Promise((resolve) => {
      if (t) {
        clearTimeout(t);
      }

      t = setTimeout(() => {
        resolve(fn(args));
      }, ms);
    });

  const tearDown = () => clearTimeout(t);

  return [debouncedFn, tearDown];
}

export function formatTextForSidebar(text: string) {
  return text.replace(/[^a-zA-Z0-9' ]/gi, "");
}

export function extractOGTag(html: CheerioAPI) {
  const title =
    html('meta[property="og:title"]').attr("content") ||
    html("title").text() ||
    html('meta[name="title"]').attr("content");
  const description =
    html('meta[property="og:description"]').attr("content") ||
    html('meta[name="description"]').attr("content");

  const url = html('meta[property="og:url"]').attr("content");
  const site_name = html('meta[property="og:site_name"]').attr("content");
  const image =
    html('meta[property="og:image"]').attr("content") ||
    html('meta[property="og:image:url"]').attr("content");
  const icon =
    html('link[rel="icon"]').attr("href") ||
    html('link[rel="shortcut icon"]').attr("href");
  const keywords =
    html('meta[property="og:keywords"]').attr("content") ||
    html('meta[name="keywords"]').attr("content");

  return {
    title,
    description,
    url,
    site_name,
    image,
    icon,
    keywords,
  };
}
