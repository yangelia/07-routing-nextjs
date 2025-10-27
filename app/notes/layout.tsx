import { ReactNode } from "react";

interface NotesLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function NotesLayout({ children, modal }: NotesLayoutProps) {
  return (
    <>
      <div
        style={{
          minHeight: "calc(100vh - 200px)",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        {children}
      </div>
      {modal}
    </>
  );
}
