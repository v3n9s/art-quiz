import { downloader } from './downloader.js';
import { templateReplacer } from './templateReplacer.js';
import { localization } from './localization.js';

export async function createMatch({ topicName, categoryName }) {
  const items = await downloader.getItemsFor(topicName);
  const category = (await downloader.getCategoriesFor(topicName))[categoryName];
  const usedIndices = [];
  return {
    topic: topicName,
    category: categoryName,
    rounds: [...new Array(10)].map(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * items.length);
      }
      while (usedIndices.includes(randomIndex));
      usedIndices.push(randomIndex);
      const item = items[randomIndex];
      const imageUrl = templateReplacer.replace(category.baseUrl, { itemInd: randomIndex });
      return {
        question: templateReplacer.replace(category.question[localization.getLocale()], item),
        questionContent: templateReplacer.replace(category.questionContent, { imageUrl }),
        rightAnswer: item[category.answer],
        answers: [
          ...items
            .reduce((filterItems, filterItem) => {
              if (!filterItems.includes(filterItem[category.answer])
              && filterItem[category.answer] !== item[category.answer]) {
                if (!category.unique) filterItems.push(filterItem[category.answer]);
                else if (filterItem[category.unique] !== item[category.unique]) {
                  filterItems.push(filterItem[category.answer]);
                }
              }
              return filterItems;
            }, [])
            .sort(() => Math.random() - 0.5)
            .slice(0, 3),
          item[category.answer]
        ].sort(() => Math.random() - 0.5)
      };
    })
  };
}
