export function getCookie(cookieKey) {
  const cookie = document.cookie.split(cookieKey);
  if (cookie.length < 2) {
    return null;
  }
  const version = cookie[1].split('=')[1].split(';')[0] || null;
  return version;
}

