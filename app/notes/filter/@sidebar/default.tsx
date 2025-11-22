import Link from "next/link";

const TAGS = ["all", "Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function DefaultSidebar() {
  return (
    <nav
      aria-label="Notes filters"
      style={{ padding: "1.5rem 1rem", borderRight: "1px solid #e5e7eb" }}
    >
      <h3 style={{ marginBottom: "1rem", fontWeight: 600 }}>Filters</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {TAGS.map((tag) => (
          <li key={tag} style={{ marginBottom: "0.5rem" }}>
            <Link
              href={`/notes/filter/${tag}`}
              style={{
                display: "inline-block",
                padding: "0.25rem 0.5rem",
                borderRadius: "6px",
                textDecoration: "none",
                color: "#111827",
                fontSize: "0.95rem",
              }}
            >
              {tag === "all" ? "All notes" : tag}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
