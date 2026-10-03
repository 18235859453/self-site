const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const origin = 'https://shiming-private-blog.2535599412.workers.dev';

for (const entry of ['index.html', '404.html']) {
  const html = readFileSync(join(__dirname, '..', 'migration', entry), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/);

  test(`${entry}: redirects before rendering a migration notice`, () => {
    assert.ok(script);
    assert.ok(html.indexOf(script[0]) < html.indexOf('</head>'));
    assert.doesNotMatch(html, /博客已迁移/);
  });

  test(`${entry}: redirects immediately when JavaScript is disabled`, () => {
    assert.match(html, /<noscript>\s*<meta http-equiv="refresh" content="0;url=https:\/\/shiming-private-blog\.2535599412\.workers\.dev\/self-site\/">\s*<\/noscript>/);
  });

  for (const [path, expectedPath] of [
    ['/self-site/', '/self-site/'],
    ['/self-site/p/start-right-now/', '/self-site/p/start-right-now/'],
    ['/self-site/%E6%90%9C%E7%B4%A2/', '/self-site/%E6%90%9C%E7%B4%A2/'],
    ['/other/', '/self-site/'],
  ]) {
    test(`${entry}: preserves the destination for ${path} without needing the body`, () => {
      let destination;
      runInNewContext(script[1], {
        location: {
          pathname: path,
          search: '?keyword=%E5%AD%A6%E4%B9%A0',
          hash: '#section-2',
          replace(value) { destination = value; },
        },
      });
      assert.equal(destination, `${origin}${expectedPath}?keyword=%E5%AD%A6%E4%B9%A0#section-2`);
    });
  }
}
