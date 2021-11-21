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
        || this.match.topic !== parameters.topic
        || this.match.category !== parameters.category) {
        this.match = await createMatch({
          topicName: parameters.topic,
          categoryName: parameters.category
        });
      } else {
        const roundInd = this.match.rounds.findIndex((round) => !round.userAnswer);
        const locationHash = window.location.hash;
        window.location.hash = locationHash.slice(0, locationHash.lastIndexOf('/') + 1) + roundInd;
      }
    },
    async getContext({ parameters }) {
      const roundTemplates = await downloader.getRoundTemplates();
      const round = this.match.rounds[parameters.roundInd];
      return {
        question: round.question,
        questionContent: round.questionContent,
        roundInd: parameters.roundInd,
        answers: round.answers.map((answer) => templateReplacer.replace(roundTemplates.answerContent, { answer: answer })).join('')
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
    onGameEnd() {
      this.match.endTime = Date.now();
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
