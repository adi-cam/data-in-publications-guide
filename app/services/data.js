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

export default class extends Service {
  topics = {};

  async load() {
    // load data
    const [rawRecommendations, rawResources, rawExamples, rawTopics] = await Promise.all([
      loadJSON('/eu-pubwiz/recommendations.json'),
      loadJSON('/eu-pubwiz/resources.json'),
      loadJSON('/eu-pubwiz/examples.json'),
      loadJSON('/eu-pubwiz/topics.json'),
    ]);

    // reset state
    this.topics = [];

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

    // prepare recommendations
    let id = 1;
    const recommendations = [];
    for (let recommendation of rawRecommendations) {
      // parse gallery
      const galleryImages = recommendation['gallery-image'].split(',').filter((s) => !!s);
      const galleryTexts = recommendation['gallery-text'].split('|').filter((s) => !!s);

      // add recommendation
      recommendations.push({
        id: id++,
        topic: recommendation['topic'],
        title: recommendation['title'] || recommendation['title old'],
        why: recommendation['why'],
        how: recommendation['how'],
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

    // group recommendations
    const groupedRecommendations = groupBy(recommendations, 'topic');

    // add topics
    for (let topic of rawTopics) {
      this.topics.push({
        name: topic['topic'],
        icon: topic['icon'],
        title: topic['title'],
        description: topic['description'],
        recommendations: groupedRecommendations[topic['topic']],
      });
    }
  }
}
