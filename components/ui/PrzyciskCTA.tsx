import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  wariant?: "pelny" | "obrys";
  zewnetrzny?: boolean;
  klasa?: string;
};

const SKOS = "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)";

/** Przycisk w stylu paneli kanału: ścięte rogi, czerwień, strzałki. */
export default function PrzyciskCTA({
  href,
  children,
  wariant = "pelny",
  zewnetrzny = true,
  klasa = "",
}: Props) {
  const bazowe =
    "group relative inline-flex items-center gap-3 px-7 py-4 font-sans text-sm font-extrabold uppercase tracking-[0.18em] transition-all duration-300 will-change-transform";

  const styl =
    wariant === "pelny"
      ? "bg-huk-red text-white hover:bg-huk-red-hot hover:shadow-neon-mocny"
      : "border border-white/25 text-white/80 hover:border-huk-red hover:text-white hover:shadow-neon";

  return (
    <Link
      href={href}
      target={zewnetrzny ? "_blank" : undefined}
      rel={zewnetrzny ? "noopener noreferrer" : undefined}
      className={`${bazowe} ${styl} ${klasa}`}
      style={{ clipPath: SKOS }}
    >
      <span className="text-huk-white/60 transition-transform duration-300 group-hover:translate-x-1">
        &gt;
      </span>
      {children}
      <span className="text-huk-white/60 transition-transform duration-300 group-hover:translate-x-1">
        &gt;&gt;
      </span>
    </Link>
  );
}
