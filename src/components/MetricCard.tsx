interface MetricCardProps {
  title: string;
  icon: string;
  value: string;
  subtitle: string;
  trend: "normal" | "good" | "low" | "high";
  progress: number; // entre 0 y 1
}

export default function MetricCard({
  title,
  icon,
  value,
  subtitle,
  trend,
  progress,
}: MetricCardProps) {
  const trendColors = {
    normal: "text-gray-600",
    good: "text-green-600",
    low: "text-yellow-600",
    high: "text-blue-600",
  };

  const progressColor =
    progress > 0.7
      ? "bg-green-500"
      : progress > 0.4
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">Últimos 7 días</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span className={`ml-2 text-sm ${trendColors[trend]}`}>
          {trend === "good" && "👍"}
          {trend === "low" && "⚠️"}
          {trend === "high" && "📈"}
          {trend === "normal" && "✓"}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{subtitle}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${progressColor}`}
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
