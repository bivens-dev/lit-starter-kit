import {readdir, writeFile} from 'node:fs/promises';

const configuration = {
  sourcePath: '/build/src/pages',
  outputPath: '/www',
};

class StaticPageBuilder {
  #configuration;

  constructor(config) {
    this.#configuration = config;
  }

  async generate() {
    const sourcePath = new URL(
      `..${this.#configuration.sourcePath}`,
      import.meta.url
    ).pathname;

    const pageTemplates = await this.#getPages(sourcePath);
    for (const file of pageTemplates) {
      await this.#processFile(file);
    }
  }

  async #getPages(directory) {
    const pageFiles = new Set();

    try {
      const files = await readdir(directory, {recursive: true});
      for (const file of files) {
        if (file.endsWith('.js')) {
          pageFiles.add(`${directory}/${file}`);
        }
      }
    } catch (err) {
      console.error(err);
    }

    return pageFiles;
  }

  async #processFile(fileName) {
    const outputPath = new URL(
      `..${this.#configuration.outputPath}`,
      import.meta.url
    ).pathname;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const {pageHTML, pageInfo} = await import(fileName);

    const fileTarget = `${outputPath}/${pageInfo.path}`;

    await writeFile(fileTarget, pageHTML, {
      flag: 'w',
    });
  }
}

const pageBuilder = new StaticPageBuilder(configuration);
await pageBuilder.generate();
