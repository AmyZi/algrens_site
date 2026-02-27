export async function getAllCars() {
  try {
    // Note the _embed parameter - essential for getting images/meta
    const res = await fetch('https://www.ahlgrens.eu/wp-json/wp/v2/car_listing?per_page=100&_embed', {
      next: { revalidate: 60 } 
    });
    
    if (!res.ok) throw new Error('Failed to fetch');
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}