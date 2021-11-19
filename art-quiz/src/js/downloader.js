class Downloader {
  async getTopics() {
    if (!this.topics) {
      this.topics = await (await fetch('/assets/topics.json')).json();
    }
    return this.topics;
  }

  async getCategoriesFor(topicName) {
    await this.getTopics();
    if (!this.topics[topicName].categories) {
      this.topics[topicName].categories = await (await fetch(`/assets/topics/${topicName}/categories.json`)).json();
    }
    return this.topics[topicName].categories;
  }

  async getItemsFor(topicName) {
    await this.getTopics();
    if (!this.topics[topicName].items) {
      this.topics[topicName].items = await (await fetch(`/assets/topics/${topicName}/items.json`)).json();
    }
    return this.topics[topicName].items;
  }
}

export const downloader = new Downloader();
