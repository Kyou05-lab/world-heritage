import React, { useEffect, useMemo, useState } from "react";

// ---- Sample dataset (add/edit freely) ----
const SITES = [
  {
    id: "itsukushima-shrine",
    name: "厳島神社 (Itsukushima Shinto Shrine)",
    country: "Japan",
    region: "Asia-Pacific",
    type: "Cultural",
    year: 1996,
    image:
      "https://images.unsplash.com/photo-1559717201-fbb671ff56c1?q=80&w=1600&auto=format&fit=crop",
    short:
      "海に浮かぶ大鳥居で有名な神社。自然と信仰が一体となった景観が評価。",
    coords: { lat: 34.296, lng: 132.319 },
  },
  {
    id: "himeji-castle",
    name: "姫路城 (Himeji-jo)",
    country: "Japan",
    region: "Asia-Pacific",
    type: "Cultural",
    year: 1993,
    image:
      "https://images.unsplash.com/photo-1602510392878-3a7d1e2bb65a?q=80&w=1600&auto=format&fit=crop",
    short:
      "保存状態の良い日本の城郭建築。白鷺城の名で親しまれる。",
    coords: { lat: 34.839, lng: 134.693 },
  },
  {
    id: "machu-picchu",
    name: "Machu Picchu",
    country: "Peru",
    region: "Latin America",
    type: "Mixed",
    year: 1983,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1600&auto=format&fit=crop",
    short:
      "インカ帝国の歴史的聖地。文化価値と自然景観の双方で顕著な普遍的価値。",
    coords: { lat: -13.163, lng: -72.545 },
  },
  {
    id: "great-barrier-reef",
    name: "Great Barrier Reef",
    country: "Australia",
    region: "Asia-Pacific",
    type: "Natural",
    year: 1981,
    image:
      "https://images.unsplash.com/photo-1501820488136-72669149e0d4?q=80&w=1600&auto=format&fit=crop",
    short:
      "世界最大の珊瑚礁生態系。多様な海洋生物の重要な生息地。",
    coords: { lat: -18.287, lng: 147.699 },
  },
  {
    id: "acropolis",
    name: "Acropolis, Athens",
    country: "Greece",
    region: "Europe",
    type: "Cultural",
    year: 1987,
    image:
      "https://images.unsplash.com/photo-1549897161-4498e07ba4f8?q=80&w=1600&auto=format&fit=crop",
    short:
      "古代ギリシア文明を象徴するパルテノン神殿などの遺跡群。",
    coords: { lat: 37.9715, lng: 23.7267 },
  },
  {
    id: "serengeti",
    name: "Serengeti National Park",
    country: "Tanzania",
    region: "Africa",
    type: "Natural",
    year: 1981,
    image:
      "https://images.unsplash.com/photo-1543248939-ecbd5a9cca80?q=80&w=1600&auto=format&fit=crop",
    short:
      "ヌーやシマウマの大移動で知られるサバンナ生態系。",
    coords: { lat: -2.333, lng: 34.833 },
  },
];

const TYPES = ["Cultural", "Natural", "Mixed"];

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function SiteCard({ site, onOpen, onToggleFav, fav }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/20 bg-white/70 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60">
      <img
        src={site.image}
        alt={site.name}
        className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
        loading="lazy"
      />
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold leading-tight text-slate-900 dark:text-slate-50">
            {site.name}
          </h3>
          <span
            className={classNames(
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              site.type === "Cultural" && "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200",
              site.type === "Natural" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
              site.type === "Mixed" && "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200"
            )}
          >
            {site.type}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{site.short}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="rounded-full border border-slate-300/60 px-2 py-0.5 dark:border-white/10">
            {site.country}
          </span>
          <span className="rounded-full border border-slate-300/60 px-2 py-0.5 dark:border-white/10">
            {site.region}
          </span>
          <span className="rounded-full border border-slate-300/60 px-2 py-0.5 dark:border-white/10">
            Inscribed {site.year}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => onOpen(site)}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Learn more
          </button>
          <button
            onClick={() => onToggleFav(site.id)}
            className={classNames(
              "rounded-xl border px-3 py-2 text-sm font-semibold transition",
              fav
                ? "border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-200"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/5"
            )}
            aria-pressed={fav}
          >
            {fav ? "Bookmarked" : "Bookmark"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ site, onClose }) {
  if (!site) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
      <div className="relative m-2 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <img src={site.image} alt="" className="h-60 w-full object-cover" />
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{site.name}</h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {site.country} • {site.region} • {site.type} • {site.year}
            </span>
          </div>
          <p className="mt-3 text-slate-700 dark:text-slate-300">
            {site.short}
          </p>

          <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Coordinates
              </div>
              <div className="mt-1">{site.coords.lat}, {site.coords.lng}</div>
            </div>
            <a
              href={`https://www.google.com/maps?q=${site.coords.lat},${site.coords.lng}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-200 p-3 text-sky-700 underline underline-offset-4 hover:bg-sky-50 dark:border-white/10 dark:text-sky-300 dark:hover:bg-white/5"
            >
              Open in Google Maps →
            </a>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState([]); // empty = all
  const [country, setCountry] = useState("All");
  const [sort, setSort] = useState("name");
  const [open, setOpen] = useState(null);
  const [favs, setFavs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wh-favs") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wh-favs", JSON.stringify(favs));
  }, [favs]);

  const countries = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(SITES.map((s) => s.country))).sort((a, b) =>
        a.localeCompare(b)
      ),
    ];
  }, []);

  const filtered = useMemo(() => {
    let list = SITES.filter((s) =>
      [s.name, s.country, s.region, s.type].some((v) =>
        v.toLowerCase().includes(query.toLowerCase())
      )
    );
    if (types.length) list = list.filter((s) => types.includes(s.type));
    if (country !== "All") list = list.filter((s) => s.country === country);

    list = list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "year") return a.year - b.year;
      if (sort === "country") return a.country.localeCompare(b.country);
      return 0;
    });
    return list;
  }, [query, types, country, sort]);

  function toggleType(t) {
    setTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  function toggleFav(id) {
    setFavs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white p-5 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:text-slate-50">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="sticky top-0 z-40 -mx-5 mb-4 border-b border-slate-200/60 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/40">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gradient-to-tr from-sky-400 to-cyan-300 ring-4 ring-cyan-200/30 dark:ring-cyan-400/20" />
              <span className="text-sm font-bold tracking-wide">World Heritage Explorer</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <a
                className="rounded-lg border border-slate-300 px-2 py-1 font-semibold hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                href="#favorites"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById("favorites");
                  target?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Favorites ({favs.length})
              </a>
              <a
                className="rounded-lg border border-slate-300 px-2 py-1 font-semibold hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                href="https://whc.unesco.org/en/list/"
                target="_blank"
                rel="noreferrer"
              >
                UNESCO List ↗
              </a>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="mb-6 grid gap-4 sm:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/50">
            <p className="mb-2 inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              Curate & learn about UNESCO World Heritage Sites
            </p>
            <h1 className="text-2xl font-black leading-tight sm:text-4xl">
              世界遺産紹介サイト <span className="text-sky-600">(Demo)</span>
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              検索 / 絞り込み / 並び替え / お気に入り保存（ローカル）に対応。カードをクリックして詳細を表示。データは下の配列 <code>SITES</code> を編集して増やせます。
            </p>

            {/* Controls */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  キーワード検索
                </label>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="名称 / 国 / 地域 / 種別"
                  className="w-full rounded-xl border border-slate-300/70 bg-white/70 px-3 py-2 outline-none ring-cyan-300/30 transition focus:ring-4 dark:border-white/10 dark:bg-slate-900/60"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  種別フィルタ
                </label>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleType(t)}
                      className={classNames(
                        "rounded-xl border px-3 py-2 text-sm font-semibold",
                        types.includes(t)
                          ? "border-sky-400 bg-sky-50 text-sky-700 dark:border-sky-300/40 dark:bg-sky-300/10 dark:text-sky-200"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/5"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  国・地域
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-slate-300/70 bg-white/70 px-3 py-2 outline-none ring-cyan-300/30 transition focus:ring-4 dark:border-white/10 dark:bg-slate-900/60"
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  並び替え
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full rounded-xl border border-slate-300/70 bg-white/70 px-3 py-2 outline-none ring-cyan-300/30 transition focus:ring-4 dark:border-white/10 dark:bg-slate-900/60"
                >
                  <option value="name">名称 (A→Z)</option>
                  <option value="year">登録年 (古い順)</option>
                  <option value="country">国名 (A→Z)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/60 bg-gradient-to-br from-sky-100 via-white to-cyan-50 p-6 shadow-sm dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">お気に入りの書き出し</h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              ブックマークしたID一覧をコピーできます。別ページの共有や保存にどうぞ。
            </p>
            <textarea
              readOnly
              value={JSON.stringify(favs, null, 2)}
              className="mt-3 h-36 w-full rounded-xl border border-slate-300/70 bg-white/70 p-3 text-xs font-mono leading-relaxed dark:border-white/10 dark:bg-slate-900/60"
            />
          </div>
        </section>

        {/* Grid */}
        <section>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-white/10 dark:text-slate-400">
              条件に一致する世界遺産が見つかりませんでした。キーワードや条件を調整してください。
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => (
                <SiteCard
                  key={s.id}
                  site={s}
                  onOpen={setOpen}
                  onToggleFav={toggleFav}
                  fav={favs.includes(s.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Favorites section */}
        <section id="favorites" className="mt-10">
          <h2 className="mb-3 text-lg font-bold">Favorites</h2>
          {favs.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">まだブックマークがありません。カードの「Bookmark」を押すと追加されます。</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SITES.filter((s) => favs.includes(s.id)).map((s) => (
                <SiteCard
                  key={s.id}
                  site={s}
                  onOpen={setOpen}
                  onToggleFav={toggleFav}
                  fav
                />
              ))}
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-slate-200/60 py-6 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          © {new Date().getFullYear()} World Heritage Explorer • Demo dataset. Images via Unsplash.
        </footer>
      </div>

      <Detail site={open} onClose={() => setOpen(null)} />
    </div>
  );
}
