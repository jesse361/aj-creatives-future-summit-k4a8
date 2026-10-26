export const inputClass =
  "mt-2 w-full min-w-0 max-w-full border border-line bg-white px-3 py-3 text-base text-ink outline-none transition-colors focus:border-forest";

export const labelClass = "block min-w-0 max-w-full text-sm font-semibold text-ink";

export const buttonClass = (variant: "primary" | "secondary" | "light" | "ghost" | "gold" = "primary", className = "") => {
  const variants = {
    primary: "bg-forest text-ivory hover:bg-[#0c2e26]",
    secondary: "border border-white/40 text-ivory hover:border-gold hover:text-gold",
    light: "bg-ivory text-midnight hover:bg-white",
    ghost: "text-forest hover:bg-forest/10",
    gold: "bg-gold text-midnight hover:bg-[#e3c17a]",
  };
  return `inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-center text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`;
};
