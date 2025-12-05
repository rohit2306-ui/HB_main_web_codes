import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import userlogo from "../../assets/userlogo.png";

export default function PillNav({ logo, items }) {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* NAV WRAPPER */}
      <nav className="
        fixed top-3 left-1/2 -translate-x-1/2
        w-[92%] max-w-full md:w-[70%] lg:w-[55%] mx-auto
        backdrop-blur-lg bg-white/20 dark:bg-gray-800/40
        shadow-xl border border-white/30 dark:border-gray-700/40
        rounded-3xl px-4 py-2
        flex items-center justify-between
        z-[999] transition-all
      ">
        {/* LEFT LOGO */}
        <Link to="/feed" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 object-cover hover:scale-110 transition bg-black p-1 rounded-l"
          />
        </Link>

        {/* DESKTOP NAV */}
        <ul className="hidden md:flex gap-6 font-semibold text-sm">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`relative py-2 transition duration-200
                  ${pathname === item.href ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-200"}
                `}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="
                    absolute left-0 right-0 -bottom-1 mx-auto
                    w-full h-[3px]
                    bg-blue-600 dark:bg-blue-400 
                    rounded-full
                  " />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <img src={userlogo} className="w-9 h-9 rounded-full hover:scale-110 transition" />
          </Link>

          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center
              bg-white/30 dark:bg-black border border-white/20 dark:border-gray-700/40
              hover:scale-110 transition text-gray-900 dark:text-gray-200"
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/10 dark:bg-gray-700/30 hover:scale-110 transition"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
     <div className={`
  md:hidden fixed top-[70px] left-2 right-2
  bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl
  border border-white/20 dark:border-gray-700/30
  rounded-2xl shadow-xl p-4 flex flex-col gap-3
  transition-all duration-300 ease-in-out
  overflow-hidden
  ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
`}>

        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setOpen(false)}
            className="w-full py-3 rounded-xl text-gray-900 dark:text-gray-200 text-center font-semibold hover:bg-blue-600 hover:text-white transition"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
