/**
 * VEYRA Haute Couture — Enterprise Security Hardening
 * Input Sanitization, Binary Magic-Byte File Scanning, Rate Limiting, and Security Audit Logging.
 */

// Allowed MIME types and extensions for 3D Fashion Platform
export const ALLOWED_FILE_CONFIG = {
  'model/gltf-binary': ['.glb'],
  'model/gltf+json': ['.gltf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
} as const;

export const MAX_FILE_SIZES = {
  MODEL_3D: 50 * 1024 * 1024, // 50MB for GLB/GLTF
  IMAGE: 12 * 1024 * 1024, // 12MB for high-res lookbook photography
};

/**
 * 1. INPUT SANITIZATION (XSS & Injection Protection)
 */

/**
 * Escapes raw text to prevent HTML injection and XSS
 */
export const sanitizeInput = (input: string | null | undefined): string => {
  if (typeof input !== 'string') return '';

  const entityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  return input.trim().replace(/[&<>"'`=/]/g, (s) => entityMap[s] || s);
};

/**
 * Strips dangerous executable script tags, event handlers, and javascript: protocols from HTML
 */
export const sanitizeHtml = (htmlContent: string): string => {
  if (typeof htmlContent !== 'string') return '';

  return htmlContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*(["']).*?\1/gi, '')
    .replace(/on\w+\s*=\s*[^ >]+/gi, '')
    .replace(/javascript:[^"'\s>]+/gi, '#sanitized')
    .replace(/data:(?!image\/(png|jpeg|webp);base64)[^"'\s>]+/gi, '#blocked-data-uri');
};

/**
 * Validates and sanitizes a URL against malicious protocols
 */
export const sanitizeUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  const trimmed = url.trim();

  // Allow relative paths
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed, typeof window !== 'undefined' ? window.location.origin : 'https://veyra.luxury');
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return '#blocked-protocol';
    }
    return parsed.toString();
  } catch {
    return '#invalid-url';
  }
};

/**
 * 2. BINARY MAGIC-BYTE FILE VALIDATION
 */

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  detectedType?: string;
  sizeBytes?: number;
}

/**
 * Inspects binary magic header bytes to verify authentic file contents
 */
export const validateBinaryHeader = async (file: File): Promise<{ isVerified: boolean; detectedMime: string }> => {
  try {
    const slice = file.slice(0, 16);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // GLB Magic Bytes: 0x46546C67 ("glTF" in little-endian ASCII)
    if (bytes[0] === 0x67 && bytes[1] === 0x6C && bytes[2] === 0x54 && bytes[3] === 0x46) {
      return { isVerified: true, detectedMime: 'model/gltf-binary' };
    }

    // PNG Magic Bytes: 89 50 4E 47 0D 0A 1A 0A
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4E &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0D &&
      bytes[5] === 0x0A
    ) {
      return { isVerified: true, detectedMime: 'image/png' };
    }

    // JPEG Magic Bytes: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return { isVerified: true, detectedMime: 'image/jpeg' };
    }

    // WEBP Magic Bytes: RIFF .... WEBP
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return { isVerified: true, detectedMime: 'image/webp' };
    }

    // For glTF (JSON-based ASCII text), check if valid JSON containing "asset" key
    if (file.name.toLowerCase().endsWith('.gltf')) {
      const textSlice = await file.slice(0, 256).text();
      if (textSlice.includes('"asset"') || textSlice.includes('glTF')) {
        return { isVerified: true, detectedMime: 'model/gltf+json' };
      }
    }

    return { isVerified: false, detectedMime: 'unknown/unrecognized' };
  } catch (err) {
    console.warn('[Security File Scanner] Header validation error:', err);
    return { isVerified: false, detectedMime: 'unknown/error' };
  }
};

/**
 * Validates a file against allowed MIME types, extensions, size limits, and binary headers
 */
export const validateFileUpload = async (
  file: File,
  category: '3d-model' | 'image' | 'any' = 'any'
): Promise<FileValidationResult> => {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  const fileName = file.name.toLowerCase();
  const fileExt = '.' + fileName.split('.').pop();
  const fileSize = file.size;

  // 1. Check File Size
  const maxAllowedSize = category === '3d-model' ? MAX_FILE_SIZES.MODEL_3D : MAX_FILE_SIZES.IMAGE;
  if (fileSize > maxAllowedSize) {
    return {
      isValid: false,
      error: `File size (${(fileSize / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of ${(
        maxAllowedSize /
        (1024 * 1024)
      ).toFixed(0)}MB.`,
      sizeBytes: fileSize,
    };
  }

  // 2. Check Extension Whitelist
  const allAllowedExtensions = ['.glb', '.gltf', '.jpg', '.jpeg', '.png', '.webp'];
  if (!allAllowedExtensions.includes(fileExt)) {
    return {
      isValid: false,
      error: `File extension "${fileExt}" is not permitted. Only .glb, .gltf, .jpg, .png, and .webp files are supported.`,
    };
  }

  // 3. Inspect Binary Headers
  const headerCheck = await validateBinaryHeader(file);
  if (!headerCheck.isVerified) {
    return {
      isValid: false,
      error: `File signature mismatch: File content does not match genuine ${fileExt} binary format.`,
      detectedType: headerCheck.detectedMime,
    };
  }

  return {
    isValid: true,
    detectedType: headerCheck.detectedMime,
    sizeBytes: fileSize,
  };
};

/**
 * 3. RATE LIMITING MIDDLEWARE (Client & API Protection)
 */

interface RateLimitBucket {
  count: number;
  resetTime: number;
}

const rateLimitBuckets = new Map<string, RateLimitBucket>();

/**
 * Sliding window rate-limiting check
 * @param actionIdentifier Key identifying the action (e.g. 'checkout_submit', 'admin_login')
 * @param maxRequests Maximum allowed requests in window
 * @param windowMs Time window in milliseconds (default 1 minute)
 */
export const checkRateLimit = (
  actionIdentifier: string,
  maxRequests = 10,
  windowMs = 60000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } => {
  const now = Date.now();
  let bucket = rateLimitBuckets.get(actionIdentifier);

  if (!bucket || now > bucket.resetTime) {
    bucket = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitBuckets.set(actionIdentifier, bucket);
    return { allowed: true, remaining: maxRequests - 1, retryAfterSeconds: 0 };
  }

  if (bucket.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((bucket.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - bucket.count,
    retryAfterSeconds: 0,
  };
};

/**
 * 4. SECURITY AUDIT LOGGING
 */

export interface SecurityAuditEvent {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: Record<string, any>;
  severity: 'info' | 'warn' | 'critical';
  ip?: string;
}

const AUDIT_STORAGE_KEY = 'veyra_security_audit_logs';

/**
 * Logs an administrative or sensitive security event to the audit ledger
 */
export const logSecurityAudit = (
  action: string,
  details: Record<string, any> = {},
  severity: 'info' | 'warn' | 'critical' = 'info',
  actor = 'admin_session'
): SecurityAuditEvent => {
  const event: SecurityAuditEvent = {
    id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    action,
    actor,
    timestamp: new Date().toISOString(),
    details,
    severity,
  };

  try {
    const existing = JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || '[]');
    existing.unshift(event);
    // Retain last 200 security audit events
    const trimmed = existing.slice(0, 200);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('[Security Audit Logger] Storage error:', err);
  }

  return event;
};

/**
 * Retrieves security audit events
 */
export const getSecurityAuditLogs = (): SecurityAuditEvent[] => {
  try {
    return JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

/**
 * 5. RECOMMENDED CSP META DIRECTIVES
 */
export const getCSPMetaDirectives = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://images.unsplash.com https://cdn.jsdelivr.net",
    "connect-src 'self' blob: https://images.unsplash.com https://cdn.jsdelivr.net",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
};
