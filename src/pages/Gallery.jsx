import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import { motion, AnimatePresence } from "framer-motion";
import VideoModal from "../components/VideoModal";
import "./Gallery.css";
import { reels } from "../data/reels";

// YouTube API config (same source as Home page MusicCarousel)
const API_KEY = "AIzaSyBtwoYiS91VUqmFVAgBVhhQOEZaxhQqtQ4";
const PLAYLIST_ID = "PLt0fJ93Y4T4or_SqF7GybIBGZGjK8HG8t";

const portfolioData = {
  photography: {
    street: [
      { id: "street1", type: "image", src: "https://i.pinimg.com/736x/0b/36/1b/0b361b0bd9a37a8dbc507f3d87b771bb.jpg", caption: "City Life Moments", category: "street", aspect: "portrait", comingSoon: false },
      { id: "street2", type: "image", src: "https://i.pinimg.com/736x/ca/4c/3d/ca4c3d99ec1f116829085f297e19081e.jpg", caption: "Urban Exploration", category: "street", aspect: "portrait", comingSoon: false },
      { id: "street3", type: "image", src: "https://i.pinimg.com/736x/78/c9/ea/78c9eaf18b002f146c8418acd1e92178.jpg", caption: "Cityscape Stories", category: "street", aspect: "portrait", comingSoon: false },
      { id: "street4", type: "image", src: "https://i.pinimg.com/736x/e8/63/0a/e8630a10e1df8d8d92c734b75bbde035.jpg", caption: "Urban Documentary", category: "street", aspect: "portrait", comingSoon: false },
      { id: "street5", type: "image", src: "https://i.pinimg.com/736x/9b/77/c2/9b77c2c30dc3bb2b825d3d834422b891.jpg", caption: "Street Fashion Moments", category: "street", aspect: "portrait", comingSoon: false },
      { id: "street6", type: "image", src: "https://i.pinimg.com/736x/35/45/91/354591ef4d5d1b3f6924507dfc2de629.jpg", caption: "Urban Landscape", category: "street", aspect: "portrait", comingSoon: false },
      { id: "street7", type: "image", src: "https://i.pinimg.com/736x/4c/69/3e/4c693ef6419bbe537d5cadb06287de2b.jpg", caption: "City Rhythm", category: "street", aspect: "portrait", comingSoon: false },
      { id: "street8", type: "image", src: "https://i.pinimg.com/736x/d1/c6/c3/d1c6c343c3b226b55e6895c638eecf56.jpg", caption: "Street Hustle", category: "street", aspect: "portrait", comingSoon: false }
    ],
    lifestyle: [
      { id: "lifestyle1", type: "image", src: "https://i.pinimg.com/736x/44/39/87/443987dfaa6123232313b6e35a14a965.jpg", caption: "Sacred Moments", category: "lifestyle", aspect: "portrait", comingSoon: false },
      { id: "lifestyle2", type: "image", src: "https://i.pinimg.com/736x/f0/dc/00/f0dc0063923a50011fa719393f473711.jpg", caption: "Real Moments Captured", category: "lifestyle", aspect: "portrait", comingSoon: false },
      { id: "lifestyle3", type: "image", src: "https://i.pinimg.com/736x/d3/1c/68/d31c686cc9086e703792e770f162408f.jpg", caption: "Daily Life ", category: "lifestyle", aspect: "portrait", comingSoon: false },
      { id: "lifestyle4", type: "image", src: "https://i.pinimg.com/736x/2c/e5/2a/2ce52a98fcf8db6aeae8f339c3cfb113.jpg", caption: "Lifestyle Nailed", category: "lifestyle", aspect: "portrait", comingSoon: false },
      { id: "lifestyle5", type: "image", src: "https://i.pinimg.com/736x/58/0b/47/580b472ff15a062f419827cd60fb5a91.jpg", caption: "Everyday Moments", category: "lifestyle", aspect: "portrait", comingSoon: false },
      { id: "lifestyle6", type: "image", src: "https://i.pinimg.com/736x/52/ad/59/52ad59ac46b3fe67bbe61aa36883dab6.jpg", caption: "Natural Lifestyle", category: "lifestyle", aspect: "portrait", comingSoon: false },
      { id: "lifestyle7", type: "image", src: "https://i.pinimg.com/736x/b0/25/6e/b0256ec99db57be63433b8013f3544ed.jpg", caption: "Simplicity", category: "lifestyle", aspect: "portrait", comingSoon: false },
      { id: "lifestyle8", type: "image", src: "https://i.pinimg.com/736x/29/ee/8c/29ee8c6fda815628124cf37bc31c9730.jpg", caption: "Contemporary Living", category: "lifestyle", aspect: "portrait", comingSoon: false }
    ],
    urbanFashion: [
      { id: "fashion1", type: "image", src: "https://i.pinimg.com/736x/f1/67/43/f167434b585fc493bac0e7edf4adf160.jpg", caption: "Urban Fashion", category: "urbanFashion", aspect: "portrait", comingSoon: false },
      { id: "fashion2", type: "image", src: "https://i.pinimg.com/736x/5e/67/f7/5e67f72aa24e4155e53f77345586f667.jpg", caption: "Street Style Fashion", category: "urbanFashion", aspect: "portrait", comingSoon: false },
      { id: "fashion3", type: "image", src: "https://i.pinimg.com/736x/dd/a3/4b/dda34bdd826f8d5518ee8a3eb921382a.jpg", caption: "Fashion Streetwear", category: "urbanFashion", aspect: "portrait", comingSoon: false },
      { id: "fashion4", type: "image", src: "https://i.pinimg.com/736x/87/70/9a/87709aa42dba79366f3ddda215fffa3e.jpg", caption: "Fashion Unmatched", category: "urbanFashion", aspect: "portrait", comingSoon: false },
      { id: "fashion5", type: "image", src: "https://i.pinimg.com/736x/c6/5d/93/c65d93a78b21561999f8c50ea6a33961.jpg", caption: "Contemporary Fashion", category: "urbanFashion", aspect: "portrait", comingSoon: false },
      { id: "fashion6", type: "image", src: "https://i.pinimg.com/736x/8e/dd/2d/8edd2dee47ac4851cc267bdb6e8e953f.jpg", caption: "Street Fashion", category: "urbanFashion", aspect: "portrait", comingSoon: false },
      { id: "fashion7", type: "image", src: "https://i.pinimg.com/736x/5f/14/72/5f1472caae128d18d58a611f4dc551b4.jpg", caption: "Fashion in the City", category: "urbanFashion", aspect: "portrait", comingSoon: false },
      { id: "fashion8", type: "image", src: "https://i.pinimg.com/736x/43/00/de/4300de8250c19ec7ef3965e6fcc1cdb6.jpg", caption: "Park Stories", category: "urbanFashion", aspect: "portrait", comingSoon: false }
    ],
    studioPortraits: [
      { id: "studio1", type: "image", src: "https://i.pinimg.com/736x/0a/0c/f2/0a0cf2b64474b69ce4b80494ccc759d7.jpg", caption: "Professional Studio Portraits", category: "studioPortraits", aspect: "portrait", comingSoon: false },
      { id: "studio2", type: "image", src: "https://i.pinimg.com/736x/e1/09/b5/e109b532d5250b51d154d17fcdf97bfa.jpg", caption: "Creative Portrait Sessions", category: "studioPortraits", aspect: "portrait", comingSoon: false },
      { id: "studio3", type: "image", src: "https://i.pinimg.com/736x/80/0f/ec/800fec37235cbb07d2d0781aeb3d404c.jpg", caption: "Studio Portrait Series", category: "studioPortraits", aspect: "portrait", comingSoon: false },
      { id: "studio4", type: "image", src: "https://i.pinimg.com/736x/a6/56/4e/a6564ed1a820a0ddf4c1c342eda1e17b.jpg", caption: "Professional Headshots", category: "studioPortraits", aspect: "portrait", comingSoon: false },
      { id: "studio5", type: "image", src: "https://i.pinimg.com/736x/75/50/f7/7550f750563e71df1c7084242cabeeff.jpg", caption: "Creative Studio Lighting", category: "studioPortraits", aspect: "portrait", comingSoon: false },
      { id: "studio6", type: "image", src: "https://i.pinimg.com/736x/ee/1b/2c/ee1b2cd5f6b0484c67bb5da55281fa3e.jpg", caption: "Studio Portrait Art", category: "studioPortraits", aspect: "portrait", comingSoon: false },
      { id: "studio7", type: "image", src: "https://i.pinimg.com/736x/9c/3b/8b/9c3b8b36492eef7fc0b94eda0ec198ba.jpg", caption: "Professional Portraiture", category: "studioPortraits", aspect: "portrait", comingSoon: false },
      { id: "studio8", type: "image", src: "https://i.pinimg.com/736x/41/81/73/418173e09cd3d8f061954ef0ea61856f.jpg", caption: "Studio Character Portraits", category: "studioPortraits", aspect: "portrait", comingSoon: false }
    ],
    nightFilm: [
      { id: "night1", type: "image", src: "https://i.pinimg.com/736x/ea/5c/50/ea5c50fdf7ea9744ade0547e8bcab6d1.jpg", caption: "Night Scene Visuals", category: "nightFilm", aspect: "portrait", comingSoon: false },
      { id: "night2", type: "image", src: "https://i.pinimg.com/736x/e2/41/c2/e241c24664f9baafa1725ce0687f49d1.jpg", caption: "Night Photography", category: "nightFilm", aspect: "portrait", comingSoon: false },
      { id: "night3", type: "image", src: "https://i.pinimg.com/736x/96/eb/30/96eb3018e868aca300b39f7877634c0f.jpg", caption: "Night Shots", category: "nightFilm", aspect: "portrait", comingSoon: false },
      { id: "night4", type: "image", src: "https://i.pinimg.com/736x/5d/9d/21/5d9d21e3322115d18c2415dde25a3b30.jpg", caption: "City Photography", category: "nightFilm", aspect: "portrait", comingSoon: false },
      { id: "night5", type: "image", src: "https://i.pinimg.com/736x/e1/c3/9f/e1c39fc7c30633b931f76851638616f1.jpg", caption: "Night Scenes", category: "nightFilm", aspect: "portrait", comingSoon: false },
      { id: "night6", type: "image", src: "https://i.pinimg.com/736x/27/7a/ae/277aae5b85b8f6892f7244a2d9a02324.jpg", caption: "Culture Night Shots", category: "nightFilm", aspect: "portrait", comingSoon: false },
      { id: "night7", type: "image", src: "https://i.pinimg.com/736x/d0/a2/f6/d0a2f6e39c558702a9fcbc6bfb435965.jpg", caption: "Night Portraits", category: "nightFilm", aspect: "portrait", comingSoon: false },
      { id: "night8", type: "image", src: "https://i.pinimg.com/736x/26/44/b9/2644b9653087b1b47a39785c8d7d2d66.jpg", caption: "Urban Scenes", category: "nightFilm", aspect: "portrait", comingSoon: false }
    ],
    skateCulture: [
      { id: "skate1", type: "image", src: "https://i.pinimg.com/736x/f4/36/66/f43666feb114fef6dd0450ebcaedf1b3.jpg", caption: "Skate Culture Photography", category: "skateCulture", aspect: "portrait", comingSoon: false },
      { id: "skate2", type: "image", src: "https://i.pinimg.com/736x/37/92/4d/37924deefcfa09f285b2a189881d95b2.jpg", caption: "Action Skate Shots", category: "skateCulture", aspect: "portrait", comingSoon: false },
      { id: "skate3", type: "image", src: "https://i.pinimg.com/736x/53/72/9c/53729cf2b5137500c8d4a078505b2b05.jpg", caption: "Skate Action Photography", category: "skateCulture", aspect: "portrait", comingSoon: false },
      { id: "skate4", type: "image", src: "https://i.pinimg.com/736x/9e/b3/b9/9eb3b9541a0b071bbfb816b3e73e63c6.jpg", caption: "Skate Park Sessions", category: "skateCulture", aspect: "portrait", comingSoon: false },
      { id: "skate5", type: "image", src: "https://i.pinimg.com/736x/f0/dc/27/f0dc27eaf8ace94ce667dc28fab28b52.jpg", caption: "Skate Culture Portraits", category: "skateCulture", aspect: "portrait", comingSoon: false },
      { id: "skate6", type: "image", src: "https://i.pinimg.com/736x/ab/f6/f0/abf6f009bf68b2339b65995575986f89.jpg", caption: "Skate Lifestyle", category: "skateCulture", aspect: "portrait", comingSoon: false },
      { id: "skate7", type: "image", src: "https://i.pinimg.com/736x/5f/14/72/5f1472caae128d18d58a611f4dc551b4.jpg", caption: "Skate Action Shots", category: "skateCulture", aspect: "portrait", comingSoon: false },
      { id: "skate8", type: "image", src: "https://i.pinimg.com/736x/e4/d9/95/e4d995272b8e91ad1d693deae0d586f1.jpg", caption: "Skate Culture Moments", category: "skateCulture", aspect: "portrait", comingSoon: false }
    ],
    youthCulture: [
      { id: "youth1", type: "image", src: "https://i.pinimg.com/736x/68/a7/c4/68a7c48ab0c861354754fb7e57edc2d8.jpg", caption: "Youth Culture Group Shots", category: "youthCulture", aspect: "portrait", comingSoon: false },
      { id: "youth2", type: "image", src: "https://i.pinimg.com/736x/ab/8f/81/ab8f811560ada995ea22e56d3b32e317.jpg", caption: "Young Generation Stories", category: "youthCulture", aspect: "portrait", comingSoon: false },
      { id: "youth3", type: "image", src: "https://i.pinimg.com/736x/63/35/6f/63356f7ed745445770ed8ee1ce9370d0.jpg", caption: "Youth Group Portraits", category: "youthCulture", aspect: "portrait", comingSoon: false },
      { id: "youth4", type: "image", src: "https://i.pinimg.com/736x/15/15/36/151536a23daa17fe69be22f000fb460b.jpg", caption: "Young Culture Documentary", category: "youthCulture", aspect: "portrait", comingSoon: false },
      { id: "youth5", type: "image", src: "https://i.pinimg.com/736x/9b/ec/64/9bec641ed7dfd2f8970b84407531665e.jpg", caption: "Youth Lifestyle Shots", category: "youthCulture", aspect: "portrait", comingSoon: false },
      { id: "youth6", type: "image", src: "https://i.pinimg.com/736x/d5/e7/42/d5e742d83741506e9a35f813118b2ec6.jpg", caption: "Young Generation Portraits", category: "youthCulture", aspect: "portrait", comingSoon: false },
      { id: "youth7", type: "image", src: "https://i.pinimg.com/736x/c9/70/af/c970aff1eeb1f61661211e36b3cb904f.jpg", caption: "Youth Culture Moments", category: "youthCulture", aspect: "portrait", comingSoon: false },
      { id: "youth8", type: "image", src: "https://i.pinimg.com/736x/0a/f9/81/0af9811d5d42af83e92061256e44ba5e.jpg", caption: "Young Lifestyle Stories", category: "youthCulture", aspect: "portrait", comingSoon: false }
    ],
    FoundinTheFrame: [
      { id: "store1", type: "image", src: "https://i.pinimg.com/736x/f6/47/07/f647074319eefb36369076fb6cde4104.jpg", caption: "A story in hand", category: "foundinTheFrame", aspect: "portrait", comingSoon: false },
      { id: "store2", type: "image", src: "https://i.pinimg.com/736x/ec/e2/0b/ece20bffd1f819b80847457b594325c8.jpg", caption: "Lost in the Stack", category: "foundinTheFrame", aspect: "portrait", comingSoon: false },
      { id: "store3", type: "image", src: "https://i.pinimg.com/736x/52/cc/50/52cc509fdbd915528abeedbc2f74b6a6.jpg", caption: "Childhood Wonders", category: "foundinTheFrame", aspect: "portrait", comingSoon: false },
      { id: "store4", type: "image", src: "https://i.pinimg.com/736x/1b/ff/45/1bff45b68cb5eb1e2d9f30e01734917b.jpg", caption: "The 90's, Preserved", category: "foundinTheFrame", aspect: "portrait", comingSoon: false },
      { id: "store5", type: "image", src: "https://i.pinimg.com/736x/d0/36/18/d03618ef7477dd731ce1b81bc9b3b699.jpg", caption: "Discovery", category: "foundinTheFrame", aspect: "portrait", comingSoon: false },
      { id: "store6", type: "image", src: "https://i.pinimg.com/736x/76/94/e3/7694e3c729e3a1ab3e7f02a512c6426e.jpg", caption: "A Modern Moment", category: "foundinTheFrame", aspect: "portrait", comingSoon: false },
      { id: "store7", type: "image", src: "https://i.pinimg.com/736x/c2/a7/6b/c2a76b79809c51010461d125452a4131.jpg", caption: "The Art of Food", category: "foundinTheFrame", aspect: "portrait", comingSoon: false },
      { id: "store8", type: "image", src: "https://i.pinimg.com/736x/1e/c1/b0/1ec1b0f2175365238fd8c777f2a85667.jpg", caption: "Simple Choices", category: "foundinTheFrame", aspect: "portrait", comingSoon: false }
    ]
  },
 
  servicesShowcase: [
    { id: "service1", type: "image", src: "/Images/services/services/birthdayparty.jpg", caption: "Birthday Photography", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service2", type: "image", src: "/Images/services/services/colourgrading.jpg", caption: "Birthday Editing Session", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service3", type: "image", src: "/Images/services/services/commercialphoto.jpg", caption: "Commerial Photography", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service4", type: "image", src: "/Images/services/services/commercialvideo.jpg", caption: "Commerial Shoot", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service5", type: "image", src: "/Images/services/services/corporatecombo.jpg", caption: "Corporate Photography", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service6", type: "image", src: "/Images/services/services/fashionshowvideo.jpg", caption: "Fashion Show Photography", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service7", type: "image", src: "/Images/services/services/matricdancecombo.jpg", caption: "Matric Dance Shoot", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service8", type: "image", src: "/Images/services/services/matricdancevideo.jpeg", caption: "Matric Dance Photography", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service9", type: "image", src: "/Images/services/services/musicvideocombo.jpg", caption: "Music Video Photography", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service10", type: "image", src: "/Images/services/services/musicvideoediting.jpg", caption: "Music Video Editing Photography", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service11", type: "image", src: "/Images/services/services/musicvideophoto.jpg", caption: "Music Video Photography", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service12", type: "image", src: "/Images/services/services/personalphoto.jpg", caption: "Personal Photography", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service13", type: "image", src: "/Images/services/services/pexels-edwardeyer-1247756.jpg", caption: "Wedding Photography", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service14", type: "image", src: "/Images/services/services/pexels-rdne-7648474.jpg", caption: "Corporate Event Photography", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service15", type: "image", src: "/Images/services/services/Professional-matric-dance-photography-by-Loci-Photography.jpg", caption: "Matric Dance Photgraphy", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service16", type: "image", src: "/Images/services/services/weddingvideo.jpg", caption: "Wedding Photography", category: "services", aspect: "portrait", comingSoon: false },
    { id: "service17", type: "image", src: "/Images/services/services/matricdancefarewell.jpg", caption: "Matric Dance Photography", category: "services", aspect: "portrait", comingSoon: false },
  ],
 videography: [
  { id: "music1", type: "video", youtubeId: "AtvnwGUUL-s", caption: "BROTHERKUPA - CUPS AND FEELS (DIR, CRTVSHOTS)", category: "music", thumbnail: "https://i.ytimg.com/vi/AtvnwGUUL-s/hqdefault.jpg", duration: "2:26", aspect: "wide", comingSoon: false },
  { id: "music2", type: "video", youtubeId: "A2Nukp8GxA4", caption: "MASONCARTERX - STAR PLAYA (DIR, CRTVSHOTS)", category: "music", thumbnail: "https://i.ytimg.com/vi/A2Nukp8GxA4/hqdefault.jpg", duration: "1:34", aspect: "wide", comingSoon: false },
  { id: "creative1", type: "video", youtubeId: "0tLdaVd5SPY", caption: "CRTV DOCUMENTATION COMING SOON (hold on to this for a bit)", category: "creative", thumbnail: "https://i.ytimg.com/vi/0tLdaVd5SPY/hqdefault.jpg", duration: "0:52", aspect: "wide", comingSoon: false },
  { id: "music3", type: "video", youtubeId: "Pw9bu_28ErM", caption: "TRACK 6 - LAST MAN STANDING, PATRICKXXLEE & CRTVSHOTS SOON", category: "music", thumbnail: "https://i.ytimg.com/vi/Pw9bu_28ErM/hqdefault.jpg", duration: "0:29", aspect: "wide", comingSoon: false },
  { id: "creative2", type: "video", youtubeId: "t4ScHp-uogA", caption: "Behind the scenes of Kindlynxsh KAPTEIN official music video", category: "creative", thumbnail: "https://i.ytimg.com/vi/t4ScHp-uogA/hqdefault.jpg", duration: "7:07", aspect: "wide", comingSoon: false },
  { id: "creative3", type: "video", youtubeId: "h6PVah-yXFo", caption: "CRTV DOCUMENTARY EP.1 (INTRODUCTION)", category: "creative", thumbnail: "https://i.ytimg.com/vi/h6PVah-yXFo/hqdefault.jpg", duration: "2:49", aspect: "wide", comingSoon: false },
  { id: "creative4", type: "video", youtubeId: "oiecjjrZGt4", caption: "CRTV DOCUMENTARY EP.2", category: "creative", thumbnail: "https://i.ytimg.com/vi/oiecjjrZGt4/hqdefault.jpg", duration: "17:52", aspect: "wide", comingSoon: false },
  { id: "music4", type: "video", youtubeId: "n6i7p4Lgq70", caption: "BABYDAIZ - SIGNS OF BEING BOUJEE (DIR.CRTVSHOTS)", category: "music", thumbnail: "https://i.ytimg.com/vi/n6i7p4Lgq70/hqdefault.jpg", duration: "1:29", aspect: "wide", comingSoon: false },
  { id: "music5", type: "video", youtubeId: "H8oF4yLO9Zw", caption: "NEW CHOPPA-BROTHERKUPA ft. KINDLYNXSH & JAYKATANA(DIR.CRTVSHOTS)", category: "music", thumbnail: "https://i.ytimg.com/vi/H8oF4yLO9Zw/hqdefault.jpg", duration: "2:18", aspect: "wide", comingSoon: false }
]
};

const Gallery = () => {
  const [activeTab, setActiveTab] = useState("SHOWCASE");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [reelsLoaded, setReelsLoaded] = useState(false);
  const [ytVideos, setYtVideos] = useState([]);

  useEffect(() => {
    const loadInstagram = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
        setReelsLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
          setReelsLoaded(true);
        }
      };
      document.body.appendChild(script);
    };
    if (activeTab === "VIDEOGRAPHY" || activeTab === "SHOWCASE") {
      loadInstagram();
    }
  }, [activeTab]);

  // Fetch YouTube playlist (same as Home) and map to gallery video items
  useEffect(() => {
    async function fetchPlaylistVideos() {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${PLAYLIST_ID}&key=${API_KEY}`
        );
        const data = await res.json();
        const items = (data.items || []).map((video, idx) => {
          const vid = video.snippet?.resourceId?.videoId;
          const title = video.snippet?.title || "Untitled";
          const thumb = video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url || `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
          return {
            id: vid || `yt-${idx}`,
            type: "video",
            youtubeId: vid,
            caption: title,
            category: "music",
            thumbnail: thumb,
            duration: "", // Not available from this endpoint; hide badge when empty
            aspect: "wide",
            comingSoon: false,
          };
        }).filter(v => !!v.youtubeId);
        setYtVideos(items);
      } catch (err) {
        console.error("Error fetching YouTube playlist for Gallery:", err);
        setYtVideos([]);
      }
    }
    fetchPlaylistVideos();
  }, []);

const getCurrentContent = () => {
  switch (activeTab) {
    case "SHOWCASE":
      // For showcase: Show ALL services images + some skateCulture images
      const skateCultureImages = portfolioData.photography.skateCulture.slice(0, 7);
      const allShowcaseImages = [...portfolioData.servicesShowcase, ...skateCultureImages];
      // Prefer YouTube API videos from Home playlist; fallback to static videography
      const showcaseVideos = (ytVideos && ytVideos.length > 0) ? ytVideos.slice(0, 6) : portfolioData.videography.slice(0, 6);
      
      return {
        images: allShowcaseImages, 
        reels: reels.slice(0, 4),
        videos: showcaseVideos 
      };
    
    case "PHOTOGRAPHY":
      const photographyWithServices = {
        ...portfolioData.photography,
        services: portfolioData.servicesShowcase 
      };
      
      return {
        images: [...Object.values(portfolioData.photography).flat(), ...portfolioData.servicesShowcase],
        categories: photographyWithServices,
        reels: [],
        videos: []
      };
    
    case "VIDEOGRAPHY":
      return {
        images: [],
        reels: reels, 
        videos: (ytVideos && ytVideos.length > 0) ? ytVideos : portfolioData.videography 
      };
    
    default:
      return { images: [], reels: [], videos: [] };
  }
};

  const current = getCurrentContent();

  const handleVideoClick = item => setSelectedVideo(item);

  const ReelCard = (item, index) => {
    return (
      <motion.div
        key={item.id}
        className="reel-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => handleVideoClick(item)}
      >
        <div className="reel-thumb">
          <img src={item.thumbnail} alt={item.caption} />
          <div className="reel-badge">REEL</div>
          <div className="duration-badge">{item.duration}</div>
        </div>
        <div className="reel-info">
          <p>{item.caption}</p>
        </div>
      </motion.div>
    );
  };

  const VideoCard = (item, index) => {
    return (
      <motion.div
        key={item.id}
        className="video-card-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.03 }}
        onClick={() => handleVideoClick(item)}
      >
        <div className="video-thumb-wide">
          <img src={item.thumbnail} alt={item.caption} />
          {item.duration ? (
            <div className="duration-badge">{item.duration}</div>
          ) : null}
        </div>
        <div className="video-info-wide">
          <p>{item.caption}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="gallery-page">
      <Header />
      <div className="gallery-header">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="gallery-title">
          GALLERY
        </motion.h1>
        <div className="title-underline"></div>
        <motion.div className="filter-tabs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {["SHOWCASE", "PHOTOGRAPHY", "VIDEOGRAPHY"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`tab ${activeTab === t ? "active" : ""}`}>
              {t}
            </button>
          ))}
        </motion.div>
      </div>

      <div className="gallery-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {current.images.length > 0 && (
              <motion.div className="image-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                {current.categories ? (
                  Object.entries(current.categories).map(([cat, imgs]) => (
                    <div key={cat} className="category-section">
                      <h3 className="category-title">{cat.toUpperCase()}</h3>
                      <div className="image-grid">
                        {imgs.map((img, index) => (
                          <motion.div
                            key={img.id}
                            className="image-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="image-container">
                              <img src={img.src} alt={img.caption} />
                              <div className="image-overlay">
                                <p>{img.caption}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="image-grid showcase-grid">
                    {current.images.map((img, index) => (
                      <motion.div
                        key={img.id}
                        className="image-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }} // Faster animation for more items
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="image-container">
                          <img src={img.src} alt={img.caption} />
                          <div className="image-overlay">
                            <p>{img.caption}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {current.reels.length > 0 && (
              <motion.div className="reel-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <h3 className="video-section-title">REELS</h3>
                <div className="reels-grid">
                  {current.reels.map((r, i) => ReelCard(r, i))}
                </div>
              </motion.div>
            )}

            {current.videos.length > 0 && (
              <motion.div className="video-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <h3 className="video-section-title">FEATURED VIDEOS</h3>
                <div className="video-grid-wide">
                  {current.videos.map((v, i) => VideoCard(v, i))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>

  );
  
};

export default Gallery;