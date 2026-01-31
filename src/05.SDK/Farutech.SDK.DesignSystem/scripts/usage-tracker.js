const fs = require('fs');
const path = require('path');

class UsageTracker {
  constructor() {
    this.trackingFile = path.join(__dirname, '../data/usage.json');
    this.ensureTrackingFile();
  }

  ensureTrackingFile() {
    if (!fs.existsSync(this.trackingFile)) {
      fs.writeFileSync(this.trackingFile, JSON.stringify({
        installs: [],
        projects: {},
        versions: {}
      }, null, 2));
    }
  }

  trackInstall(projectName, version, environment) {
    const data = JSON.parse(fs.readFileSync(this.trackingFile, 'utf8'));
    
    const install = {
      timestamp: new Date().toISOString(),
      project: projectName,
      version,
      environment
    };
    
    data.installs.push(install);
    
    // Actualizar estadísticas
    data.projects[projectName] = data.projects[projectName] || { installs: 0 };
    data.projects[projectName].installs++;
    
    data.versions[version] = data.versions[version] || { installs: 0 };
    data.versions[version].installs++;
    
    fs.writeFileSync(this.trackingFile, JSON.stringify(data, null, 2));
    
    // Enviar a servicio de analíticas (opcional)
    this.sendToAnalytics(install);
  }

  sendToAnalytics(install) {
    // Implementar envío a Google Analytics, Mixpanel, etc.
    console.log('📊 Tracking install:', install);
  }
}

module.exports = { UsageTracker };