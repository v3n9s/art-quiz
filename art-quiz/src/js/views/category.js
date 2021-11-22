import { View } from '../view.js';
import { createMatch } from '../match.js';
import { templateReplacer } from '../templateReplacer.js';
import { downloader } from '../downloader.js';
import { localization } from '../localization.js';

export const view = new View({
  viewName: 'category',
  funcs: {
    async beforeLoad({ parameters }) {
      if (!this.match
        || +parameters.roundInd === 0) {
        this.match = await createMatch({
          topicName: parameters.topic,
          categoryName: parameters.category
        });
      }
    },
    async getContext({ parameters }) {
      const category = (await downloader.getCategoriesFor(parameters.topic))[parameters.category];
      const items = await downloader.getItemsFor(parameters.topic);
      const round = this.match.rounds[parameters.roundInd];
      return {
        question: round.question,
        questionContent: round.questionContent,
        roundInd: parameters.roundInd,
        answers: round.answers
          .map((answer) => {
            const itemInd = items.findIndex((item) => item[category.answer] === answer);
            return templateReplacer.replace(
              category.answerContent,
              {
                answer: answer,
                imageUrl: templateReplacer.replace(category.baseUrl, { itemInd })
              }
            );
          })
          .join('')
      };
    },
    afterLoad({ parameters }) {
      this.runFunc('addListeners', { parameters });
      if (this.match.rounds[parameters.roundInd].userAnswer) {
        this.runFunc('onAnswer', { parameters, answer: this.match.rounds[parameters.roundInd].userAnswer });
      }
    },
    addListeners({ parameters }) {
      document.querySelector('#round').addEventListener('click', async (event) => {
        if (event.target.matches('[data-answer]') && !this.match.rounds[parameters.roundInd].userAnswer) {
          this.runFunc('onAnswer', { parameters, answer: event.target.dataset.answer });
        } else if (event.target.matches('[data-end-game]')) {
          this.runFunc('onGameEnd', { parameters });
        }
      });
    },
    async onAnswer({ parameters, answer }) {
      const roundTemplates = await downloader.getRoundTemplates();
      this.match.rounds[parameters.roundInd].userAnswer = answer;
      const rightAnswer = this.match.rounds[parameters.roundInd].rightAnswer;

      if (answer !== rightAnswer) {
        [...document.querySelectorAll('.answers__item')]
          .find((elem) => elem.dataset.answer === answer)
          .classList.add('answers__item_wrong');
      }
      [...document.querySelectorAll('.answers__item')]
        .find((elem) => elem.dataset.answer === rightAnswer)
        .classList.add('answers__item_right');
      document.querySelector('.answers__list').classList.add('answers__list_answered');

      if (+parameters.roundInd + 1 === this.match.rounds.length) {
        document.querySelector('.answers__list').innerHTML += templateReplacer.replace(roundTemplates.resultsContent, {
          results: roundTemplates.results[localization.getLocale()]
        });
      } else {
        document.querySelector('.answers__list').innerHTML += templateReplacer.replace(roundTemplates.nextLevelContent, {
          topic: parameters.topic,
          category: parameters.category,
          roundInd: +parameters.roundInd + 1,
          nextLevel: roundTemplates.nextLevel[localization.getLocale()]
        });
      }
    },
    async onGameEnd({ parameters }) {
      const category = (await downloader.getCategoriesFor(parameters.topic))[parameters.category];
      const items = await downloader.getItemsFor(parameters.topic);
      this.match.endTime = Date.now();
      const itemInd = Math.floor(Math.random() * items.length);
      this.match.imageUrl = templateReplacer.replace(category.baseUrl, { itemInd });
      let matches = JSON.parse(localStorage.getItem('matches'));
      if (!matches) {
        localStorage.setItem('matches', JSON.stringify([]));
        matches = [];
      }
      matches.push(this.match);
      localStorage.setItem('matches', JSON.stringify(matches));
      this.match = undefined;
    }
  }
});
