if (typeof globalThis.CustomEvent === 'undefined') {
  globalThis.CustomEvent = class CustomEvent extends Event {
    constructor(type, params = {}) {
      super(type, params);
      this.detail = params.detail;
    }
  };
}

await import('../node_modules/vite/bin/vite.js');
