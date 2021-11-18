import { View } from '../view.js';

export const view = new View({
  viewName: 'menu',
  funcs: {
    async render() {
      return this.getTemplate();
    }
  }
});
