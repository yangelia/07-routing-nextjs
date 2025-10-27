export default function NotesLayout({
  children,
  sidebar,
  modal,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <aside style={{ width: "250px", flexShrink: 0 }}>{sidebar}</aside>
        <main style={{ flex: 1 }}>{children}</main>
      </div>
      {modal}
    </>
  );
}
