import { View } from '../view.js';

export const view = new View({
  viewName: 'categories',
  funcs: {
    async render() {
      return this.getTemplate();
    }
  }
});
