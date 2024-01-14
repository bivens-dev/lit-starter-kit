import {render, html} from '@lit-labs/ssr';
import {collectResult} from '@lit-labs/ssr/lib/render-result.js';
import '../components/simple-greeting/simple-greeting.js';

export const pageInfo = {
  title: 'About Page',
  path: 'about.html',
};

const ssrResult = render(html`
  <!doctype html>
  <html>
    <head>
      <title>MyApp ${pageInfo.title}</title>
      <link rel="stylesheet" href="./styles/global.css" />
    </head>
    <body>
      <main>${pageInfo.title}</main>
      <simple-greeting name="Old Mate"></simple-greeting>
      <!-- Pass data to client. -->
      <script type="text/json" id="page-info">
        ${JSON.stringify(pageInfo)}
      </script>

      <script type="module">
        // Hydrate template-shadowroots eagerly after rendering (for browsers without
        // native declarative shadow roots)
        import {
          hasNativeDeclarativeShadowRoots,
          hydrateShadowRoots,
        } from '@webcomponents/template-shadowroot/template-shadowroot.js';
        if (!hasNativeDeclarativeShadowRoots()) {
          hydrateShadowRoots(document.body);
        }

        // Hydrate content template. This <script type=module> will run after
        // the page has loaded, so we can count on page-id being present.
        const pageInfo = JSON.parse(
          document.getElementById('page-info').textContent
        );

        import './src/components/simple-greeting/simple-greeting.js';
        // #content element can now be efficiently updated
      </script>
    </body>
  </html>
`);

export const pageHTML = await collectResult(ssrResult);
