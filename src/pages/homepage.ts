import {render, html} from '@lit-labs/ssr';
import {collectResult} from '@lit-labs/ssr/lib/render-result.js';
import '../components/simple-greeting/simple-greeting.js';

export const pageInfo = {
  title: 'Homepage',
  path: 'index.html',
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
      <simple-greeting></simple-greeting>
      <!-- Pass data to client. -->
      <script type="text/json" id="page-info">
        ${JSON.stringify(pageInfo)}
      </script>
    </body>
  </html>
`);

export const pageHTML = await collectResult(ssrResult);
