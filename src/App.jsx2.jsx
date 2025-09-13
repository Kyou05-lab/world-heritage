import React, { useEffect, useMemo, useState } from "react";
import { whImages } from "./assets/whImages";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet のマーカー画像対策（Vite で必須）
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ------------------------------------------------------------
// デモ用データセット（画像はできるだけ upload.wikimedia の直リンク/サムネを使用）
// ------------------------------------------------------------
const SITES = [
  {
    id: "itsukushima-shrine",
    slug: "itsukushima_shrine",
    name_ja: "厳島神社",
    name_en: "Itsukushima Shinto Shrine",
    country_ja: "日本",
    country_en: "Japan",
    region_ja: "アジア太平洋",
    region_en: "Asia-Pacific",
    type: "Cultural",
    year: 1996,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Itsukushima_torii_2020.jpg/1600px-Itsukushima_torii_2020.jpg",
    short:
      "海に浮かぶ大鳥居で有名な神社。自然と信仰が一体となった景観が評価。",
    coords: { lat: 34.296, lng: 132.319 },
  },
  {
    id: "himeji-castle",
    slug: "himeji_castle",
    name_ja: "姫路城",
    name_en: "Himeji-jo",
    country_ja: "日本",
    country_en: "Japan",
    region_ja: "アジア太平洋",
    region_en: "Asia-Pacific",
    type: "Cultural",
    year: 1993,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Himeji_Castle_in_May_2015.jpg/1600px-Himeji_Castle_in_May_2015.jpg",
    short: "保存状態の良い日本の城郭建築。白鷺城の名で親しまれる。",
    coords: { lat: 34.839, lng: 134.693 },
  },
  {
    id: "machu-picchu",
    slug: "machu_picchu",
    name_ja: "マチュ・ピチュ",
    name_en: "Machu Picchu",
    country_ja: "ペルー",
    country_en: "Peru",
    region_ja: "ラテンアメリカ",
    region_en: "Latin America",
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
    slug: "great_barrier_reef",
    name_ja: "グレート・バリア・リーフ",
    name_en: "Great Barrier Reef",
    country_ja: "オーストラリア",
    country_en: "Australia",
    region_ja: "アジア太平洋",
    region_en: "Asia-Pacific",
    type: "Natural",
    year: 1981,
    image:
      "https://images.unsplash.com/photo-1501820488136-72669149e0d4?q=80&w=1600&auto=format&fit=crop",
    short: "世界最大の珊瑚礁生態系。多様な海洋生物の重要な生息地。",
    coords: { lat: -18.287, lng: 147.699 },
  },
  {
    id: "acropolis",
    slug: "acropolis_athens",
    name_ja: "アテネのアクロポリス",
    name_en: "Acropolis, Athens",
    country_ja: "ギリシャ",
    country_en: "Greece",
    region_ja: "ヨーロッパ",
    region_en: "Europe",
    type: "Cultural",
    year: 1987,
    image:
      "https://images.unsplash.com/photo-1549897161-4498e07ba4f8?q=80&w=1600&auto=format&fit=crop",
    short: "古代ギリシア文明を象徴するパルテノン神殿などの遺跡群。",
    coords: { lat: 37.9715, lng: 23.7267 },
  },
  {
    id: "angkor",
    slug: "angkor",
    name_ja: "アンコール",
    name_en: "Angkor",
    country_ja: "カンボジア",
    country_en: "Cambodia",
    region_ja: "アジア太平洋",
    region_en: "Asia-Pacific",
    type: "Cultural",
    year: 1992,
    image:
      "https://images.unsplash.com/photo-1566401762677-2e4b9c1e3b1a?q=80&w=1600&auto=format&fit=crop",
    short: "クメール王朝の都。アンコール・ワットなどの遺跡群。",
    coords: { lat: 13.4125, lng: 103.8667 },
  },
  {
    id: "historic-kyoto",
    slug: "kyoto_monuments",
    name_ja: "古都京都の文化財",
    name_en: "Historic Monuments of Ancient Kyoto",
    country_ja: "日本",
    country_en: "Japan",
    region_ja: "アジア太平洋",
    region_en: "Asia-Pacific",
    type: "Cultural",
    year: 1994,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Kiyomizu-dera_in_Kyoto.jpg/1600px-Kiyomizu-dera_in_Kyoto.jpg",
    short:
      "京都・宇治・大津に点在する神社仏閣や庭園群。日本文化を象徴する景観と建築技術が評価。",
    coords: { lat: 35.0116, lng: 135.7681 },
  },
  {
    id: "the-great-wall",
    slug: "great_wall",
    name_ja: "万里の長城",
    name_en: "The Great Wall",
    country_ja: "中国",
    country_en: "China",
    region_ja: "アジア太平洋",
    region_en: "Asia-Pacific",
    type: "Cultural",
    year: 1987,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/20090529_Great_Wall_8185.jpg/1600px-20090529_Great_Wall_8185.jpg",
    short:
      "中国北部を横断する城壁群。防御施設としての歴史的重要性とスケールが壮大。",
    coords: { lat: 40.4319, lng: 116.5704 },
  },
  {
    id: "taj-mahal",
    slug: "taj_mahal",
    name_ja: "タージ・マハル",
    name_en: "Taj Mahal",
    country_ja: "インド",
    country_en: "India",
    region_ja: "アジア太平洋",
    region_en: "Asia-Pacific",
    type: "Cultural",
    year: 1983,
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600&auto=format&fit=crop",
    short:
      "ムガル帝国の皇帝が皇妃のために築いた白大理石の霊廟。完璧な対称性と装飾美。",
    coords: { lat: 27.1751, lng: 78.0421 },
  },
  {
    id: "yellowstone",
    slug: "yellowstone",
    name_ja: "イエローストーン国立公園",
    name_en: "Yellowstone National Park",
    country_ja: "アメリカ合衆国",
    country_en: "United States of America",
    region_ja: "北アメリカ",
    region_en: "North America",
    type: "Natural",
    year: 1978,
    image:
      "https://images.unsplash.com/photo-1470074558764-4e57757f6ab7?q=80&w=1600&auto=format&fit=crop",
    short:
      "世界初の国立公園。間欠泉や温泉群、豊かな生態系を擁する巨大カルデラ地帯。",
    coords: { lat: 44.6, lng: -110.5 },
  },
  // --- ここから追加 ---
  {
    id: "pyramids-of-giza",
    slug: "pyramids_of_giza",
    name_ja: "ギーザのピラミッド群",
    name_en: "Pyramids of Giza",
    country_ja: "エジプト",
    country_en: "Egypt",
    region_ja: "アフリカ",
    region_en: "Africa",
    type: "Cultural",
    year: 1979,
    image: "https://images.unsplash.com/photo-1539651044670-315229da9d0b?q=80&w=1600&auto=format&fit=crop",
    short:
      "クフ王墓をはじめとする古代エジプト文明の象徴的遺構。",
    coords: { lat: 29.9792, lng: 31.1342 },
  },
  {
    id: "petra",
    slug: "petra",
    name_ja: "ペトラ",
    name_en: "Petra",
    country_ja: "ヨルダン",
    country_en: "Jordan",
    region_ja: "アラブ諸国",
    region_en: "Arab States",
    type: "Cultural",
    year: 1985,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Petra_Jordan_BW_21.JPG/1600px-Petra_Jordan_BW_21.JPG",
    short:
      "砂岩を彫り抜いた古代ナバテア王国の都。『宝物殿』が有名。",
    coords: { lat: 30.3285, lng: 35.4444 },
  },
  {
    id: "colosseum",
    slug: "colosseum",
    name_ja: "コロッセオ（ローマ歴史地区）",
    name_en: "The Colosseum (Historic Centre of Rome)",
    country_ja: "イタリア",
    country_en: "Italy",
    region_ja: "ヨーロッパ",
    region_en: "Europe",
    type: "Cultural",
    year: 1980,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg/1600px-Colosseum_in_Rome%2C_Italy_-_April_2007.jpg",
    short:
      "古代ローマ最大級の円形闘技場。帝国の権勢を物語る建築。",
    coords: { lat: 41.8902, lng: 12.4922 },
  },
  {
    id: "stonehenge",
    slug: "stonehenge",
    name_ja:
      "ストーンヘンジ（アヴェベリーと関連遺跡群）",
    name_en: "Stonehenge",
    country_ja: "イギリス",
    country_en: "United Kingdom",
    region_ja: "ヨーロッパ",
    region_en: "Europe",
    type: "Cultural",
    year: 1986,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Stonehenge2007_07_30.jpg/1600px-Stonehenge2007_07_30.jpg",
    short:
      "先史時代の環状列石。天文観測との関連が指摘される巨石記念物。",
    coords: { lat: 51.1789, lng: -1.8262 },
  },
  {
    id: "mont-saint-michel",
    slug: "mont_saint_michel",
    name_ja: "モン・サン＝ミシェルとその湾",
    name_en: "Mont-Saint-Michel and its Bay",
    country_ja: "フランス",
    country_en: "France",
    region_ja: "ヨーロッパ",
    region_en: "Europe",
    type: "Cultural",
    year: 1979,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Mont_Saint-Michel_vue_generale.jpg/1600px-Mont_Saint-Michel_vue_generale.jpg",
    short:
      "潮汐により姿を変える小島の修道院。中世巡礼の中心地。",
    coords: { lat: 48.636, lng: -1.5115 },
  },
  {
    id: "borobudur",
    slug: "borobudur",
    name_ja: "ボロブドゥール寺院遺跡群",
    name_en: "Borobudur Temple Compounds",
    country_ja: "インドネシア",
    country_en: "Indonesia",
    region_ja: "アジア太平洋",
    region_en: "Asia-Pacific",
    type: "Cultural",
    year: 1991,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Borobudur-Nothwest-view.jpg/1600px-Borobudur-Nothwest-view.jpg",
    short:
      "9世紀建立の大乗仏教寺院。巨大な仏塔とレリーフ群で知られる。",
    coords: { lat: -7.6079, lng: 110.2038 },
  },
  {
    id: "galapagos",
    slug: "galapagos_islands",
    name_ja: "ガラパゴス諸島",
    name_en: "Galápagos Islands",
    country_ja: "エクアドル",
    country_en: "Ecuador",
    region_ja: "ラテンアメリカ",
    region_en: "Latin America",
    type: "Natural",
    year: 1978,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Galapagos_Tortuga.JPG/1600px-Galapagos_Tortuga.JPG",
    short:
      "固有種が多く進化研究の聖地。海洋保全の最重要地域の一つ。",
    coords: { lat: -0.9538, lng: -90.9656 },
  },
  {
    id: "serengeti",
    slug: "serengeti",
    name_ja: "セレンゲティ国立公園",
    name_en: "Serengeti National Park",
    country_ja: "タンザニア",
    country_en: "Tanzania",
    region_ja: "アフリカ",
    region_en: "Africa",
    type: "Natural",
    year: 1981,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Serengeti_sunset.jpg/1600px-Serengeti_sunset.jpg",
    short:
      "ヌー・シマウマの大移動で有名なサバンナ生態系。",
    coords: { lat: -2.3333, lng: 34.8333 },
  },
  {
    id: "grand-canyon",
    slug: "grand_canyon",
    name_ja: "グランド・キャニオン国立公園",
    name_en: "Grand Canyon National Park",
    country_ja: "アメリカ合衆国",
    country_en: "United States of America",
    region_ja: "北アメリカ",
    region_en: "North America",
    type: "Natural",
    year: 1979,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Grand_Canyon_view_from_Pima_Point_2010.jpg/1600px-Grand_Canyon_view_from_Pima_Point_2010.jpg",
    short:
      "コロラド川の浸食が生んだ巨大渓谷。地球史を物語る地層が露出。",
    coords: { lat: 36.1069, lng: -112.1129 },
  },
  {
    id: "versailles",
    slug: "versailles",
    name_ja: "ヴェルサイユの宮殿と庭園",
    name_en: "Palace and Park of Versailles",
    country_ja: "フランス",
    country_en: "France",
    region_ja: "ヨーロッパ",
    region_en: "Europe",
    type: "Cultural",
    year: 1979,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Chateau_de_Versailles_Galerie_des_Glaces.jpg/1600px-Chateau_de_Versailles_Galerie_des_Glaces.jpg",
    short:
      "絶対王政期の壮麗な宮殿。幾何学庭園はヨーロッパ造園の規範。",
    coords: { lat: 48.8049, lng: 2.1204 },
  },
  {
    id: "uluru-kata-tjuta",
    slug: "uluru_kata_tjuta",
    name_ja: "ウルル＝カタ・ジュタ国立公園",
    name_en: "Uluru-Kata Tjuta National Park",
    country_ja: "オーストラリア",
    country_en: "Australia",
    region_ja: "アジア太平洋",
    region_en: "Asia-Pacific",
    type: "Mixed",
    year: 1987,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Uluru_%28Helicopter_view%29.jpg/1600px-Uluru_%28Helicopter_view%29.jpg",
    short: "先住民アナングの聖地と特異な地形が共存する景観。",
    coords: { lat: -25.3444, lng: 131.0369 },
  },
  {
    id: "meteora",
    slug: "meteora",
    name_ja: "メテオラの修道院群",
    name_en: "Meteora",
    country_ja: "ギリシャ",
    country_en: "Greece",
    region_ja: "ヨーロッパ",
    region_en: "Europe",
    type: "Cultural",
    year: 1988,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Meteora_Monasteries_2010.jpg/1600px-Meteora_Monasteries_2010.jpg",
    short:
      "奇岩の頂に築かれた修道院群。孤絶の信仰空間と絶景で知られる。",
    coords: { lat: 39.721, lng: 21.6319 },
  },
];

const TYPES = ["Cultural", "Natural", "Mixed"];

// ------------------------------------------------------------
// Helper components
// ------------------------------------------------------------
function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Credit({ img }) {
  if (!img) return null;
  return (
    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
      Photo: {img.author}{" "}
      <a
        className="underline underline-offset-4"
        href={img.source}
        target="_blank"
        rel="noreferrer"
      >
        Wikimedia Commons
      </a>{" "}
      ({img.license})
    </p>
  );
}

// ------------------------------------------------------------
// Card
// ------------------------------------------------------------
function SiteCard({ site, onOpen, onToggleFav, fav, lang }) {
  const img = whImages[site.slug];
  const src = img?.url || site.image || "/placeholder.jpg"; // フォールバック
  const title =
    (lang === "ja" ? site.name_ja : site.name_en) || site.name_en || site.name_ja;
  const countryLabel = lang === "ja" ? site.country_ja : site.country_en;
  const regionLabel = lang === "ja" ? site.region_ja : site.region_en;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/30 bg-white/70 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/60">
      <div className="overflow-hidden">
        <img
          src={src}
          alt={title}
          loading="lazy"
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.jpg";
          }}
        />
      </div>

      <span
        className={classNames(
          "absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-sm",
          site.type === "Cultural" && "bg-gradient-to-r from-pink-500 to-rose-500",
          site.type === "Natural" && "bg-gradient-to-r from-emerald-500 to-teal-500",
          site.type === "Mixed" && "bg-gradient-to-r from-indigo-500 to-violet-500"
        )}
      >
        {site.type}
      </span>

      <div className="p-4">
        <h3 className="mb-1 text-base font-semibold leading-tight text-slate-900 dark:text-slate-50">
          {title}
        </h3>

        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
          {site.short}
        </p>

        <Credit img={img} />

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="rounded-full border border-slate-300/60 px-2 py-0.5 dark:border-white/10">
            {countryLabel}
          </span>
          <span className="rounded-full border border-slate-300/60 px-2 py-0.5 dark:border-white/10">
            {regionLabel}
          </span>
          <span className="rounded-full border border-slate-300/60 px-2 py-0.5 dark:border-white/10">
            Inscribed {site.year}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => onOpen(site)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-sky-500 to-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" className="-ml-0.5">
              <path fill="currentColor" d="M10.59 13.41a1 1 0 0 1 0-1.41l2-2a1 1 0 1 1 1.41 1.41l-2 2a1 1 0 0 1-1.41 0Z" />
              <path fill="currentColor" d="M13.54 7.05a3.5 3.5 0 0 1 4.95 4.95l-2.12 2.12a3.5 3.5 0 0 1-4.95 0a1 1 0 1 1 1.41-1.41a1.5 1.5 0 0 0 2.12 0l2.12-2.12a1.5 1.5 0 0 0-2.12-2.12a1 1 0 0 1-1.41-1.41Z" />
            </svg>
            Learn more
          </button>

          <button
            onClick={() => onToggleFav(site.id)}
            className={classNames(
              "rounded-xl border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/30",
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
    </article>
  );
}

// ------------------------------------------------------------
// Detail (モーダル)
// ------------------------------------------------------------
function Detail({ site, onClose, lang }) {
  if (!site) return null;

  const img = site?.slug ? whImages[site.slug] : null;
  const src = img?.url || site.image || "/placeholder.jpg";
  const title =
    (lang === "ja" ? site.name_ja : site.name_en) || site.name_en || site.name_ja;
  const countryLabel = lang === "ja" ? site.country_ja : site.country_en;
  const regionLabel = lang === "ja" ? site.region_ja : site.region_en;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
      <div className="relative m-2 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <img
          src={src}
          alt=""
          className="h-60 w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.jpg";
          }}
        />
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {countryLabel} • {regionLabel} • {site.type} • {site.year}
            </span>
          </div>

          <Credit img={img} />

          <p className="mt-3 text-slate-700 dark:text-slate-300">{site.short}</p>

          <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Coordinates
              </div>
              <div className="mt-1">
                {site.coords.lat}, {site.coords.lng}
              </div>
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

// ------------------------------------------------------------
// App（ヘッダー＋検索パネル＋グリッド）
// ------------------------------------------------------------
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
  const [lang, setLang] = useState("ja"); // 言語トグル

  useEffect(() => {
    localStorage.setItem("wh-favs", JSON.stringify(favs));
  }, [favs]);

  // 国リスト（言語別）
  const countries = useMemo(() => {
    const label = (s) => (lang === "ja" ? s.country_ja : s.country_en);
    const set = new Set(SITES.map(label));
    set.delete(undefined);
    set.delete(null);
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [lang]);

  // フィルタ＆ソート
  const filtered = useMemo(() => {
    const getName = (s) => (lang === "ja" ? s.name_ja : s.name_en);
    const getCountry = (s) => (lang === "ja" ? s.country_ja : s.country_en);

    let list = SITES.filter((s) => {
      const hay = [
        s.name_ja,
        s.name_en,
        s.country_ja,
        s.country_en,
        s.region_ja,
        s.region_en,
        s.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(query.toLowerCase());
    });

    if (types.length) list = list.filter((s) => types.includes(s.type));
    if (country !== "All") list = list.filter((s) => getCountry(s) === country);

    list = list.sort((a, b) => {
      if (sort === "name") return getName(a).localeCompare(getName(b));
      if (sort === "year") return a.year - b.year;
      if (sort === "country") return getCountry(a).localeCompare(getCountry(b));
      return 0;
    });
    return list;
  }, [query, types, country, sort, lang]);

  function toggleType(t) {
    setTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  function toggleFav(id) {
    setFavs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-gradient-to-b from-sky-50 via-white to-white p-5 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:text-slate-50">
      {/* デコ背景（柔らかい放射グラデ） */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -left-24 h-[520px] w-[520px] rounded-full bg-sky-200/30 blur-3xl dark:bg-cyan-400/10" />
        <div className="absolute -right-24 top-10 h-[560px] w-[560px] rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-400/10" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="sticky top-0 z-40 -mx-5 mb-5 border-b border-slate-200/60 bg-white/60 backdrop-blur-md shadow-sm dark:border-white/10 dark:bg-slate-900/40">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gradient-to-tr from-sky-400 to-cyan-300 ring-4 ring-cyan-200/30 dark:ring-cyan-400/20" />
              <span className="text-sm font-bold tracking-wide">
                World Heritage Explorer
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <a
                className="rounded-full border border-slate-300 px-3 py-1 font-semibold hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                href="#favorites"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("favorites")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Favorites ({favs.length})
              </a>
              <a
                className="rounded-full border border-slate-300 px-3 py-1 font-semibold hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                href="https://whc.unesco.org/en/list/"
                target="_blank"
                rel="noreferrer"
              >
                UNESCO List ↗
              </a>
              {/* 言語トグル */}
              <button
                onClick={() => setLang(lang === "ja" ? "en" : "ja")}
                className="relative inline-flex h-6 w-12 items-center rounded-full bg-slate-300 transition dark:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40"
                aria-label="toggle language"
              >
                <span
                  className={classNames(
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition",
                    lang === "ja" ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
              <span className="ml-1">{lang === "ja" ? "日本語" : "EN"}</span>
            </div>
          </div>
        </div>

        {/* Hero / Controls */}
        <section className="mb-6 grid gap-4 sm:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/50">
            <p className="mb-2 inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              Curate & learn about UNESCO World Heritage Sites
            </p>
            <h1 className="text-2xl font-black leading-tight sm:text-4xl">
              世界遺産紹介サイト <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">(Demo)</span>
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              検索 / 絞り込み / 並び替え / お気に入り保存（ローカル）に対応。カードをクリックして詳細を表示。データは下の配列 <code>SITES</code> を編集して増やせます。
            </p>

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
                        "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                        types.includes(t)
                          ? "border-sky-400 bg-sky-50 text-sky-700 shadow-sm dark:border-sky-300/40 dark:bg-sky-300/10 dark:text-sky-200"
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

          {/* Map セクション */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 shadow-sm dark:border-white/10 dark:bg-slate-900/50">
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: "400px", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filtered.map((s) => (
                <Marker key={s.id} position={[s.coords.lat, s.coords.lng]}>
                  <Popup>
                    <strong>{lang === "ja" ? s.name_ja : s.name_en}</strong>
                    <br />
                    {lang === "ja" ? s.country_ja : s.country_en}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
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
                  lang={lang}
                  onOpen={setOpen}
                  onToggleFav={toggleFav}
                  fav={favs.includes(s.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Favorites */}
        <section id="favorites" className="mt-10">
          <h2 className="mb-3 text-lg font-bold">Favorites</h2>
          {favs.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              まだブックマークがありません。カードの「Bookmark」を押すと追加されます。
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SITES.filter((s) => favs.includes(s.id)).map((s) => (
                <SiteCard
                  key={s.id}
                  site={s}
                  lang={lang}
                  onOpen={setOpen}
                  onToggleFav={toggleFav}
                  fav
                />
              ))}
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-slate-200/60 py-6 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          © {new Date().getFullYear()} World Heritage Explorer • Demo dataset. Images via Wikimedia/Unsplash.
        </footer>
      </div>

      <Detail site={open} onClose={() => setOpen(null)} lang={lang} />
    </div>
  );
}
