const { SignJWT, jwtVerify } = require('jose');
const { cookies } = require('next/headers');

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'vidyarise-academy-secret-key-2024-production'
);

async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

async function requireAuth(requiredRole) {
  const user = await getUser();
  if (!user) return { error: 'Unauthorized', status: 401 };
  if (requiredRole) {
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(user.role)) return { error: 'Forbidden', status: 403 };
    } else {
      if (user.role !== requiredRole) return { error: 'Forbidden', status: 403 };
    }
  }
  return { user };
}

module.exports = { signToken, verifyToken, getUser, requireAuth, JWT_SECRET };
