// ============================================
// Valentine Data - Edit semua konten di sini!
// ============================================
const getAsset = (filename: string) =>
  new URL(`../assets/photos/${filename}`, import.meta.url).href;

export const heroData = {
  title: "Happy Valentine's Day",
  subtitle: "For my one and only 💕",
};

export const loveLetterLines = [
  "Regina my beloved,",
  "Ever since the first time we met,",
  "my world has become so much more colorful.",
  "Every day with you is the most beautiful gift",
  "I have ever received from the universe.",
  "",
  "You are the reason behind my smile,",
  "the harbor when I am weary,",
  "and the star that lights up my night.",
  "",
  "I don't need perfect words",
  "to describe how I feel.",
  "It is enough for you to know that my heart",
  "is always and forever yours.",
  "",
  "Thank you for being",
  "the most beautiful part of my life.",
  "",
  "— Nadhif 💕",
];

export const photos = [
  {
    id: 1,
    url: getAsset("1.jpg"),
    caption: "Our first date",
  },
  {
    id: 2,
    url: getAsset("2.jpg"),
    caption: "Mirror selfie wkwk",
  },
  {
    id: 3,
    url: getAsset("3.jpg"),
    caption: "Romlok ❤️",
  },
  {
    id: 4,
    url: getAsset("4.jpg"),
    caption: "Melukish",
  },
  {
    id: 5,
    url: getAsset("5.jpeg"),
    caption: "Ayim sblm melukish",
  },
  {
    id: 6,
    url: getAsset("6.jpg"),
    caption: "Foto bareng tante",
  },
  {
    id: 7,
    url: getAsset("7.jpg"),
    caption: "Pamer cilung",
  },
  {
    id: 8,
    url: getAsset("8.jpg"),
    caption: "First hug",
  },
  {
    id: 9,
    url: getAsset("9.jpg"),
    caption: "Esh kim",
  },
  {
    id: 10,
    url: getAsset("10.jpg"),
    caption: "My ikan buntal",
  },
  {
    id: 11,
    url: getAsset("11.jpg"),
    caption: "Late Night",
  },
  {
    id: 12,
    url: getAsset("12.jpg"),
    caption: "First Photobooth",
  },
];

export const surpriseMessage =
  "You are the best thing that has ever happened to my life. Happy Valentine’s Day, princess! 🥰💕";

export const footerData = {
  message: "With ❤️, just for you",
  specialDate: "22 October 2025",
};
