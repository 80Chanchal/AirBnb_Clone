const image = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`

const makeListing = (id, title, city, pricePerNight, averageRating, imageId, propertyType) => ({
  id, title, city, country: 'India', pricePerNight, averageRating, reviewCount: Math.floor(18 + averageRating * 10),
  bedrooms: propertyType === 'SERVICE' ? 1 : 2, bathrooms: 2, maxGuests: propertyType === 'SERVICE' ? 6 : 4,
  propertyType, primaryImageUrl: image(imageId),
})

export const demoListings = {
  HOUSE: [
    makeListing(-801, 'Garden home in Lonavala', 'Lonavala', 12999, 4.94, 'photo-1600585154526-990dced4db0d', 'HOUSE'),
    makeListing(-802, 'Heritage home near the beach', 'North Goa', 10499, 4.88, 'photo-1600607687920-4e2a09cf159d', 'HOUSE'),
    makeListing(-803, 'Sunny home with a private pool', 'Alibag', 14800, 4.97, 'photo-1499793983690-e29da59ef1c2', 'HOUSE'),
    makeListing(-804, 'Quiet home in the hills', 'Karjat', 9699, 4.91, 'photo-1494526585095-c41746248156', 'HOUSE'),
    makeListing(-805, 'Contemporary family home', 'Pune', 8200, 4.86, 'photo-1600210492486-724fe5c67fb0', 'HOUSE'),
    makeListing(-806, 'Sea-view home in Mumbai', 'Mumbai', 11400, 4.96, 'photo-1600585152915-d208bec867a1', 'HOUSE'),
  ],
  VILLA: [
    makeListing(-811, 'Sunset villa with infinity pool', 'North Goa', 16999, 4.98, 'photo-1613490493576-7fde63acd811', 'VILLA'),
    makeListing(-812, 'Hillside villa experience', 'Lonavala', 15499, 4.95, 'photo-1600585154340-be6161a56a0c', 'VILLA'),
    makeListing(-813, 'Beachside villa escape', 'Alibag', 17200, 4.97, 'photo-1505693416388-ac5ce068fe85', 'VILLA'),
    makeListing(-814, 'Modern pool villa', 'Pune', 13400, 4.90, 'photo-1600566753190-17f0baa2a6c3', 'VILLA'),
    makeListing(-815, 'Palm grove villa', 'South Goa', 14750, 4.93, 'photo-1600607688960-e095ff83135c', 'VILLA'),
    makeListing(-816, 'Private lake villa', 'Karjat', 15900, 4.96, 'photo-1601918774946-25832a4be0d6', 'VILLA'),
  ],
  APARTMENT: [
    makeListing(-821, 'Design-led city apartment', 'Mumbai', 7200, 4.91, 'photo-1522708323590-d24dbb6b0267', 'APARTMENT'),
    makeListing(-822, 'Cozy apartment with workspace', 'Pune', 5100, 4.87, 'photo-1600607687939-ce8a6c25118c', 'APARTMENT'),
    makeListing(-823, 'Bright serviced apartment', 'Bengaluru', 5800, 4.89, 'photo-1600566753086-00f18fb6b3ea', 'APARTMENT'),
    makeListing(-824, 'Quiet apartment near the beach', 'North Goa', 6400, 4.92, 'photo-1600607688969-a5bfcd646154', 'APARTMENT'),
    makeListing(-825, 'Modern apartment in Bandra', 'Mumbai', 8500, 4.94, 'photo-1600047509807-ba8f99d2cdde', 'APARTMENT'),
    makeListing(-826, 'Comfortable serviced stay', 'Delhi', 6200, 4.85, 'photo-1542718610-a1d656d1884c', 'APARTMENT'),
  ],
}

export const getDemoListings = type => demoListings[type] || [...demoListings.HOUSE, ...demoListings.VILLA, ...demoListings.APARTMENT]
