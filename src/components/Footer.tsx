import { Facebook, Twitter, Youtube } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#platform" },
  { label: "Blogs", href: "#resources" },
  { label: "Contact Us", href: "#faq" },
];

const legalLinks = [
  { label: "Terms Of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

const socials = [
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
];

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#0a0c0c] text-white">
      {/* Teal glow rising from the bottom center */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[85%]"
        style={{
          background:
            "radial-gradient(60% 75% at 50% 100%, rgba(45,212,191,0.40), rgba(13,148,136,0.14) 38%, transparent 72%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-medium text-white/40 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[15px] text-white/75 hover:text-white transition"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-sm font-medium text-white/40 mb-5">Legal links</h3>
            <ul className="space-y-3">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[15px] text-white/75 hover:text-white transition"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Connect */}
          <div>
            <h3 className="text-sm font-medium text-white/40 mb-5">Stay Connected</h3>
            <div className="flex items-center gap-3">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-medium text-white/40 mb-5">Newsletter</h3>
            <p className="text-[15px] text-white/80 mb-4 leading-relaxed">
              You Read This Far, Might As Well Sign Up.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2 sm:p-1.5">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 sm:py-1.5 text-sm text-white placeholder-white/40 outline-none"
              />
              <button
                type="button"
                className="w-full sm:w-auto shrink-0 rounded-md bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Giant brand wordmark */}
      <div className="relative z-0 mt-10 sm:mt-16 flex justify-center">
        <h2 className="select-none whitespace-nowrap bg-linear-to-b from-zinc-50 via-zinc-200 to-zinc-100 bg-clip-text text-transparent font-extrabold tracking-tighter leading-[0.78] text-[20vw]">
          supportai
        </h2>
      </div>

      <div className="relative z-10 border-t border-white/5">
        <p className="py-6 text-center text-xs text-zinc-600">
          All copyright reserved © {new Date().getFullYear()} SupportAI
        </p>
      </div>
    </footer>
  );
};
