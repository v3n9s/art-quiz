import { View } from '../view.js';
import { downloader } from '../downloader.js';
import { localization } from '../localization.js';

export const view = new View({
  viewName: 'menu',
  funcs: {
    async getContext() {
      const topics = await downloader.getTopics();
      return {
        topics: Object.entries(topics)
          .map(([key, info]) => {
            return `
            <li class="cards__item">
              <a class="card__link" href="#topics/${key}">
                <img class="card__image" src="${info.imageUrl}">
                ${info.name[localization.getLocale()]}
              </a>
            </li>`;
          })
          .join('')
      };
    }
  }
});
