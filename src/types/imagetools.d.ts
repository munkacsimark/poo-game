// Import queries handled by vite-imagetools (see vite.config.ts).
declare module "*&as=srcset" {
  const srcset: string;
  export default srcset;
}

declare module "*&inline" {
  const dataUrl: string;
  export default dataUrl;
}

declare module "*&format=jpg" {
  const url: string;
  export default url;
}
