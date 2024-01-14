import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {styles} from './styles/styles.css.js';

@customElement('simple-greeting')
export class SimpleGreeting extends LitElement {
  static override styles = styles;

  @property()
  name = 'Somebody';

  override render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'simple-greeting': SimpleGreeting;
  }
}
