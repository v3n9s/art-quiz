import { View } from '../view.js';
import { templateReplacer } from '../templateReplacer.js';
import { downloader } from '../downloader.js';
import { localization } from '../localization.js';

export const view = new View({
  viewName: 'results',
  funcs: {
    async beforeLoad() {
      await downloader.getTopics();
    },
    async getContext() {
      if (!localStorage.getItem('matches')) {
        return { results: (await downloader.getTopics()).results.empty[localization.getLocale()] };
      }
      return {
        results: (await Promise.all(JSON.parse(localStorage.getItem('matches'))
          .map(async (match) => {
            const category = (await downloader.getCategoriesFor(match.topic))[match.category];
            return templateReplacer.replace(`
            <li class="cards__item results__item">
              <a class="result__link">
                <div class="result__datetime">{{datetime}}</div>
                <div class="result__topic">{{topic}}</div>
                <img class="result__image" src="{{imageUrl}}">
                <div class="result__category">{{category}}</div>
                <div class="result__answers">{{rightAnswers}}/{{answersAmount}}</div>
              </a>
            </li>`, {
              topic: category.name[localization.getLocale()],
              imageUrl: category.imageUrl,
              category: category.name[localization.getLocale()],
              rightAnswers: match.rounds.filter(({ userAnswer, rightAnswer }) => {
                return userAnswer === rightAnswer;
              }).length,
              answersAmount: match.rounds.length,
              datetime: (new Date(match.endTime)).toLocaleString()
            });
          })))
          .reverse()
          .join('')
      };
    }
  }
});
