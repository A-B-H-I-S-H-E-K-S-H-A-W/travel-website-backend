export function duration(departureTime, arrivalTime) {
  const deptTime = new Date(departureTime);
  const arrTime = new Date(arrivalTime);
  const busDuration = arrTime - deptTime;

  const sec = Math.floor(busDuration / 1000);
  const min = Math.floor(sec / 60);
  const hours = Math.floor(min / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMins = min % 60;
  const remainingSec = sec % 60;

  const result = `${days} days, ${remainingHours} hours, ${remainingMins} minutes, ${remainingSec} seconds`;

  return result;
}
