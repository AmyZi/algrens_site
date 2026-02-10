export const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost/web/wp-json/wp/v2';

export const WP_BASE_URL = WP_API_URL.replace('/wp-json/wp/v2', '');