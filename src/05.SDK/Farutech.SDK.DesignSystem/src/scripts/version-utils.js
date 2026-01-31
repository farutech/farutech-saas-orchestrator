import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

class VersionManager {
  constructor() {
    this.packagePath = join(__dirname, '../package.json');
    this.packageJson = JSON.parse(readFileSync(this.packagePath, 'utf8'));
    this.currentVersion = this.packageJson.version;
  }

  // Parsear versión: 2026.01.31.0-alpha.1
  parseVersion(version) {
    const match = version.match(/^(\d{4})\.(\d{2})\.(\d{2})\.(\d+)(?:-(alpha|beta|rc)\.(\d+))?$/);
    if (!match) throw new Error(`Invalid version format: ${version}`);
    
    const [_, year, month, day, build, stage, stageNumber] = match;
    return {
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      build: parseInt(build),
      stage: stage || 'release',
      stageNumber: stageNumber ? parseInt(stageNumber) : 0
    };
  }

  formatVersion(parts) {
    let version = `${parts.year}.${String(parts.month).padStart(2, '0')}.${String(parts.day).padStart(2, '0')}.${parts.build}`;
    if (parts.stage !== 'release') {
      version += `-${parts.stage}.${parts.stageNumber}`;
    }
    return version;
  }

  // Obtener fecha actual en formato YYYY.MM.DD
  getToday() {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: parseInt(String(now.getMonth() + 1).padStart(2, '0')),
      day: parseInt(String(now.getDate()).padStart(2, '0'))
    };
  }

  // Verificar si la versión es de hoy
  isToday(versionParts) {
    const today = this.getToday();
    return versionParts.year === today.year && 
           versionParts.month === today.month && 
           versionParts.day === today.day;
  }

  // Incrementar alpha (dev)
  incrementAlpha() {
    let parts = this.parseVersion(this.currentVersion);
    const today = this.getToday();
    
    // Si no es de hoy, resetear a nueva versión del día
    if (!this.isToday(parts)) {
      parts = { ...today, build: 0, stage: 'alpha', stageNumber: 1 };
    } else if (parts.stage === 'alpha') {
      parts.stageNumber++;
    } else {
      // Si estaba en beta/rc, volver a alpha
      parts.build++;
      parts.stage = 'alpha';
      parts.stageNumber = 1;
    }
    
    return this.formatVersion(parts);
  }

  // Promover a beta (qa)
  promoteToBeta() {
    let parts = this.parseVersion(this.currentVersion);
    
    if (parts.stage === 'alpha') {
      parts.stage = 'beta';
      parts.stageNumber = 1;
    } else if (parts.stage === 'beta') {
      parts.stageNumber++;
    } else {
      throw new Error(`Cannot promote ${parts.stage} to beta`);
    }
    
    return this.formatVersion(parts);
  }

  // Promover a rc (staging)
  promoteToRc() {
    let parts = this.parseVersion(this.currentVersion);
    
    if (parts.stage === 'beta') {
      parts.stage = 'rc';
      parts.stageNumber = 1;
    } else if (parts.stage === 'rc') {
      parts.stageNumber++;
    } else {
      throw new Error(`Cannot promote ${parts.stage} to rc`);
    }
    
    return this.formatVersion(parts);
  }

  // Promover a release (prod)
  promoteToRelease() {
    let parts = this.parseVersion(this.currentVersion);
    
    if (parts.stage === 'rc') {
      parts.stage = 'release';
      delete parts.stageNumber;
    } else {
      throw new Error(`Cannot promote ${parts.stage} to release`);
    }
    
    return this.formatVersion(parts);
  }

  updateVersion(newVersion) {
    this.packageJson.version = newVersion;
    writeFileSync(this.packagePath, JSON.stringify(this.packageJson, null, 2));
    console.log(`✅ Version updated: ${this.currentVersion} → ${newVersion}`);
    return newVersion;
  }
}

export default { VersionManager };