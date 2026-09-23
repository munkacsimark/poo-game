import { useRef } from "react";
import fart1 from "./09037.mp3";
import fart2 from "./dry-fart.mp3";
import fart3 from "./fart-sound.mp3";
import fart4 from "./perfect-fart.mp3";

const FART_URLS = [fart1, fart2, fart3, fart4];

/** Returns a function that plays a random fart. Audio elements are created once and reused. */
export const useFartSound = () => {
  const pool = useRef<HTMLAudioElement[]>(null);

  return () => {
    pool.current ??= FART_URLS.map((url) => {
      const audio = new Audio(url);
      audio.preload = "auto";
      return audio;
    });
    const audio = pool.current[Math.floor(Math.random() * pool.current.length)];
    if (!audio) return;
    audio.currentTime = 0;
    // Autoplay can be blocked or the device muted; the game works without sound.
    audio.play().catch(() => {});
  };
};
