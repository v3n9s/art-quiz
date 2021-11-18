import { View } from '../view.js';

export const view = new View({
  viewName: 'category',
  funcs: {
    async render() {
      return this.getTemplate();
    }
  }
});
