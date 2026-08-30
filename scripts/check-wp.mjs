const WP_API = process.env.NEXT_PUBLIC_WP_API_URL;

console.log('--- WP connectivity check ---');
console.log('NEXT_PUBLIC_WP_API_URL =', WP_API || '(EMPTY / UNDEFINED)');

if (!WP_API) {
  console.error('\n❌ NEXT_PUBLIC_WP_API_URL is not set in this shell/process.');
  console.error('This is almost certainly why the build fails — fix the env');
  console.error('file or CI workflow mapping before looking at anything else.');
  process.exit(1);
}

try {
  const url = `${WP_API}/posts?per_page=100&_embed`;
  console.log('\nFetching:', url);

  const res = await fetch(url);
  console.log('Status:', res.status, res.statusText);

  const text = await res.text();

  if (!res.ok) {
    console.error('\n❌ Request failed. Response body (first 500 chars):');
    console.error(text.slice(0, 500));
    process.exit(1);
  }

  const posts = JSON.parse(text);
  console.log('\n✅ Success. Post count:', Array.isArray(posts) ? posts.length : 'NOT AN ARRAY');

  if (Array.isArray(posts) && posts.length === 0) {
    console.warn('\n⚠️  Zero posts returned. If WordPress actually has published');
    console.warn('posts, check: is this endpoint hitting the right site/env,');
    console.warn('and are the posts actually published (not draft)?');
  }
} catch (err) {
  console.error('\n❌ fetch threw an exception:');
  console.error(err);
  process.exit(1);
}
