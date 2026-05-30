const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getNearbyDrivers(lat, lng, riderUserId) {
  const onlineDrivers = await prisma.driverLocation.findMany({
    where: {
      isOnline: true,
      NOT: {
        userId: riderUserId || undefined,
      }
    },
    include: {
      user: true,
    },
  });

  const R = 6371; // Radius of the earth in km
  
  const driversWithDistance = onlineDrivers.map(driver => {
    const dLat = (driver.latitude - lat) * (Math.PI / 180);
    const dLon = (driver.longitude - lng) * (Math.PI / 180);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat * (Math.PI / 180)) * Math.cos(driver.latitude * (Math.PI / 180)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distanceKm = R * c;
    
    return {
      ...driver,
      distanceKm,
    };
  });

  return driversWithDistance.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 5);
}

async function main() {
  // Test with coordinates close to Hisar (29.244, 75.846)
  const nearby = await getNearbyDrivers(29.2, 75.8, 'some_other_rider_id');
  console.log("Nearby Drivers:", nearby);
  
  // Test with same ID
  const nearbySame = await getNearbyDrivers(29.2, 75.8, 'user_3EL3uAKkqvXw8eZwz3QqBNoOISy');
  console.log("Nearby Drivers (Same ID):", nearbySame);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
