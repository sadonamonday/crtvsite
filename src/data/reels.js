// Centralized Instagram Reels data
// How to add a new reel:
// - Copy the share link of your Instagram reel, e.g. https://www.instagram.com/reel/XXXXXXXXXXX/
// - Optionally add a thumbnail image URL (any image you want to show as a card preview)
// - Fill in caption, category, and duration (optional)
// - The embedUrl is not strictly required as we use the permalink in the Instagram blockquote
//
// Each item must include at least:
// {
//   id: string,
//   type: 'reel',
//   platform: 'instagram',
//   url: 'https://www.instagram.com/reel/.../',
//   caption: string,
//   thumbnail: string,
//   aspect: 'portrait',
//   comingSoon: boolean
// }

export const reels = [
  { id: "reel1", type: "reel", platform: "instagram", url: "https://www.instagram.com/reel/DND4yeZtDTf/", embedUrl: "https://www.instagram.com/reel/DND4yeZtDTf/embed/", caption: "CRTVSHOTS INTRO", category: "bts", thumbnail: "https://i.pinimg.com/736x/0b/36/1b/0b361b0bd9a37a8dbc503d87b771bb.jpg", duration: "0:45", comingSoon: false, aspect: "portrait" },
  { id: "reel2", type: "reel", platform: "instagram", url: "https://www.instagram.com/reel/DQZlbBBDUI8/", embedUrl: "https://www.instagram.com/reel/DQZlbBBDUI8/embed/", caption: "STOP SCROLLING", category: "bts", thumbnail: "https://i.pinimg.com/736x/ca/4c/3d/ca4c3d99ec1f11829085f297e181e.jpg", duration: "0:30", comingSoon: false, aspect: "portrait" },
  { id: "reel3", type: "reel", platform: "instagram", url: "https://www.instagram.com/reel/DQUqdejiATl/", embedUrl: "https://www.instagram.com/reel/DQUqdejiATl/embed/", caption: "Creative Process", category: "process", thumbnail: "https://i.pinimg.com/736x/78/c9/ea/78c9eaf18b002f146c8418acd1e92178.jpg", duration: "0:55", comingSoon: false, aspect: "portrait" },
  { id: "reel4", type: "reel", platform: "instagram", url: "https://www.instagram.com/reel/DQT4Z94jU5r/", embedUrl: "https://www.instagram.com/reel/DQT4Z94jU5r/embed/", caption: "Before and After Color grading", category: "colorGrading", thumbnail: "https://i.pinimg.com/736x/e8/63/0a/e8630a10e1df8d8d92c734b75bbde035.jpg", duration: "0:40", comingSoon: false, aspect: "portrait" },
  { id: "reel5", type: "reel", platform: "instagram", url: "https://www.instagram.com/reel/DQGvPfyjanE/", embedUrl: "https://www.instagram.com/reel/DQGvPfyjanE/embed/", caption: "Who knew cameras could do this", category: "edits", thumbnail: "https://i.pinimg.com/736x/9b/77/c2/9b77c2c30dc3bb2b825d3d834422b891.jpg", duration: "0:35", comingSoon: false, aspect: "portrait" },
  { id: "reel6", type: "reel", platform: "instagram", url: "https://www.instagram.com/reel/DQE1dc-CEMe/", embedUrl: "https://www.instagram.com/reel/DQE1dc-CEMe/embed/", caption: "Editing Session", category: "edits", thumbnail: "https://i.pinimg.com/736x/35/45/91/354591ef4d5d1b3f6924507dfc2de629.jpg", duration: "0:50", comingSoon: false, aspect: "portrait" },
  { id: "reel7", type: "reel", platform: "instagram", url: "https://www.instagram.com/reel/DP_QuEkCIid/", embedUrl: "https://www.instagram.com/reel/DP_QuEkCIid/embed/", caption: "Before and After Color", category: "colorGrading", thumbnail: "https://i.pinimg.com/736x/4c/69/3e/4c693ef6419bbe537d5cadb06287de2b.jpg", duration: "0:25", comingSoon: false, aspect: "portrait" },
  { id: "reel8", type: "reel", platform: "instagram", url: "https://www.instagram.com/reel/DPjdcv5iOgb/", embedUrl: "https://www.instagram.com/reel/DPjdcv5iOgb/embed/", caption: "Chioma MD", category: "bts", thumbnail: "https://i.pinimg.com/736x/d1/c6/c3/d1c6c343c3b226b55e6895c638eecf56.jpg", duration: "0:38", comingSoon: false, aspect: "portrait" }
];
