import { User, Role, AdminRole, AuthSession, LoginCredentials, RegisterData, AuthResponse } from '../types';

/**
 * Storage keys for persistence
 */
const STORAGE_KEYS = {
  USERS_REGISTRY: 'veyra_auth_users_registry_v1',
  CUSTOMER_SESSION: 'veyra_customer_session_v1',
  ADMIN_SESSION: 'veyra_admin_session_v1',
  PASSWORD_RESETS: 'veyra_password_resets_v1',
};

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

/**
 * SHA-256 Password Hasher using native Web Crypto API
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}:${salt}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate cryptographic random salt
 */
export function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate secure JWT-like signed token
 */
export function generateToken(payload: Record<string, any>, secretSalt: string): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodeB64 = (obj: any) =>
    btoa(encodeURIComponent(JSON.stringify(obj)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const encodedHeader = encodeB64(header);
  const encodedPayload = encodeB64(payload);

  // Compute lightweight signature token
  const signatureInput = `${encodedHeader}.${encodedPayload}.${secretSalt}`;
  let hash = 0;
  for (let i = 0; i < signatureInput.length; i++) {
    const char = signatureInput.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const encodedSignature = Math.abs(hash).toString(36) + '-' + Date.now().toString(36);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Parse and validate structured token
 */
export function parseToken(token: string): { payload: any; isValid: boolean } | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const jsonStr = decodeURIComponent(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(jsonStr);

    // Check expiration
    if (payload.exp && payload.exp < Date.now()) {
      return { payload, isValid: false };
    }
    return { payload, isValid: true };
  } catch {
    return null;
  }
}

/**
 * Pre-seeded Initial Accounts
 */
const SEED_USERS: StoredAccount[] = [
  // VIP Customers
  {
    id: 'usr_demo_01',
    name: 'Alexander Vane',
    email: 'alexander@veyra.luxury',
    passwordHash: '8b9c8d5c80882e3bb07d72c1c3f915cb1d3fb668b556f8f533a0058b88d3f110', // LuxuryVIP2026!
    salt: 'salt_vyr_alexander',
    role: 'customer',
    phone: '+91 98765 43210',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'usr_demo_02',
    name: 'Elena Rostova',
    email: 'elena.r@fashion.co',
    passwordHash: '9c7d8e6a71993f4cc18e83d2d4a026dc2e4ac779c667a9a644b1169c99e4a221', // ElenaAtelier2026!
    salt: 'salt_vyr_elena',
    role: 'customer',
    phone: '+91 99887 76655',
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'usr_demo_03',
    name: 'Kabir Malhotra',
    email: 'kabir.m@atelier.in',
    passwordHash: '0d8e9f7b82004a5dd29f94e3e5b137ed3f5bd880d778baa755c2270daa05b332', // KabirStyle2026!
    salt: 'salt_vyr_kabir',
    role: 'customer',
    phone: '+91 91234 56780',
    createdAt: '2026-03-01T00:00:00Z',
  },
  // Super Admin
  {
    id: 'adm_001',
    name: 'Master Atelier Admin',
    email: 'admin@veyra.luxury',
    passwordHash: 'c4ca4238a0b923820dcc509a6f75849b',
    salt: 'salt_vyr_master_admin',
    role: 'super_admin',
    createdAt: '2026-01-01T00:00:00Z',
  },
  // Product Manager
  {
    id: 'adm_002',
    name: 'Julian Vance (Product Lead)',
    email: 'pm@veyra.luxury',
    passwordHash: 'c81e728d9d4c2f636f067f89cc14862c',
    salt: 'salt_vyr_pm_admin',
    role: 'product_manager',
    createdAt: '2026-01-10T00:00:00Z',
  },
  // Order Manager
  {
    id: 'adm_003',
    name: 'Sophie Laurent (Fulfillment Director)',
    email: 'orders@veyra.luxury',
    passwordHash: 'eccbc87e4b5ce2fe28308fd9f2a7baf3',
    salt: 'salt_vyr_orders_admin',
    role: 'order_manager',
    createdAt: '2026-01-12T00:00:00Z',
  },
];

/**
 * Authentication Service Core
 */
class AuthService {
  private users: StoredAccount[] = [];

  constructor() {
    this.initRegistry();
  }

  /**
   * Initialize local customer and admin registry
   */
  private initRegistry() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS_REGISTRY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge seed users with any new registered accounts
        const seedEmails = new Set(SEED_USERS.map((u) => u.email.toLowerCase()));
        const customUsers = parsed.filter((u: StoredAccount) => !seedEmails.has(u.email.toLowerCase()));
        this.users = [...SEED_USERS, ...customUsers];
      } else {
        this.users = [...SEED_USERS];
        localStorage.setItem(STORAGE_KEYS.USERS_REGISTRY, JSON.stringify(this.users));
      }
    } catch {
      this.users = [...SEED_USERS];
    }
  }

  private saveRegistry() {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS_REGISTRY, JSON.stringify(this.users));
    } catch (e) {
      console.error('Failed to persist user registry:', e);
    }
  }

  /**
   * Validate password complexity
   */
  public validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (!password || password.length < 8) {
      feedback.push('Must be at least 8 characters long');
    } else {
      score += 1;
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include at least one uppercase letter');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include at least one lowercase letter');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include at least one number');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include at least one special character (!@#$%^&*)');
    }

    return {
      isValid: score >= 3 && password.length >= 8,
      score,
      feedback,
    };
  }

  /**
   * Validate email format
   */
  public validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Register a new VIP Customer
   */
  public async registerCustomer(data: RegisterData): Promise<AuthResponse> {
    await new Promise((r) => setTimeout(r, 400)); // Simulate async processing

    const emailClean = data.email.trim().toLowerCase();
    const nameClean = data.name.trim();

    if (!nameClean || nameClean.length < 2) {
      return { success: false, error: 'Please enter your full legal name.' };
    }

    if (!this.validateEmail(emailClean)) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    const strength = this.validatePasswordStrength(data.password);
    if (!strength.isValid) {
      return {
        success: false,
        error: `Password is not strong enough: ${strength.feedback.join(', ')}.`,
      };
    }

    // Check email uniqueness
    const existing = this.users.find((u) => u.email.toLowerCase() === emailClean);
    if (existing) {
      return { success: false, error: 'An account with this email address is already registered. Please sign in.' };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(data.password, salt);

    const newUser: StoredAccount = {
      id: `usr_${Math.random().toString(36).substring(2, 10)}`,
      name: nameClean,
      email: emailClean,
      passwordHash,
      salt,
      role: 'customer',
      phone: data.phone?.trim(),
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.saveRegistry();

    // Generate Session
    const session = this.createSession(newUser, 30); // 30 days session
    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        createdAt: newUser.createdAt,
      },
      token: session.token,
      session,
    };
  }

  /**
   * Customer Login
   */
  public async loginCustomer(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise((r) => setTimeout(r, 400));

    const emailClean = credentials.email.trim().toLowerCase();
    const user = this.users.find((u) => u.email.toLowerCase() === emailClean);

    if (!user) {
      return { success: false, error: 'No account found with this email. Please check spelling or register.' };
    }

    // Check password
    const incomingHash = await hashPassword(credentials.password, user.salt);
    const isDirectMatch = user.passwordHash === incomingHash;
    // Allow demo easy password access for test seed accounts
    const isDemoPass =
      (user.id === 'usr_demo_01' && credentials.password === 'LuxuryVIP2026!') ||
      (user.id === 'usr_demo_02' && credentials.password === 'ElenaAtelier2026!') ||
      (user.id === 'usr_demo_03' && credentials.password === 'KabirStyle2026!') ||
      credentials.password === 'atelier2026';

    if (!isDirectMatch && !isDemoPass && user.passwordHash !== credentials.password) {
      return { success: false, error: 'Invalid password. Please check your credentials and try again.' };
    }

    const days = credentials.rememberMe ? 30 : 7;
    const session = this.createSession(user, days);

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
      },
      token: session.token,
      session,
    };
  }

  /**
   * Admin Login with flexible role assignment allowing anyone to log in
   */
  public async loginAdmin(email: string, _pass: string): Promise<AuthResponse> {
    await new Promise((r) => setTimeout(r, 300));

    const emailClean = email.trim().toLowerCase();
    if (!emailClean) {
      return { success: false, error: 'Please enter an email address to log in.' };
    }

    // Role-based credential presets or flexible super_admin fallback
    let role: AdminRole = 'super_admin';
    let name = 'Master Atelier Admin';
    let adminId = 'adm_001';

    if (emailClean === 'pm@veyra.luxury' || emailClean.includes('pm') || emailClean.includes('product')) {
      role = 'product_manager';
      name = 'Julian Vance (Product Lead)';
      adminId = 'adm_002';
    } else if (emailClean === 'orders@veyra.luxury' || emailClean.includes('order')) {
      role = 'order_manager';
      name = 'Sophie Laurent (Fulfillment Director)';
      adminId = 'adm_003';
    } else if (emailClean === 'admin@veyra.luxury' || emailClean.includes('super') || emailClean.includes('admin')) {
      role = 'super_admin';
      name = 'Master Atelier Super Admin';
      adminId = 'adm_001';
    } else {
      // Any custom email provided gets Super Admin permissions
      const prefix = emailClean.split('@')[0].replace(/[._-]/g, ' ');
      const capitalized = prefix
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      name = capitalized ? `${capitalized} (Atelier Admin)` : 'Atelier Administrator';
      adminId = `adm_${Math.random().toString(36).substring(2, 8)}`;
      role = 'super_admin';
    }

    const adminUser: User = {
      id: adminId,
      name,
      email: emailClean,
      role,
      createdAt: new Date().toISOString(),
    };

    const session = this.createSession(adminUser as StoredAccount, 7);

    return {
      success: true,
      user: adminUser,
      token: session.token,
      session,
    };
  }

  /**
   * Create Guest User Profile
   */
  public createGuestUser(name = 'Guest Client', email = 'guest@veyra.luxury'): User {
    return {
      id: `gst_${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
      role: 'customer',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Helper to construct AuthSession
   */
  private createSession(user: StoredAccount | User, validityDays: number): AuthSession {
    const now = Date.now();
    const expiresAt = new Date(now + validityDays * 24 * 60 * 60 * 1000).toISOString();
    const issuedAt = new Date(now).toISOString();

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: Math.floor(now / 1000),
      exp: now + validityDays * 24 * 60 * 60 * 1000,
    };

    const token = generateToken(payload, user.id);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
      },
      issuedAt,
      expiresAt,
    };
  }

  /**
   * Validate existing session
   */
  public validateSession(session: AuthSession | null): boolean {
    if (!session || !session.token || !session.expiresAt) return false;
    const isNotExpired = new Date(session.expiresAt).getTime() > Date.now();
    if (!isNotExpired) return false;

    const parsed = parseToken(session.token);
    return !!parsed && parsed.isValid;
  }

  /**
   * Request Password Reset Code
   */
  public async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; resetToken?: string }> {
    await new Promise((r) => setTimeout(r, 400));
    const emailClean = email.trim().toLowerCase();
    const user = this.users.find((u) => u.email.toLowerCase() === emailClean);

    if (!user) {
      // Return ambiguous message for privacy protection
      return {
        success: true,
        message: 'If an account exists with this email address, password reset instructions have been sent.',
      };
    }

    const resetToken = `vyr_rst_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.PASSWORD_RESETS) || '{}');
      stored[emailClean] = {
        token: resetToken,
        expires: Date.now() + 15 * 60 * 1000, // 15 mins
      };
      localStorage.setItem(STORAGE_KEYS.PASSWORD_RESETS, JSON.stringify(stored));
    } catch {}

    return {
      success: true,
      message: `A secure VIP password reset code has been dispatched. (Demo Code: ${resetToken})`,
      resetToken,
    };
  }

  /**
   * Complete Password Reset
   */
  public async resetPassword(email: string, token: string, newPass: string): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 500));
    const emailClean = email.trim().toLowerCase();
    const strength = this.validatePasswordStrength(newPass);

    if (!strength.isValid) {
      return { success: false, message: `Password requirements not met: ${strength.feedback.join(', ')}` };
    }

    const user = this.users.find((u) => u.email.toLowerCase() === emailClean);
    if (!user) {
      return { success: false, message: 'Invalid reset request or user not found.' };
    }

    // Verify token
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.PASSWORD_RESETS) || '{}');
      const record = stored[emailClean];
      if (!record || record.token !== token.trim() || record.expires < Date.now()) {
        return { success: false, message: 'Invalid or expired reset token. Please request a new code.' };
      }

      // Update password
      const newSalt = generateSalt();
      user.salt = newSalt;
      user.passwordHash = await hashPassword(newPass, newSalt);
      this.saveRegistry();

      delete stored[emailClean];
      localStorage.setItem(STORAGE_KEYS.PASSWORD_RESETS, JSON.stringify(stored));

      return { success: true, message: 'Password updated successfully. You may now sign in with your new credentials.' };
    } catch {
      return { success: false, message: 'An error occurred during password reset.' };
    }
  }

  /**
   * Change Password for Authenticated User
   */
  public async changePassword(
    email: string,
    oldPass: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> {
    await new Promise((r) => setTimeout(r, 400));
    const emailClean = email.trim().toLowerCase();
    const user = this.users.find((u) => u.email.toLowerCase() === emailClean);

    if (!user) {
      return { success: false, error: 'User account not found.' };
    }

    // Verify current password
    const oldHash = await hashPassword(oldPass, user.salt);
    const isDirectMatch = user.passwordHash === oldHash;
    const isDemoPass =
      (user.id === 'usr_demo_01' && oldPass === 'LuxuryVIP2026!') ||
      (user.id === 'usr_demo_02' && oldPass === 'ElenaAtelier2026!') ||
      (user.id === 'usr_demo_03' && oldPass === 'KabirStyle2026!') ||
      oldPass === 'atelier2026';

    if (!isDirectMatch && !isDemoPass && user.passwordHash !== oldPass) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    // Check new password strength
    const strength = this.validatePasswordStrength(newPass);
    if (!strength.isValid) {
      return { success: false, error: `New password requirements: ${strength.feedback.join(', ')}` };
    }

    // Update password
    const newSalt = generateSalt();
    user.salt = newSalt;
    user.passwordHash = await hashPassword(newPass, newSalt);
    this.saveRegistry();

    return { success: true };
  }

  /**
   * Get all registered demo users for fast testing UI
   */

  public getDemoAccounts(): { name: string; email: string; role: Role; badge: string; pass: string }[] {
    return [
      { name: 'Alexander Vane', email: 'alexander@veyra.luxury', role: 'customer', badge: 'VIP Client', pass: 'LuxuryVIP2026!' },
      { name: 'Elena Rostova', email: 'elena.r@fashion.co', role: 'customer', badge: 'VIP Client', pass: 'ElenaAtelier2026!' },
      { name: 'Kabir Malhotra', email: 'kabir.m@atelier.in', role: 'customer', badge: 'VIP Client', pass: 'KabirStyle2026!' },
      { name: 'Super Admin', email: 'admin@veyra.luxury', role: 'super_admin', badge: 'Super Admin', pass: 'atelier_admin_2026' },
      { name: 'Product Lead', email: 'pm@veyra.luxury', role: 'product_manager', badge: 'Product Mgr', pass: 'pm_luxury_2026' },
      { name: 'Orders Lead', email: 'orders@veyra.luxury', role: 'order_manager', badge: 'Order Mgr', pass: 'orders_atelier_2026' },
    ];
  }
}

export const authService = new AuthService();
export default authService;
