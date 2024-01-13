import {readdir, readFile, writeFile} from 'node:fs/promises';
import {transform} from 'lightningcss';
// eslint-disable-next-line node/no-extraneous-import
import * as prettier from 'prettier';

const configuration = {
  sourcePath: '/src',
  outputPath: '/build',
  minify: false,
  lit: {
    enabled: true,
    typescript: true,
  },
  native: {
    enabled: true,
    sourceMaps: true,
  },
};

class StylesheetProcessor {
  #configuration;

  constructor(config) {
    this.#configuration = config;
  }

  async start() {
    const sourcePath = new URL(
      `..${this.#configuration.sourcePath}`,
      import.meta.url
    ).pathname;

    const cssFiles = await this.getSourceFiles(sourcePath);

    for (const file of cssFiles) {
      const results = await this.#processFile(file);
      await this.#writeNativeFile(results);
      this.#writeLitFile(results);
    }
  }

  async getSourceFiles(directory) {
    const cssFiles = new Set();

    try {
      const files = await readdir(directory, {recursive: true});
      for (const file of files) {
        if (file.endsWith('.css')) {
          cssFiles.add(`${directory}/${file}`);
        }
      }
    } catch (err) {
      console.error(err);
    }

    return cssFiles;
  }

  async #processFile(fileName) {
    const fileContents = await readFile(fileName);
    const {code, map} = transform({
      filename: fileName,
      code: fileContents,
      minify: this.#configuration.minify,
      sourceMap: this.#configuration.native.sourceMaps,
    });

    const results = {
      cssFile: code,
      sourceMap: map,
      fileName: fileName,
    };

    return results;
  }

  async #writeNativeFile(resultsObject) {
    if (!this.#configuration.native.enabled) {
      return;
    }

    if (this.#configuration.native.sourceMaps) {
      const sourceMapFileName = `${resultsObject.fileName.replace(
        this.#configuration.sourcePath,
        `${this.#configuration.outputPath}${this.#configuration.sourcePath}`
      )}.map`;

      await writeFile(sourceMapFileName, resultsObject.sourceMap, {flag: 'w'});
    }

    const stylesheetFileName = `${resultsObject.fileName.replace(
      this.#configuration.sourcePath,
      `${this.#configuration.outputPath}${this.#configuration.sourcePath}`
    )}`;

    await writeFile(stylesheetFileName, resultsObject.cssFile, {flag: 'w'});
  }

  async #writeLitFile(resultsObject) {
    if (!this.#configuration.lit.enabled) {
      return;
    }

    const fileOutput = `
      // AUTO GENERATED FILE: DO NOT EDIT BY HAND
      import {css} from 'lit';
        export const styles = css\`
        ${resultsObject.cssFile}\`;
      `;

    const formattedOutput = await prettier.format(fileOutput, {
      parser: 'typescript',
    });

    if (this.#configuration.lit.typescript) {
      const typescriptFileName = resultsObject.fileName + '.ts';

      await writeFile(typescriptFileName, formattedOutput, {flag: 'w'});
    } else {
      const javascriptFileName = resultsObject.fileName + '.js';

      await writeFile(javascriptFileName, formattedOutput, {flag: 'w'});
    }
  }
}

const processor = new StylesheetProcessor(configuration);
await processor.start();
