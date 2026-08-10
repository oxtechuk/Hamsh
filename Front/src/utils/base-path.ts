export function getDynamicBasePath(): string {
  const isLocalhostSubdir = window.location.pathname.startsWith('/nawaderv2/public');
  return isLocalhostSubdir ? '/nawaderv2/public/' : '/';
}
