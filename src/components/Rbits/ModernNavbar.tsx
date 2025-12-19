import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { getCurrentUserData } from "../../services/authService";
import type { User } from "../../types";

type NavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

type Props = {
  logo: string;
  logoAlt?: string;
  items: NavItem[];
  className?: string;
  logoBg?: "auto" | "dark" | "light";
};

const ModernNavbar = ({ logo, logoAlt = "Logo", items, className = "", logoBg = "auto" }: Props) => {
  const { theme, toggleTheme } = useTheme();
  const { user: firebaseUser } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!firebaseUser) {
        if (mounted) setUserData(null);
        return;
      }
      const data = await getCurrentUserData(firebaseUser);
      if (mounted) setUserData(data);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [firebaseUser]);

  const isRouterLink = (href: string) =>
    href && !href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("//") &&
    !href.startsWith("mailto:") && !href.startsWith("tel:") && !href.startsWith("#");

  const baseWrap = "fixed top-2 left-0 right-0 z-[1000] flex justify-center";
  const shell =
    "w-[95%] md:w-[820px] lg:w-[980px] xl:w-[1080px] 2xl:w-[1200px] flex items-center justify-between rounded-2xl px-3 py-2 backdrop-blur-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-gray-900/60 shadow-sm";

  const linkBase =
    "relative inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200";

  const linkInactive = "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400";
  const linkActive = "text-blue-600 dark:text-blue-400";

  const logoBgClass = logoBg === "dark"
    ? "bg-gray-900 ring-1 ring-black/10"
    : logoBg === "light"
      ? "bg-white ring-1 ring-white/10"
      : theme === "light"
        ? "bg-gray-900 ring-1 ring-black/10"
        : "bg-white ring-1 ring-white/10";

  const ActiveMarker = () => (
    <span className="absolute left-1/2 -bottom-1 h-[2px] w-6 -translate-x-1/2 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
  );

  return (
    <div className={`${baseWrap} ${className}`}> 
      <nav className={shell} aria-label="Primary">
        {/* Left: Logo */}
        {isRouterLink(items?.[0]?.href) ? (
          <Link to={items[0].href} aria-label="Home" className="flex items-center gap-2.5 shrink-0">
            <div className={`h-9 w-9 rounded-md overflow-hidden flex items-center justify-center ${logoBgClass}`}>
              <img src={logo} alt={logoAlt} className="max-h-6 max-w-6 object-contain" />
            </div>
            <span className="hidden sm:block font-semibold leading-none tracking-wide text-gray-900 dark:text-gray-100">Hackbase</span>
          </Link>
        ) : (
          <a href={items?.[0]?.href || "#"} aria-label="Home" className="flex items-center gap-2.5 shrink-0">
            <div className={`h-9 w-9 rounded-md overflow-hidden flex items-center justify-center ${logoBgClass}`}>
              <img src={logo} alt={logoAlt} className="max-h-6 max-w-6 object-contain" />
            </div>
            <span className="hidden sm:block font-semibold leading-none tracking-wide text-gray-900 dark:text-gray-100">Hackbase</span>
          </a>
        )}

        {/* Center: Nav items */}
        <ul className="hidden md:flex items-center gap-1">
          {items.map((item) => {
            const active = location.pathname === item.href;
            const classes = `${linkBase} ${active ? linkActive : linkInactive}`;
            return (
              <li key={item.href} className="h-9 flex items-center">
                {isRouterLink(item.href) ? (
                  <Link to={item.href} aria-label={item.ariaLabel || item.label} className={classes}>
                    <span>{item.label}</span>
                    {active && <ActiveMarker />}
                  </Link>
                ) : (
                  <a href={item.href} aria-label={item.ariaLabel || item.label} className={classes}>
                    <span>{item.label}</span>
                    {active && <ActiveMarker />}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
           <Link
            to={"/my-hackathons"}
            className="hidden sm:inline-flex items-center justify-center h-9 px-3 rounded-full text-sm font-semibold bg-blue-800 text-white hover:bg-blue-600 transition-colors"
          >
            manage hackathons
          </Link>
          <Link
            to={"/host-hackathon"}
            className="hidden sm:inline-flex items-center justify-center h-9 px-3 rounded-full text-sm font-semibold bg-blue-800 text-white hover:bg-blue-600 transition-colors"
          >
            Host hackathon
          </Link>
          <Link
            to={"/dashboard"}
            className="hidden sm:inline-flex items-center justify-center h-9 px-3 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </Link>
          
         
          {userData && (
            <Link
              to={`/profile/${userData.username}`}
              aria-label="Profile"
              className="hidden md:inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-gray-800/70 hover:bg-white"
            >
              <img
                src={userData.avatar || "https://avatar.iran.liara.run/public"}
                alt="Profile"
                className="h-9 w-9 rounded-full object-cover"
              />
            </Link>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-gray-800/70 hover:bg-white transition-colors"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-gray-800/70 relative"
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col items-center justify-center">
              <span className={`block w-5 h-0.5 rounded bg-gray-900 dark:bg-gray-100 transition-transform duration-200 ${mobileOpen ? 'translate-y-1 rotate-45' : ''}`} />
              <span className={`block w-5 h-0.5 rounded bg-gray-900 dark:bg-gray-100 transition-all duration-200 ${mobileOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'} mt-1`} />
              <span className={`block w-5 h-0.5 rounded bg-gray-900 dark:bg-gray-100 transition-transform duration-200 ${mobileOpen ? '-translate-y-1 -rotate-45' : ''} mt-1`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[900] bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed top-16 left-0 right-0 z-[950] flex justify-center transition-all ${
          mobileOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="w-[95%] max-w-[980px] rounded-2xl px-3 py-3 backdrop-blur-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-gray-900/60 shadow-sm">
          <ul className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
            {userData && (
              <li className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <img
                    src={userData.avatar || 'https://avatar.iran.liara.run/public'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {userData.name}
                  </div>
                </div>
                <Link
                  to={`/profile/${userData.username}`}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center h-8 px-3 rounded-full text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
                >
                  View Profile
                </Link>
              </li>
            )}
          {items.map((item) => {
            const active = location.pathname === item.href;
            return (
              <li key={item.href}>
                {isRouterLink(item.href) ? (
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block w-full px-3 py-2 rounded-xl text-sm font-medium ${
                      active ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                    } hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block w-full px-3 py-2 rounded-xl text-sm font-medium ${
                      active ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                    } hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
           <div className="flex items-center justify-between pt-2">
            
            <Link
              to={"/host-hackathon"}
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center h-9 px-3 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              host hackathon
            </Link>

          </div>
          <div className="flex items-center justify-between pt-2">
            
            <Link
              to={"/dashboard"}
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center h-9 px-3 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-gray-800/70 hover:bg-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModernNavbar;