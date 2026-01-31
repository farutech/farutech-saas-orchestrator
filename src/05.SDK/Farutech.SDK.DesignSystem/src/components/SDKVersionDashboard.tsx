import { useEffect, useState } from 'react';
import { Package, Calendar, Tag } from 'lucide-react';

interface SDKVersion {
  version: string;
  tag: string;
  published: string;
  commit: string;
  environment: 'dev' | 'qa' | 'staging' | 'prod';
}

export function SDKVersionDashboard() {
  const [versions, setVersions] = useState<SDKVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string>('');

  useEffect(() => {
    // Obtener versión actual del package.json
    fetch('/package.json')
      .then(res => res.json())
      .then(pkg => {
        setCurrentVersion(pkg.dependencies['@farutech/design-system']);
      });

    // Obtener todas las versiones disponibles
    fetch('https://api.github.com/repos/farutech/design-system/tags')
      .then(res => res.json())
      .then(tags => {
        const sdkVersions = tags
          .filter((tag: any) => tag.name.startsWith('v202'))
          .map((tag: any) => ({
            version: tag.name.replace('v', ''),
            tag: tag.name,
            published: new Date(tag.commit.committer.date).toLocaleDateString(),
            commit: tag.commit.sha.substring(0, 7),
            environment: tag.name.includes('alpha') ? 'dev' :
                        tag.name.includes('beta') ? 'qa' :
                        tag.name.includes('rc') ? 'staging' : 'prod'
          }));
        setVersions(sdkVersions);
      });
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center gap-3 mb-6">
        <Package className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">SDK Versions</h2>
          <p className="text-gray-600">Currently using: <strong>{currentVersion}</strong></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['dev', 'qa', 'staging', 'prod'].map(env => {
          const envVersions = versions.filter(v => v.environment === env);
          const latest = envVersions[0];
          
          return (
            <div key={env} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`h-3 w-3 rounded-full ${
                  env === 'dev' ? 'bg-yellow-500' :
                  env === 'qa' ? 'bg-blue-500' :
                  env === 'staging' ? 'bg-purple-500' : 'bg-green-500'
                }`} />
                <span className="font-semibold uppercase">{env}</span>
              </div>
              
              {latest ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Tag className="h-3 w-3" />
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {latest.version}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>{latest.published}</span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">No versions</p>
              )}
              
              <div className="mt-3 pt-3 border-t">
                <button
                  onClick={() => {
                    // Instalar esta versión
                    const tag = env === 'prod' ? 'latest' : env;
                    console.log(`Installing ${tag}...`);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Switch to {env}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}