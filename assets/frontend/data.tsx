interface LinkInfo {
  name: string;
  url?: string;
  icon?: string;
  tooltip?: string;
}

const MediaElsewhere: LinkInfo[] = [
  {
    name: "Movies [Letterboxd]",
    url: "https://letterboxd.com/purplepinapples/",
    tooltip: "Just the Movies",
  },
  {
    name: "TV Shows [Trakt]",
    url: "https://trakt.tv/users/purplepinapples/ratings/all/all/highest",
    tooltip: "Movies and TV shows",
  },
  {
    name: "Music [Spreadsheet]",
    url: "https://purarue.xyz/s/albums",
    tooltip: "Personal Music Spreadsheet/Album tracking",
  },
  {
    name: "Video Games [Grouvee]",
    url: "https://www.grouvee.com/user/purplepinapples/shelves/106920-played/?sort_by=their_rating&dir=desc&",
    tooltip: "Don't play a lot of video games, but this tracks what I do",
  },
  {
    name: "Anime [MAL]",
    url: "https://myanimelist.net/profile/purplepinapples",
    tooltip: "Anime and Manga",
  },
  {
    name: "Anime [AniList]",
    url: "https://anilist.co/user/purplepinapples/",
    tooltip: "Used as a backup, and for my friends on Anilist",
  },
];

const MiscLinks: LinkInfo[] = [
  {
    name: "MAL Unapproved",
    url: "/mal_unapproved/",
    tooltip: "A website displaying unapproved entries on MyAnimeList",
  },
  {
    name: "AnimeShorts",
    url: "/animeshorts/",
    tooltip: "A recommendation list of my favorite anime short films",
  },
  {
    name: "DVD Logo",
    url: "/dvd/",
    tooltip: "DVD logo bouncing around in your browser!",
  },
  {
    name: "Favorite XKCDs",
    url: "/xkcd",
    tooltip: "A list of my favorite XKCDs",
  },
  {
    name: "Dotfiles Index",
    url: "/d/?dark",
    tooltip:
      "A index of every file in my dotfiles -- often use this to send a file to someone quickly",
  },
];

// Subwindows:
//
// Code:
// - Data
// - Projects
// - Dotfiles
// - Tools

// Writing:
// - Blog
// - Notes

// Utilities:
// - Browser
// - TextEdit
// - Paint
// - Customize

const IconData: LinkInfo[] = [
  {
    name: "readme",
    icon: "/images/frontend/notepad.png",
  },
  {
    name: "guest book",
    icon: "/images/frontend/guestbook.png",
  },
  {
    name: "media feed",
    icon: "/images/frontend/camerafeed.png",
    url: "https://purarue.xyz/feed/",
  },
  {
    name: "code📁",
    icon: "/images/frontend/laptop.png",
  },
  {
    name: "writing📁",
    icon: "/images/frontend/feather.png",
  },
  {
    name: "programs📁",
    icon: "/images/frontend/gear.png",
  },
  {
    name: "photography",
    url: "https://purarue.xyz/x/photography/",
    icon: "/images/frontend/camera.png",
  },
  // {
  //   name: "ama",
  //   icon: "/images/frontend/question.png",
  //   url: "https://github.com/purarue/ama",
  // },
  {
    name: "MEAMs",
    icon: "/images/frontend/brain.png",
    url: "https://purarue.xyz/x/meam/",
  },
  {
    name: "media accts",
    icon: "/images/frontend/musicnote.png",
  },
  {
    name: "misc",
    icon: "/images/frontend/misc.png",
  },
  {
    name: "cubing",
    icon: "/images/frontend/rubikscube.png",
  },
  {
    name: "not_a_virus",
    icon: "/images/frontend/heart.png",
  },
];

export { LinkInfo, IconData, MediaElsewhere, MiscLinks };
