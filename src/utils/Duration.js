export function duration(departureTime, arrivalTime) {
  const diffMs = new Date(end) - new Date(start);
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}
