export const revalidate = 300;
export const runtime = "nodejs";

const EVENTO_BASE = "https://evento.so";
const API_BASE = `${EVENTO_BASE}/api/public/v1`;
const CDN_BASE = "https://api.evento.so/storage/v1/object/public/cdn";

interface RawEvent {
  id: string;
  title: string;
  description: string;
  cover: string | null;
  location: string | null;
  start_date: string | null;
  status: string;
}

interface RawResponse {
  success: boolean;
  data: { events: RawEvent[]; pagination: { total: number } };
}

export interface ApiEventItem {
  category: string;
  title: string;
  description: string;
  location: string;
  start_date: string | null;
  image: string;
  href: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function coverUrl(cover: string | null): string {
  if (!cover) return "/events/gallery/image.png";
  if (cover.startsWith("http")) return cover;
  const path = cover.startsWith("/") ? cover.slice(1) : cover;
  return `${CDN_BASE}/${path}`;
}

function toApiItem(e: RawEvent): ApiEventItem {
  return {
    category: "Casa21",
    title: e.title,
    description: stripHtml(e.description),
    location: e.location ?? "São Paulo",
    start_date: e.start_date,
    image: coverUrl(e.cover),
    href: `https://app.evento.so/e/${e.id}`,
  };
}

export async function GET(request: Request) {
  const apiKey = process.env.EVENTO_SO_API_KEY;
  const username = process.env.EVENTO_SO_USERNAME ?? "casa21";

  if (!apiKey) {;
    return Response.json({ error: "EVENTO_SO_API_KEY not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "upcoming";
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10));

  const res = await fetch(`${API_BASE}/users/${username}/events?limit=100`, {
    headers: { "x-evento-api-key": apiKey },
  });

  if (!res.ok) {
    return Response.json({ error: "Upstream API error" }, { status: 502 });
  }

  const json: RawResponse = await res.json();
  const now = new Date();

  const published = json.data.events.filter((e) => e.status === "published");

  let filtered: RawEvent[];

  if (type === "past") {
    filtered = published
      .filter((e) => e.start_date !== null && new Date(e.start_date) < now)
      .sort((a, b) => new Date(b.start_date!).getTime() - new Date(a.start_date!).getTime());
  } else {
    filtered = published
      .filter((e) => e.start_date === null || new Date(e.start_date) >= now)
      .sort((a, b) => {
        if (!a.start_date) return 1;
        if (!b.start_date) return -1;
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      });
  }

  const total = filtered.length;
  const items = filtered.slice(offset, offset + limit).map(toApiItem);

  return Response.json({ items, total });
}
