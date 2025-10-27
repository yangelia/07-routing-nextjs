import css from "./Filter.module.css";

type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

const NotesLayout = ({ children, sidebar }: Props) => {
  return (
    <section className={css.filter}>
      <aside>{sidebar}</aside>
      <div className={css.content}>{children}</div>
    </section>
  );
};

export default NotesLayout;
