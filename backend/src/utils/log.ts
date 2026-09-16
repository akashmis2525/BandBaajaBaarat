const SECRET_PATTERN =
  /(mongodb(\+srv)?:\/\/[^\s]+)|(Bearer\s+[A-Za-z0-9\-._~+/]+=*)|(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)/gi;

export function sanitizeLogMessage(value: unknown): string {
  const raw = value instanceof Error ? `${value.name}: ${value.message}` : String(value);
  return raw.replace(SECRET_PATTERN, '[redacted]');
}
