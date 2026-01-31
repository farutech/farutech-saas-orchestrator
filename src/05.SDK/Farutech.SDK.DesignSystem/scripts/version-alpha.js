// scripts/version-alpha.js (para dev)
import { VersionManager } from './version-utils';

const manager = new VersionManager();
const newVersion = manager.incrementAlpha();
manager.updateVersion(newVersion);