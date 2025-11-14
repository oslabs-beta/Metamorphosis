export default function unixTimeStamptoTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString();
}

