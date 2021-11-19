import { View } from '../view.js';
import { downloader } from '../downloader.js';
import { localization } from '../localization.js';
import { templateReplacer } from '../templateReplacer.js';

export const view = new View({
  viewName: 'categories',
  funcs: {
    async render(parameters) {
      const topics = await downloader.getTopics();
      const categories = await downloader.getCategoriesFor(parameters.topic);
      return templateReplacer.replace(await this.getTemplate(), {
        categories: Object.entries(categories)
          .map(([key, info]) => {
            return `
            <li class="cards__item">
              <a class="card__link" href="#topics/${parameters.topic}/categories/${key}">
                <img class="card__image" src="${topics[parameters.topic].imageUrl}">
                ${info.name[localization.getLocale()]}
              </a>
            </li>`;
          })
          .join('')
      });
    }
  }
});
