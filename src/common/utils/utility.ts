export const extractIPv4 = (ipAddress: string): string => {
  const ipv4MappedPrefix = '::ffff:';
  // 만약 IP주소가 ::ffff:로 시작하면, 접두사 제거한 값을 반환
  if (ipAddress.startsWith(ipv4MappedPrefix)) {
    return ipAddress.substring(ipv4MappedPrefix.length);
  }
  // 만약 ::ffff:로 시작하지 않으면 그대로 반환
  return ipAddress;
};
