import React, { useEffect, useMemo, useState } from "react";
import { whImages } from "./assets/whImages";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


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
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Itsukushima_torii_2020.jpg",
    short: "海に浮かぶ大鳥居で有名な神社。自然と信仰が一体となった景観が評価。",
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
    image: "https://upload.wikimedia.org/wikipedia/commons/8/87/Himeji_Castle_in_May_2015.jpg",
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
    short:
      "世界最大の珊瑚礁生態系。多様な海洋生物の重要な生息地。",
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
      "https://upload.wikimedia.org/wikipedia/commons/9/9d/Kiyomizu-dera_in_Kyoto.jpg",
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
      "https://upload.wikimedia.org/wikipedia/commons/1/10/20090529_Great_Wall_8185.jpg",
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

  // --- ここから追記 ---
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
    // source.unsplash.com はブロックされやすいので固定写真に変更
    image:
      "https://images.unsplash.com/photo-1580657018950-20b2cbd3683d?auto=format&fit=crop&w=1600&q=80",
    short: "クフ王墓をはじめとする古代エジプト文明の象徴的遺構。",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Petra_Jordan_BW_21.JPG?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Colosseum_in_Rome,_Italy_-_April_2007.jpg?width=1600",
    short:
      "古代ローマ最大級の円形闘技場。帝国の権勢を物語る建築。",
    coords: { lat: 41.8902, lng: 12.4922 },
  },
  {
    id: "stonehenge",
    slug: "stonehenge",
    name_ja: "ストーンヘンジ（アヴェベリーと関連遺跡群）",
    name_en: "Stonehenge",
    country_ja: "イギリス",
    country_en: "United Kingdom",
    region_ja: "ヨーロッパ",
    region_en: "Europe",
    type: "Cultural",
    year: 1986,
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Stonehenge2007_07_30.jpg?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mont_Saint-Michel_vue_generale.jpg?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Borobudur-Nothwest-view.jpg?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Galapagos_Tortuga.JPG?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Serengeti_sunset.jpg?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Grand_Canyon_view_from_Pima_Point_2010.jpg?width=1600",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Chateau_de_Versailles_Galerie_des_Glaces.jpg?width=1600",
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
      "https://upload.wikimedia.org/wikipedia/commons/c/c2/Uluru%2C_helicopter_view%2C_cropped.jpg",
    short:
      "先住民アナングの聖地と特異な地形が共存する景観。",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Meteora_Monasteries_2010.jpg?width=1600",
    short:
      "奇岩の頂に築かれた修道院群。孤絶の信仰空間と絶景で知られる。",
    coords: { lat: 39.721, lng: 21.6319 },
  },

];
  // --- 追記ここまで ---

const TYPES = ["Cultural", "Natural", "Mixed"];

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function safeImageUrl(raw, title = "world heritage") {
  if (!raw) return null;
  if (raw.includes("source.unsplash.com")) {
    return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";
  }
  if (raw.includes("commons.wikimedia.org/wiki/Special:FilePath/")) {
    const noScheme = raw.replace(/^https?:\/\//, "");
    return `https://images.weserv.nl/?url=${encodeURIComponent(noScheme)}`;
  }
  return raw;
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

/* ===============================
   Card
================================ */
function SiteCard({ site, onOpen, onToggleFav, fav, lang }) {
  const title =
    (lang === "ja" ? site.name_ja : site.name_en) || site.name_en || site.name_ja;
  const img = whImages[site.slug];
  const primary = safeImageUrl(img?.url || site.image, title);

  const countryLabel = lang === "ja" ? site.country_ja : site.country_en;
  const regionLabel = lang === "ja" ? site.region_ja : site.region_en;

  const [src, setSrc] = React.useState(primary || "/placeholder.jpg");

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white/90 shadow-lg ring-1 ring-blue-400/40 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/40 dark:bg-slate-900/80">
      <div className="overflow-hidden">
        <img
          src={src}
          alt={title}
          loading="lazy"
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          onError={() => setSrc("/placeholder.jpg")}
        />
      </div>

      <span
        className={classNames(
          "absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-sm",
          site.type === "Cultural" && "bg-gradient-to-r from-sky-500 to-blue-600",
          site.type === "Natural" && "bg-gradient-to-r from-sky-400 to-cyan-500",
          site.type === "Mixed" && "bg-gradient-to-r from-indigo-500 to-blue-600"
        )}
      >
        {site.type}
      </span>

      <div className="p-4">
        <h3 className="mb-1 text-lg font-serif font-bold leading-tight text-slate-900 dark:text-slate-50">
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
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-sky-400 via-blue-600 to-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40"
          >
            Learn more
          </button>
          <button
            onClick={() => onToggleFav(site.id)}
            className={classNames(
              "rounded-xl border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40",
              fav
                ? "border-sky-400 bg-sky-50 text-sky-700 dark:border-sky-300/40 dark:bg-sky-300/10 dark:text-sky-200"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/5"
            )}
          >
            {fav ? "Bookmarked" : "Bookmark"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ===============================
   Detail
================================ */
function Detail({ site, onClose, lang }) {
  if (!site) return null;

  const title =
    (lang === "ja" ? site.name_ja : site.name_en) || site.name_en || site.name_ja;
  const img = site?.slug ? whImages[site.slug] : null;
  const primary = safeImageUrl(img?.url || site.image, title);

  const [src, setSrc] = React.useState(primary || "/placeholder.jpg");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
      <div className="relative m-2 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <img
          src={src}
          alt={title}
          className="h-60 w-full object-cover"
          onError={() => setSrc("/placeholder.jpg")}
        />
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {site.country_ja} • {site.region_ja} • {site.type} • {site.year}
            </span>
          </div>
          <Credit img={img} />
          <p className="mt-3 text-slate-700 dark:text-slate-300">{site.short}</p>
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

/* ===============================
   App
================================ */
export default function App() {
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState([]);
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
  const [lang, setLang] = useState("ja");

  useEffect(() => {
    localStorage.setItem("wh-favs", JSON.stringify(favs));
  }, [favs]);

  const countries = useMemo(() => {
    const label = (s) => (lang === "ja" ? s.country_ja : s.country_en);
    const set = new Set(SITES.map(label));
    set.delete(undefined);
    set.delete(null);
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [lang]);

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

  return (
    <div className="relative min-h-screen overflow-x-clip bg-gradient-to-b from-blue-900 via-sky-700 to-blue-600 p-5 text-slate-50">
      {/* 背景の飾り円 */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-200px] left-[-200px] h-[600px] w-[600px] rounded-full bg-blue-700/30 blur-3xl" />
        <div className="absolute bottom-[-250px] right-[-250px] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <section className="mb-6">
          <h1 className="text-3xl font-serif font-bold leading-tight sm:text-5xl">
            世界遺産紹介サイト{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-800 bg-clip-text text-transparent drop-shadow-lg">
              (Demo)
            </span>
          </h1>
          <p className="mt-3 text-slate-200/90">
            検索・絞り込み・お気に入り保存に対応。カードをクリックして詳細を表示。
          </p>
        </section>

        {/* ここに検索UI / Map / Grid / Favorites / Footer を残してください（前回コードと同じ） */}

        <Detail site={open} onClose={() => setOpen(null)} lang={lang} />
      </div>
    </div>
  );
}
