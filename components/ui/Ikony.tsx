/** Ikony social — inline SVG, zero zależności i zero dodatkowych requestów. */

type P = { className?: string };
const wspolne = (k?: string) => ({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true as const,
  className: k,
});

export const IkonaTwitch = ({ className }: P) => (
  <svg {...wspolne(className)}>
    <path d="M4.3 3 3 6.5v12.2h4.2V21h2.3l2.3-2.3h3.4L21 14.1V3H4.3Zm15.2 10.3-2.6 2.6h-3.9l-2.3 2.3v-2.3H7.5V4.5h12v8.8ZM15.6 7.4h1.6v4.6h-1.6V7.4Zm-4.3 0h1.6v4.6h-1.6V7.4Z" />
  </svg>
);

export const IkonaYouTube = ({ className }: P) => (
  <svg {...wspolne(className)}>
    <path d="M21.6 7.2s-.2-1.4-.8-2c-.7-.8-1.6-.8-2-.9C16 4 12 4 12 4h-.1s-4 0-6.8.3c-.4 0-1.3 0-2 .8-.6.7-.8 2-.8 2S2 8.9 2 10.5v1.5c0 1.6.2 3.3.2 3.3s.2 1.4.8 2c.7.8 1.7.8 2.2.9 1.6.1 6.8.2 6.8.2s4 0 6.8-.3c.4-.1 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.5c0-1.6-.2-3.2-.2-3.2ZM9.9 14.6V9l5.2 2.8-5.2 2.8Z" />
  </svg>
);

export const IkonaInstagram = ({ className }: P) => (
  <svg {...wspolne(className)}>
    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2 0 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.8-.1Zm0 5.8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 6.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Zm5.1-6.7a.94.94 0 1 1-1.9 0 .94.94 0 0 1 1.9 0Z" />
  </svg>
);

export const IkonaTikTok = ({ className }: P) => (
  <svg {...wspolne(className)}>
    <path d="M16.6 2h-3v13.1a2.7 2.7 0 1 1-2.2-2.7V9.3a5.8 5.8 0 1 0 5.2 5.8V8.6a6.6 6.6 0 0 0 3.9 1.3V6.8a3.6 3.6 0 0 1-3.9-3.4V2Z" />
  </svg>
);

export const IkonaDiscord = ({ className }: P) => (
  <svg {...wspolne(className)}>
    <path d="M19.3 5.4a16.5 16.5 0 0 0-4.1-1.3l-.2.4a15 15 0 0 0-5.9 0l-.2-.4a16.5 16.5 0 0 0-4.1 1.3C2.2 9.3 1.5 13 1.8 16.7A16.6 16.6 0 0 0 6.9 19l.9-1.4a10.7 10.7 0 0 1-1.7-.8l.4-.3a11.9 11.9 0 0 0 10.1 0l.4.3a10.7 10.7 0 0 1-1.7.8L16 19a16.6 16.6 0 0 0 5.1-2.3c.4-4.3-.7-8-2.5-11.3ZM8.5 14.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
  </svg>
);

export const IkonaSerce = ({ className }: P) => (
  <svg {...wspolne(className)}>
    <path d="M12 20.8 4.6 13.4a4.8 4.8 0 0 1 0-6.8 4.8 4.8 0 0 1 6.8 0l.6.6.6-.6a4.8 4.8 0 0 1 6.8 6.8L12 20.8Z" />
  </svg>
);

export const IkonaMail = ({ className }: P) => (
  <svg {...wspolne(className)}>
    <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2 7.4-5.1H4.6L12 12.2Zm0 2.1L4 8.7V17h16V8.7l-8 5.6Z" />
  </svg>
);

export const IkonaPlay = ({ className }: P) => (
  <svg {...wspolne(className)}>
    <path d="M8 5.1v13.8L19 12 8 5.1Z" />
  </svg>
);
