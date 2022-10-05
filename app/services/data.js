import Service from '@ember/service';
import fetch from 'fetch';

async function loadJSON(url) {
  const res = await fetch(url);
  return await res.json();
}

function groupBy(list, key) {
  return list.reduce((item, x) => {
    (item[x[key]] = item[x[key]] || []).push(x);
    return item;
  }, {});
}

function parseCondition(str) {
  return str ? str.split(',') : [];
}

export default class extends Service {
  recommendations = [];
  topics = {};
  topicNames = [];

  get groupedRecommendations() {
    return groupBy(this.recommendations, 'topic');
  }

  async load() {
    // load data
    const [rawRecommendations, rawResources, rawExamples, rawTopics] = await Promise.all([
      loadJSON('/eu-pubwiz/recommendations.json'),
      loadJSON('/eu-pubwiz/resources.json'),
      loadJSON('/eu-pubwiz/examples.json'),
      loadJSON('/eu-pubwiz/topics.json'),
    ]);

    // reset state
    this.recommendations = [];

    // prepare resources
    const resources = {};
    for (let resource of rawResources) {
      resources[resource['id']] = {
        title: resource['title'],
        short: resource['description'],
        link: resource['link'],
      };
    }

    // prepare examples
    const examples = {};
    for (let example of rawExamples) {
      examples[example['id']] = {
        title: example['title'],
        short: example['description'],
        link: example['link'],
      };
    }

    // reformat recommendations
    let id = 1;
    for (let recommendation of rawRecommendations) {
      // parse gallery
      const galleryImages = recommendation['gallery-image'].split(',').filter((s) => !!s);
      const galleryTexts = recommendation['gallery-text'].split('|').filter((s) => !!s);

      // add recommendation
      this.recommendations.push({
        id: id++,
        topic: recommendation['topic'],
        title: recommendation['title'] || recommendation['title old'],
        why: recommendation['why'],
        how: recommendation['how'],
        condition: parseCondition(recommendation['condition']),
        resources: recommendation['resources']
          .split(',')
          .filter((id) => !!id)
          .map((id) => resources[id]),
        contacts: recommendation['contacts']
          .split(',')
          .filter((id) => !!id)
          .map((id) => resources[id]),
        examples: recommendation['examples']
          .split(',')
          .filter((id) => !!id)
          .map((id) => examples[id]),
        image: recommendation['image'],
        gallery: galleryImages.map((image, index) => {
          return {
            image: image,
            text: galleryTexts[index],
          };
        }),
      });
    }

    // reformat topics
    for (let topic of rawTopics) {
      this.topics[topic['topic']] = {
        name: topic['topic'],
        icon: topic['icon'],
        title: topic['title'],
        description: topic['description'],
      };
      this.topicNames.push(topic['topic']);
    }
  }
}
