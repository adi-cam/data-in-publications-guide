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
      loadJSON('/data-in-publications-guide/recommendations.json'),
      loadJSON('/data-in-publications-guide/resources.json'),
      loadJSON('/data-in-publications-guide/examples.json'),
      loadJSON('/data-in-publications-guide/topics.json'),
    ]);

    // reset state
    this.topics = [];

    // prepare resources
    const resources = {};
    for (let resource of rawResources) {
      resources[resource['id']] = {
        title: resource['title'],
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
    const recommendations = [];
    for (let recommendation of rawRecommendations) {
      // parse gallery
      const galleryImages = recommendation['gallery-image'].split(',').filter((s) => !!s);
      const galleryTexts = recommendation['gallery-text'].split('|').filter((s) => !!s);

      // add recommendation
      recommendations.push({
        id: recommendation['id'],
        topic: recommendation['topic'],
        title: recommendation['title'] || recommendation['title old'],
        why: recommendation['why'],
        how: recommendation['how'],
        howList: recommendation['how-list']
          .split('|')
          .map((s) => s.trim())
          .filter((s) => !!s),
        howAfter: recommendation['how-after'],
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
        related: recommendation['related'].split(',').filter((id) => !!id),
      });
    }

    // link recommendations
    const lookup = {};
    for (const rec of recommendations) {
      lookup[rec.id] = rec;
    }
    for (const rec of recommendations) {
      rec.related = rec.related.map((id) => {
        return { id: id, item: lookup[id] };
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
