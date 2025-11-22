"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./sidebar.module.css";

/**
 * Список тегов, которые поддерживает backend / UI.
 * "all" — специальный элемент, который показывает все заметки.
 */
const TAGS = ["all", "Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function DefaultSidebar() {
  const pathname = usePathname() || "";
  // pathname: /notes/filter/{tag} or others — извлечём текущий tag
  const match = pathname.match(/^\/notes\/filter\/([^\/\?]+)/);
  const activeTag = match ? decodeURIComponent(match[1]) : "all";

  return (
    <nav className={css.sidebar} aria-label="Notes filters">
      <h3 className={css.title}>Filters</h3>
      <ul className={css.list}>
        {TAGS.map((t) => {
          const href = `/notes/filter/${encodeURIComponent(t)}`;
          const isActive = t === activeTag;
          return (
            <li key={t} className={css.item}>
              <Link
                href={href}
                className={isActive ? `${css.link} ${css.active}` : css.link}
                aria-current={isActive ? "page" : undefined}
              >
                {t === "all" ? "All" : t}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
