function formatMinutesToFriendlyString(minutes: number): string {
  if (minutes === 0) return "0 分钟";

  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = Math.floor(minutes % 60);

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}天`);
  }

  if (hours > 0) {
    parts.push(`${hours}小时`);
  }

  if (mins > 0) {
    parts.push(`${mins}分钟`);
  }

  return parts.join("");
}

function formatTimestampToDateTime(timestamp: number, timezone: string = "Asia/Shanghai"): string {
  if (timestamp === 0) return "未知时间";

  const date = new Date(timestamp * 1000);
  
  const formatter = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone
  });
  
  return formatter.format(date);
}

export { formatMinutesToFriendlyString, formatTimestampToDateTime };
