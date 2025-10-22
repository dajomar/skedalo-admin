import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export default function LanguageSwitcher() {
  
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentLang = languages.find((l) => l.code === i18n.resolvedLanguage) || languages[0];

  const current = i18n.resolvedLanguage;
  const selected = languages.find((l) => l.code === current) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setOpen(false); // cerrar el menú
  };

    // cerrar dropdown al hacer clic afuera
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };


      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, []);
  
// cerrar dropdown al hacer scroll afuera
useEffect(() => {
  

  const handleScroll = () => {
    setOpen(false);
  };

  document.addEventListener("scroll", handleScroll);
  return () => document.removeEventListener("scroll", handleScroll);
}, []);


  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
         onClick={(e) => {
          e.stopPropagation(); // evita que el document click cierre inmediatamente
          setOpen((prev) => !prev);
        }}
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white 
                   px-3 py-2 text-sm text-gray-700 shadow-sm 
                   dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      >
        <span>{currentLang.flag}</span>
        <span className="text-sm" >{currentLang.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-md border border-gray-200 
                        bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50">
          <ul className="py-1">
            {languages.map((l) => (
              <li key={l.code}>
                <button
                  onClick={() => changeLanguage(l.code)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm 
                             text-gray-700 hover:bg-gray-100 
                             dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  {l.flag} {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
