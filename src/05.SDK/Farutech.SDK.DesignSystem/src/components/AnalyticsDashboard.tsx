// En el SDK, exponer componente de analíticas
export function AnalyticsDashboard() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">SDK Usage Analytics</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">1,234</div>
          <div className="text-sm text-gray-600">Total Installs</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">45</div>
          <div className="text-sm text-gray-600">Active Projects</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">2026.01.31.0</div>
          <div className="text-sm text-gray-600">Latest Version</div>
        </div>
      </div>
    </div>
  );
}