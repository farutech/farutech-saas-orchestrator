// scripts/version-beta.js (para qa)
import { VersionManager } from './version-utils';

const manager = new VersionManager();
const newVersion = manager.promoteToBeta();
manager.updateVersion(newVersion);