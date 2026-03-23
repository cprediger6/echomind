interface Alert {
  id: number;
  type: string;
  message: string;
  severity: "low" | "medium" | "high";
}

export default function AlertCard({ alert }: { alert: Alert }) {
  const severityColors = {
    low: "bg-blue-50 border-blue-400 text-blue-700",
    medium: "bg-yellow-50 border-yellow-400 text-yellow-700",
    high: "bg-red-50 border-red-400 text-red-700",
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-lg ${severityColors[alert.severity]}`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-xl">
            {alert.severity === "high" && "🔴"}
            {alert.severity === "medium" && "🟡"}
            {alert.severity === "low" && "🔵"}
          </span>
        </div>
        <div className="ml-3">
          <p className="text-sm">{alert.message}</p>
        </div>
      </div>
    </div>
  );
}
