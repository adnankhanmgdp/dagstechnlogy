exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  // const R = 6371;
  // const dLat = toRadians(lat2 - lat1);
  // const dLon = toRadians(lon2 - lon1);
  // const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //           Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
  //           Math.sin(dLon / 2) * Math.sin(dLon / 2);
  // const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // const distance = R * c;


  let radius = 6571;
  let startingLat = toRadians(lat1);
  let startingLong = toRadians(lon1);
  let destinationLat = toRadians(lat2);
  let destinationLong = toRadians(lon2);
  let distance = Math.acos(Math.sin(startingLat) * Math.sin(destinationLat) + Math.cos(startingLat) * Math.cos(destinationLat) * Math.cos(startingLong - destinationLong)) * radius;
  console.log("----> Distance: "+distance+"km")
  return distance;
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}