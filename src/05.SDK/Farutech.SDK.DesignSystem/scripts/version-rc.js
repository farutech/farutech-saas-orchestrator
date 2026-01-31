// scripts/version-rc.js (para staging)
import { VersionManager } from './version-utils';

const manager = new VersionManager();
const newVersion = manager.promoteToRc();
manager.updateVersion(newVersion);