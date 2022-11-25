import fart1 from "url:~/src/assets/farts/dry-fart.mp3";
import fart2 from "url:~/src/assets/farts/09037.mp3";
import fart3 from "url:~/src/assets/farts/fart-sound.mp3";
import fart4 from "url:~/src/assets/farts/perfect-fart.mp3";

const farts = [fart1, fart2, fart3, fart4];
const getRandomFart = (): string =>
  farts[Math.floor(Math.random() * farts.length)];

export { getRandomFart };
