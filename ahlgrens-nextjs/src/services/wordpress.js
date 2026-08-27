/**
 * WordPress Service for Next.js
 * Handles all WordPress API calls
 */

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost/web/wp-json/wp/v2';

class WordPressService {
  /**
   * Fetch vehicles from WordPress
   */
  async getVehicles(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        per_page: params.per_page || 10,
        page: params.page || 1,
        _embed: true,
        ...params,
      });

      // FIXED: Added proper parentheses
      const res = await fetch(`${WP_API_URL}/vehicles?${queryParams}`, {
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const posts = await res.json();
      const total = res.headers.get('X-WP-Total') || res.headers.get('x-wp-total') || '0';
      const totalPages = res.headers.get('X-WP-TotalPages') || res.headers.get('x-wp-totalpages') || '1';

      return {
        vehicles: posts.map(post => this.transformVehicle(post)),
        total: parseInt(total, 10) || 0,
        totalPages: parseInt(totalPages, 10) || 1,
      };
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return { vehicles: [], total: 0, totalPages: 1 };
    }
  }

  /**
   * Fetch single vehicle by slug
   */
  async getVehicleBySlug(slug) {
    try {
      const res = await fetch(`${WP_API_URL}/vehicles?slug=${slug}&_embed=true`, {
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const posts = await res.json();
      
      if (posts.length === 0) {
        return null;
      }

      return this.transformVehicle(posts[0]);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      return null;
    }
  }

  /**
   * Transform WordPress post to vehicle object
   */
  transformVehicle(post) {
    return {
      id: post.id,
      slug: post.slug,
      title: post.title.rendered,
      content: post.content.rendered,
      make: post.acf?.make || '',
      model: post.acf?.model || '',
      year: post.acf?.year || '',
      price: post.acf?.price || 0,
      mileage: post.acf?.mileage || 0,
      fuel_type: post.acf?.fuel_type || '',
      transmission: post.acf?.transmission || '',
      body_type: post.acf?.body_type || '',
      color: post.acf?.color || '',
      features: post.acf?.features || [],
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      gallery: post.acf?.gallery || [],
      featured: post.acf?.featured || false,
    };
  }

  /**
   * Generate static paths for all vehicles
   */
  async getAllVehicleSlugs() {
    try {
      const res = await fetch(`${WP_API_URL}/vehicles?per_page=100&_fields=slug`);
      
      if (!res.ok) {
        return [];
      }

      const posts = await res.json();
      return posts.map(post => post.slug);
    } catch (error) {
      console.error('Error fetching vehicle slugs:', error);
      return [];
    }
  }
}

export default new WordPressService();