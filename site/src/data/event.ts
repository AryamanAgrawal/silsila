/**
 * Single source of truth for the event.
 *
 * The date is Sunday 30 August 2026, confirmed. The poster's "Saturday" is a
 * typo and is not reproduced anywhere on this site: the weekday is derived
 * from `date` below, which the hero, marquee and schema.org markup all read
 * from.
 *
 * This site is a program, not a box office. The link is handed to people to
 * read on a phone, so the run of show and the artists carry the page; the
 * ticket link survives only as one row in the venue table.
 */

export const event = {
  title: "Resonance",
  series: "silsila",
  tagline: "The Living Journey of South Asian Classical Music",

  host: {
    name: "Ruh Arts Foundation",
    short: "Ruh Arts",
    mark: "/assets/motif/ruh-mark.png",
    lockup: "/assets/motif/ruh-lockup.png",
  },

  curator: "Tehreem Khan",

  date: "2026-08-30",
  doors: "18:30",
  showtime: "19:00",
  curtain: "21:00",

  venue: {
    name: "Abrons Arts Center",
    room: "Playhouse Theater",
    street: "466 Grand Street",
    locality: "New York",
    region: "NY",
    postalCode: "10002",
    neighbourhood: "Lower East Side",
    mapsUrl: "https://maps.app.goo.gl/Sdat87G5xHCCpsZAA",
    trains: ["F to Delancey St", "J M Z to Essex St", "B D to Grand St"],
  },

  contact: {
    email: "tehreem.tauqir@gmail.com",
    phone: "516-507-2335",
  },

  /** Kept as a venue row. The page no longer sells; it explains. */
  tickets: {
    url: "https://abronsartscenter.app.getcuebox.com/o/C5XTY485/shows/F5YXT2PK",
    note: "Tickets via Abrons Arts Center",
  },
} as const;

export type Artist = {
  slug: string;
  name: string;
  honorific?: string;
  instrument: string;
  /** `null` renders the polaroid's holding frame instead of a portrait. */
  photo: string | null;
  /** Paragraphs. `null` where no bio has been supplied yet. */
  bio: string[] | null;
  press?: { quote: string; source: string }[];
  links?: { label: string; url: string }[];
};

/** Carousel order. The strip and its bio panel both read from this array. */
export const artists: Artist[] = [
  {
    slug: "jayanta-banerjee",
    name: "Jayanta Banerjee",
    honorific: "Shri",
    instrument: "Sitar",
    photo: "/assets/artists/jayanta.jpg",
    bio: [
      "Shri Jayanta Banerjee is an internationally acclaimed sitarist, composer, and multidisciplinary musician whose artistry bridges Indian classical traditions with contemporary and global expressions. Trained under eminent gurus including Shri Amit Prasanna Mukherjee, Pt. Devi Prasad Chatterjee, Pt. Santosh Banerjee of the Rampur Gharana, and Pt. Robi Chakraborty of the Maihar Gharana, his musical lineage reflects a deep-rooted connection to the great traditions of Hindustani classical music. Alongside the sitar, he is proficient in the sarod, harmonium and keyboards, and is also a trained vocalist.",
      "Over the course of his career he has performed extensively across India and internationally, appearing at the Hollywood Bowl, Royal Festival Hall, the National Centre for the Performing Arts, the Asian Art Museum, the Palace of Fine Arts and the Sydney Opera House. He has collaborated with legendary artists across Indian classical music and dance, including Padma Vibhushan Pt. Birju Maharaj, Pt. Chitresh Das, and Vidwan Vikku Vinayakram.",
      'Beyond performance he is a composer, educator and cultural curator, known for interdisciplinary works that bring together music and dance, most notably through the festival "Sambandh," which celebrates the Baithaki tradition and unites over a hundred artists across disciplines.',
    ],
    links: [
      { label: "Instagram", url: "https://www.instagram.com/jayantsitar" },
      {
        label: "Echoes to Sky",
        url: "https://open.spotify.com/album/1ybwXllFQkPQgtKeBxhD0G",
      },
    ],
  },
  {
    slug: "samir-chatterjee",
    name: "Samir Chatterjee",
    honorific: "Pandit",
    instrument: "Tabla",
    photo: "/assets/artists/samir.jpg",
    bio: [
      "Samir Chatterjee is a virtuoso tabla player from India who travels widely throughout the year, performing as a soloist and alongside outstanding musicians from both Indian and non-Indian traditions. He performed at the Nobel Peace Prize ceremony in Oslo in 2007, and several times at the United Nations General Assembly. He is a firm believer in the transforming effect of music on society, and every aspect of his work reflects that conviction.",
      "He began his studies with Pandit Bankim Ghosh, Pt. Balaram Mukherjee, Pt. Rathin Dhar and Mohammad Salim, and his later formation came under Pt. Amalesh Chatterjee and Pt. Shyamal Bose. All of his teachers have been of the Farrukhabad Gharana, which he now represents. In concert he has accompanied many of India’s greatest musicians, among them Pt. Ravi Shankar, Ud. Vilayat Khan, Pt. Bhimsen Joshi, Pt. Jasraj, Pt. Nikhil Banerjee, Pt. Shivkumar Sharma and Pt. Hariprasad Chaurasia.",
      "Based in the New York area, he has been a catalyst in the meeting of Indian and non-Indian music, performing with Branford Marsalis, Ravi Coltrane, Joshua Bell, Pauline Oliveros, William Parker, the Boston Philharmonic and the Minnesota Orchestra. He is the Founder-Director of Chhandayan, author of the 654-page A Study of Tabla, and serves on the faculty of the Manhattan School of Music, the University of Pittsburgh and the New School for Jazz and Contemporary Music.",
    ],
    press: [
      {
        quote:
          "Tabla player Pandit Samir Chatterjee is a walking history book when it comes to Indian music.",
        source: "WNYC",
      },
      {
        quote:
          "An exuberant improvisatory interchange with Samir Chatterjee, whose tabla playing also seemed less percussive than vocal.",
        source: "The New York Times",
      },
    ],
  },
  {
    slug: "tehreem-khan",
    name: "Tehreem Khan",
    instrument: "Sitar",
    photo: "/assets/artists/tehreem.jpg",
    bio: [
      "Tehreem Khan is a Pakistani-New York\u2013based artist exploring the interwoven traditions of South Asian classical music and movement arts. She studies South Asian classical vocal music, primarily in the Khayal tradition, within the Saami family lineage, engaging deeply with its distinctive, spiritually expansive approach to sound and intonation, alongside sitar with Jayanta Banerjee and Kathak with Nighat Chaudhry.",
      "Alongside her artistic practice, Tehreem is a cybersecurity engineer \u2014 a dual path that shapes her disciplined, curious approach to both technology and the classical arts. Her work is guided by a commitment to honoring, preserving, and sharing the teachings of her Ustaads with wider global audiences. Her practice is rooted in rigorous classical study while seeking a contemporary voice, threading melody, rhythm, and movement into a practice that reflects the fluid, borderless spirit of South Asian arts. At the heart of her work is a desire to experience the purity of sur and the spiritual essence of music, and to share that experience with her audience.",
    ],
  },
  {
    slug: "sikandar-rahman",
    name: "Sikandar Rahman",
    instrument: "Violin",
    photo: "/assets/artists/sikandar.jpg",
    bio: [
      "Born and raised in New York City yet perpetually globetrotting, Sikandar’s spirit is always between Karachi, Lahore, and Istanbul. Trained in Western classical violin for over two decades, he performed and led ensembles at Carnegie Hall and Lincoln Center in his youth. His musical journey has since expanded from the Middle Eastern Maqam to Hindustani classical traditions, further enriched by khayal vocal training under the illustrious Saami Brothers Qawwal.",
      "A true ‘āshiq-e-jamāl — a lover of all that is beautiful — Sikandar finds his muse in the Urdu language. His current musical inspirations include Mehdi Hassan, Nayyara Noor, and Jaffer Zaidi of Kaavish.",
    ],
  },
  {
    slug: "pranav-shikarpur",
    name: "Pranav Shikarpur",
    instrument: "Bansuri",
    photo: "/assets/artists/pranav.jpg",
    bio: [
      "Pranav Shikarpur is a Hindustani flautist based in NYC. He started his Hindustani flute (bansuri) training from the late Pt. Venkatesh Godkhindi when he was 7 years old, and has continued to learn from Surmani Pt. Pravin Godkhindi for the past 14 years. He was awarded the Centre for Cultural Resources and Training scholarship (CCRT) from the central government of India at the age of 12 for Hindustani flute. Pranav is a strong believer in music being a universal language, and has collaborated with musicians and dancers across different genres.",
      "In addition to his passion for the flute, Pranav has trained in Hindustani vocal music with Smt. Geetha Hegde and tabla with Sri Mohan for many years.",
    ],
  },
  {
    slug: "shiva-kannan",
    name: "Shiva Kannan",
    instrument: "Keyboard",
    photo: "/assets/artists/shiva.jpg",
    bio: [
      "Shiva Kannan is a music producer, instrumentalist and vocalist based in NYC. He has been trained in Carnatic music since the age of 8 in Chennai, India.",
      "He is passionate about learning and experimenting with different genres of music.",
    ],
  },
  {
    slug: "aryaman-agrawal",
    name: "Aryaman Agrawal",
    instrument: "Harmonium",
    photo: "/assets/artists/aryaman.jpg",
    bio: null,
  },
];

/**
 * The evening, in order. Deliberately unnumbered and untimed: the audience gets
 * the sequence, not a schedule that will drift on the night. Doors and curtain
 * live on `event` and are stated once, in the section lede.
 *

 */
export const runOfShow = [
  {
    title: "Sitar & Tabla",
    performers: "Jayanta Banerjee & Samir Chatterjee",
    body: "The evening opens with two masters, whose artistry unfolds through intricate improvisation, rhythmic dialogue, and moments of profound stillness. Together, they explore the depth, beauty, and spontaneity of this living art form.",
    kicker: "Opening set",
    feature: true,
  },
  {
    title: "Echoes to Sky",
    performers: "Jayanta Banerjee & Samir Chatterjee",
    body: "A first live look at the new album: sitar instrumentals that move through shifting emotional and sonic landscapes, from intimacy and longing to openness and stillness.",
    kicker: "Sneak peek",
    feature: false,
  },
  {
    title: "Ustad & Shagird",
    performers: "Jayanta Banerjee, Tehreem Khan & Samir Chatterjee",
    body: "A special presentation celebrating the Ustad-Shagird (Guru-Shishya) tradition, teacher and disciple performing together on sitar, honouring the bond that has sustained this music for generations.",
    kicker: "Sitar duet",
    feature: false,
  },
  {
    title: "A Dialogue Between East and West",
    performers: "Composed by Jayanta Banerjee",
    body: "A collaborative finale joined by Sikandar Rahman on violin, Pranav Shikarpur on bansuri, Shiva Kannan on keyboard, and Aryaman Agrawal on harmonium, where distinct musical voices meet with mutual respect, curiosity, and shared expression.",
    kicker: "Finale",
    feature: true,
  },
];

export const statement = [
  "Silsila means continuation, the unbroken line through which South Asian classical music has passed from one generation to the next, each note carrying the wisdom of the past while opening space for new expression.",
  "Resonance is the lingering voice of the sitar: the way a note keeps sounding long after it is struck, connecting artists, traditions, and audiences across time.",
];

/**
 * The host. Sits beside `statement` on the page: silsila is continuation stated
 * as poetry, this is the same idea stated as purpose.
 */
export const host = {
  name: "Ruh Arts Foundation",
  status: "501(c)(3) nonprofit",
  bio: [
    "Ruh Arts Foundation is a 501(c)(3) nonprofit dedicated to honoring and safeguarding the Subcontinent\u2019s classical arts. We cultivate artist-led, community-oriented spaces where mastery, ancestral knowledge, rigorous practice, and thoughtful evolution converge \u2014 ensuring these endangered traditions endure for generations to come.",
  ],
};

/**
 * The closing panel. Entries render only once they have a `url`, so the
 * section can ship before the handles are confirmed and light up as they land.
 */
export const socials: { label: string; handle: string; url: string | null }[] = [
  { label: "Ruh Arts Foundation", handle: "", url: null },
  { label: "silsila", handle: "", url: null },
  { label: "Jayanta Banerjee", handle: "@jayantsitar", url: "https://www.instagram.com/jayantsitar" },
  { label: "Tehreem Khan", handle: "", url: null },
];

export const album = {
  title: "Echoes to Sky",
  artist: "Jayanta Banerjee",
  releaseYear: 2026,
  runtime: "24 min",
  spotifyId: "1ybwXllFQkPQgtKeBxhD0G",
  spotifyUrl: "https://open.spotify.com/album/1ybwXllFQkPQgtKeBxhD0G",
  hyperfollowUrl:
    "https://distrokid.com/hyperfollow/jayantabanerjee/echoes-to-sky",
  blurb:
    "A sitar instrumental album that moves through shifting emotional and sonic landscapes, each composition a distinct exploration of mood, texture, and space.",
  tracks: [
    "In the Air Tonight",
    "The Mand of Deep Longings",
    "Eternal Love",
    "Colors on the Wind",
    "The Quiet Calm of Early Morning",
  ],
};

/* ── derived helpers ─────────────────────────────────────── */

const NY_TZ = "America/New_York";
const NY_OFFSET = "-04:00";

function at(time: string) {
  return new Date(`${event.date}T${time}:00${NY_OFFSET}`);
}

export const showStart = at(event.showtime);
export const doorsOpen = at(event.doors);
export const showEnd = at(event.curtain);

/** "6:30 PM" when there are minutes, "7 PM" when there are not. */
function clock(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${suffix}` : `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export const formatted = {
  weekday: showStart.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: NY_TZ,
  }),
  dayNumber: showStart.toLocaleDateString("en-US", {
    day: "numeric",
    timeZone: NY_TZ,
  }),
  month: showStart.toLocaleDateString("en-US", {
    month: "long",
    timeZone: NY_TZ,
  }),
  monthShort: showStart.toLocaleDateString("en-US", {
    month: "short",
    timeZone: NY_TZ,
  }),
  year: showStart.toLocaleDateString("en-US", {
    year: "numeric",
    timeZone: NY_TZ,
  }),
  doors: clock(event.doors),
  showtime: clock(event.showtime),
  curtain: clock(event.curtain),
};

export const addressLine = `${event.venue.street}, ${event.venue.locality}, ${event.venue.region} ${event.venue.postalCode}`;
