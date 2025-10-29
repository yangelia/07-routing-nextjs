interface FilterLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function FilterLayout({ children, sidebar }: FilterLayoutProps) {
  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <aside style={{ width: "250px" }}>{sidebar}</aside>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
