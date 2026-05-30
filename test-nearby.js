const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getNearbyDrivers(lat, lng, riderId) {
  const onlineDrivers = await prisma.driverLocation.findMany({
    where: {
      isOnline: true,
      NOT: {
        userId: riderId || undefined,
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

async function test() {
  await prisma.user.upsert({
    where: { id: "fake_driver_id" },
    update: { role: "driver" },
    create: { id: "fake_driver_id", name: "Test Driver", email: "driver@test.com", role: "driver" }
  });

  await prisma.driverLocation.upsert({
    where: { userId: "fake_driver_id" },
    update: { latitude: 28.6304, longitude: 77.2177, isOnline: true },
    create: { userId: "fake_driver_id", latitude: 28.6304, longitude: 77.2177, isOnline: true }
  });

  const drivers = await getNearbyDrivers(37.7915, -122.4007, "some_rider_id");
  console.log("Found drivers:", drivers.length);
  if (drivers.length > 0) {
      console.log("Closest driver distance:", drivers[0].distanceKm);
  }
}

test().then(() => prisma.$disconnect());
