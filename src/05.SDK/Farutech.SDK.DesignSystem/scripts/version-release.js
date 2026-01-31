// scripts/version-release.js (para prod)
import { VersionManager } from './version-utils';

const manager = new VersionManager();
const newVersion = manager.promoteToRelease();
manager.updateVersion(newVersion);