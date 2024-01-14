import {SimpleGreeting} from './index.js';

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('my-element', () => {
  test('is defined', () => {
    const el = document.createElement('simple-greeting');
    assert.instanceOf(el, SimpleGreeting);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<simple-greeting></simple-greeting>`);
    assert.shadowDom.equal(
      el,
      `
      <p>Hello, Somebody!</p>
    `
    );
  });

  test('renders with a set name', async () => {
    const el = await fixture(
      html`<simple-greeting name="Test"></simple-greeting>`
    );
    assert.shadowDom.equal(
      el,
      `
      <p>Hello, Test!</p>
    `
    );
  });

  // test('handles a click', async () => {
  //   const el = (await fixture(
  //     html`<my-element></my-element>`
  //   )) as SimpleGreeting;
  //   const button = el.shadowRoot!.querySelector('button')!;
  //   button.click();
  //   await el.updateComplete;
  //   assert.shadowDom.equal(
  //     el,
  //     `
  //     <h1>Hello, World!</h1>
  //     <button part="button">Click Count: 1</button>
  //     <slot></slot>
  //   `
  //   );
  // });

  // test('styling applied', async () => {
  //   const el = (await fixture(
  //     html`<my-element></my-element>`
  //   )) as SimpleGreeting;
  //   await el.updateComplete;
  //   assert.equal(
  //     getComputedStyle(el.shadowRoot!.querySelector('p')!).color,
  //     'green'
  //   );
  // });
});
