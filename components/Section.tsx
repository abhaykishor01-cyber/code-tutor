export default function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-3 text-gold-400">{title}</h2>
      <div className="text-white/80 leading-relaxed">{children}</div>
    </section>
  );
}
