// Read-only verification: never follows redirects or stores authentication data.
const targets = [
  'https://86936f9a.the-chef-private-preview.pages.dev/',
  'https://86936f9a.the-chef-private-preview.pages.dev/version.json',
  'https://86936f9a.the-chef-private-preview.pages.dev/assets/index-BVikxSOz.js',
  'https://reconcile-baseline-2026-09-2.the-chef-private-preview.pages.dev/'
];
let failed = false;
for (const url of targets) {
  try {
    const response = await fetch(url, { redirect: 'manual' });
    const destination = new URL(response.headers.get('location') || '/', url);
    const pass = response.status === 302 &&
      destination.hostname === 'the-chef-private-preview-pages.cloudflareaccess.com' &&
      destination.pathname.startsWith('/cdn-cgi/access/login/');
    failed ||= !pass;
    console.log(JSON.stringify({ url, status: response.status, pass,
      redirect: destination.origin + destination.pathname }));
  } catch (error) {
    failed = true;
    console.error(JSON.stringify({ url, pass: false, error: String(error) }));
  }
}
process.exitCode = failed ? 1 : 0;
