import fart1 from "./dry-fart.mp3";
import fart2 from "./09037.mp3";
import fart3 from "./fart-sound.mp3";
import fart4 from "./perfect-fart.mp3";

const farts = [fart1, fart2, fart3, fart4];
const getRandomFart = (): string =>
  farts[Math.floor(Math.random() * farts.length)];

export { getRandomFart };
