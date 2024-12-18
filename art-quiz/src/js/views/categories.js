import { View } from '../view.js';
import { downloader } from '../downloader.js';
import { localization } from '../localization.js';
import { templateReplacer } from '../templateReplacer.js';

export const view = new View({
  viewName: 'categories',
  funcs: {
    async getContext({ parameters }) {
      const categories = await downloader.getCategoriesFor(parameters.topic);
      const items = await downloader.getItemsFor(parameters.topic);
      return {
        categories: Object.entries(categories)
          .map(([key, info]) => {
            return `
            <li class="cards__item">
              <a class="card__link" href="#topics/${parameters.topic}/categories/${key}/rounds/0">
                <img class="card__image" src="${templateReplacer.replace(categories[key].baseUrl, { itemInd: Math.floor(Math.random() * items.length) })}">
                ${info.name[localization.getLocale()]}
              </a>
            </li>`;
          })
          .join('')
      };
    }
  }
});
