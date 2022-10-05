const Plugin = require('broccoli-plugin');
const { WatchedDir } = require('broccoli-source');

const csvParse = require('csv-parse/lib/sync');

class DataBuilder extends Plugin {
  build() {
    this.input.readdirSync('.').forEach((path) => {
      // read file
      const file = this.input.readFileSync(path);

      // parse csv
      const data = csvParse(file, {
        columns: true,
      });

      // write json
      this.output.writeFileSync(path.replace('.csv', '.json'), JSON.stringify(data));
    });
  }
}

module.exports = function () {
  return new DataBuilder([new WatchedDir('data')]);
};
