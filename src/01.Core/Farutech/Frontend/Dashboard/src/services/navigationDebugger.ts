// services/navigationDebugger.ts
class NavigationDebugger {
  private static instance: NavigationDebugger;
  private logs: Array<{timestamp: Date; type: string; data: any}> = [];

  static getInstance() {
    if (!NavigationDebugger.instance) {
      NavigationDebugger.instance = new NavigationDebugger();
    }
    return NavigationDebugger.instance;
  }

  log(type: string, data: any) {
    const entry = { timestamp: new Date(), type, data };
    this.logs.push(entry);
    console.log(`🔍 [${type.toUpperCase()}]`, data);
    
    // Guardar en localStorage para debugging
    if (import.meta.env.DEV) {
      localStorage.setItem('nav_debug', JSON.stringify(this.logs.slice(-10)));
    }
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const debug = NavigationDebugger.getInstance();