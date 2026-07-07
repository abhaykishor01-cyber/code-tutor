export default function EmptyState({
  icon = "🔍",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card p-10 text-center">
      <p className="text-4xl mb-3" aria-hidden="true">
        {icon}
      </p>
      <h3 className="font-semibold text-lg">{title}</h3>
      {description && <p className="text-white/50 text-sm mt-2 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
