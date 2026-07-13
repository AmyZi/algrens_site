const WP_API = process.env.NEXT_PUBLIC_WP_API_URL || 'https://ahlgrens.eu/wp-json/wp/v2';

export async function getPsaAnnouncements() {
  try {
    const res = await fetch(
      `${WP_API}/psa?per_page=20&_fields=id,title,meta._psa_active,meta._psa_link_url,meta._psa_link_label`,
      { cache: 'force-cache' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data
      .filter(p => p.meta?._psa_active === 'yes')
      .map(p => ({
        id: p.id,
        message: p.title?.rendered || '',
        linkUrl: p.meta?._psa_link_url || null,
        linkLabel: p.meta?._psa_link_label || null,
      }));
  } catch (err) {
    console.error('getPsaAnnouncements:', err);
    return [];
  }
}