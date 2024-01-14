import {readdir, rm} from 'node:fs/promises';

const configuration = {
  sourcePath: '/src',
  fileExtensions: ['compiled.css', '.css.ts', '.css.js', '.css.map'],
  wireitFolder: true,
  buildFolder: true,
};

class BuildCleaner {
  #configuration;

  constructor(config) {
    this.#configuration = config;
  }

  async clean() {
    const sourcePath = new URL(
      `..${this.#configuration.sourcePath}`,
      import.meta.url
    ).pathname;

    const filesForRemoval = await this.getSourceFiles(sourcePath);

    for (const file of filesForRemoval) {
      rm(file);
    }

    await this.cleanWireit();
    await this.cleanBuild();
  }

  async getSourceFiles(directory) {
    const matchingFiles = new Set();

    try {
      const files = await readdir(directory, {recursive: true});
      for (const file of files) {
        for (const extension of this.#configuration.fileExtensions) {
          if (file.endsWith(extension)) {
            matchingFiles.add(`${directory}/${file}`);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }

    return matchingFiles;
  }

  async cleanWireit() {
    if (this.#configuration.wireitFolder) {
      const wireitPath = new URL('../.wireit', import.meta.url).pathname;
      await rm(wireitPath, {recursive: true, force: true});
    }
  }

  async cleanBuild() {
    if (this.#configuration.buildFolder) {
      const buildPath = new URL('../build', import.meta.url).pathname;
      await rm(buildPath, {recursive: true, force: true});
    }
  }
}

const buildCleaner = new BuildCleaner(configuration);
await buildCleaner.clean();
