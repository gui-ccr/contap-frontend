import { getDocsHtml } from "./docsData";

export async function GET() {
  const html = getDocsHtml();
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
