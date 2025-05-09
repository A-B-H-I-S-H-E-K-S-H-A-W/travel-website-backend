export function duration(departureTime, arrivalTime) {
  const diffMs = new Date(arrivalTime) - new Date(departureTime);
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}
