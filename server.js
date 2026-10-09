// server.js — backend propio: auth (mismo contrato que API-RH) + CRUD de empleados (json-server)
//
// Un solo servicio sirve las dos cosas, así el frontend no depende de una API
// ajena ni de su CORS. Rutas de auth: /api/v1/auth/{login,refresh,logout,me}.
// Los errores usan el envelope de API-RH: { success:false, error:{ code, message, details } }.
import crypto from 'node:crypto';
import jsonServer from 'json-server';

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-cambiar-en-render';
const ACCESS_TTL = 15 * 60; // segundos
const REFRESH_TTL = 7 * 24 * 60 * 60;

// Usuarios de prueba. La contraseña cumple la regla de mínimo 8 caracteres de API-RH.
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'Demo1234';
const USERS = [
  { id: '1', email: 'admin@empresa.com', firstName: 'Roberto', lastName: 'Silva', isActive: true, role: { code: 'ADMIN', name: 'Administrador' } },
  { id: '2', email: 'rrhh@empresa.com', firstName: 'Carlos', lastName: 'Martínez', isActive: true, role: { code: 'HR_MANAGER', name: 'Gerente de RRHH' } },
  { id: '3', email: 'empleado@empresa.com', firstName: 'Ana', lastName: 'García', isActive: true, role: { code: 'EMPLOYEE', name: 'Empleado' } },
];

// ---------- JWT (HS256) sin dependencias extra ----------
const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const sign = (data) => crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');

function createToken(payload, ttl) {
  const now = Math.floor(Date.now() / 1000);
  const body = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ ...payload, iat: now, exp: now + ttl, jti: crypto.randomUUID() })}`;
  return `${body}.${sign(body)}`;
}

function verifyToken(token) {
  const [h, p, s] = String(token).split('.');
  if (!h || !p || !s || sign(`${h}.${p}`) !== s) return null;
  const payload = JSON.parse(Buffer.from(p, 'base64url').toString());
  return payload.exp > Date.now() / 1000 ? payload : null;
}

// Refresh tokens vigentes: al renovar, el usado se invalida (rotación)
const validRefreshTokens = new Map(); // token -> userId

function issueTokens(user) {
  const accessToken = createToken({ sub: user.id, role: user.role.code, type: 'access' }, ACCESS_TTL);
  const refreshToken = createToken({ sub: user.id, type: 'refresh' }, REFRESH_TTL);
  validRefreshTokens.set(refreshToken, user.id);
  return { accessToken, refreshToken, tokenType: 'Bearer', expiresIn: ACCESS_TTL, refreshExpiresIn: REFRESH_TTL };
}

// ---------- Respuestas con el formato de API-RH ----------
const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });

const fail = (req, res, status, code, message, details) =>
  res.status(status).json({
    success: false,
    error: { code, message, ...(details && { details }) },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });

const publicUser = (user) => ({ ...user });

function requireAuth(roles) {
  return (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/^Bearer /, '');
    const payload = token && verifyToken(token);
    if (!payload || payload.type !== 'access') {
      return fail(req, res, 401, 'UNAUTHORIZED', 'Invalid or expired access token.');
    }
    const user = USERS.find((u) => u.id === payload.sub);
    if (!user) return fail(req, res, 401, 'UNAUTHORIZED', 'Invalid or expired access token.');
    if (roles && !roles.includes(user.role.code)) {
      return fail(req, res, 403, 'INSUFFICIENT_ROLE', 'User does not have permission to access this resource.');
    }
    req.user = user;
    next();
  };
}

// ---------- App ----------
const server = jsonServer.create();
server.use(jsonServer.defaults({ logger: true })); // incluye CORS
server.use(jsonServer.bodyParser);

const auth = jsonServer.create();

auth.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const details = [];
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    details.push({ field: 'email', messages: ['email must be an email'] });
  }
  if (typeof password !== 'string' || password.length < 8) {
    details.push({ field: 'password', messages: ['password must be longer than or equal to 8 characters'] });
  }
  if (details.length) return fail(req, res, 400, 'BAD_REQUEST', details[0].messages[0], details);

  const user = USERS.find((u) => u.email === email.toLowerCase());
  if (!user || !user.isActive || password !== DEMO_PASSWORD) {
    return fail(req, res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }
  ok(res, { user: publicUser(user), tokens: issueTokens(user) });
});

auth.post('/refresh', (req, res) => {
  const { refreshToken } = req.body || {};
  const payload = typeof refreshToken === 'string' && verifyToken(refreshToken);
  const userId = payload && payload.type === 'refresh' && validRefreshTokens.get(refreshToken);
  const user = userId && USERS.find((u) => u.id === userId);
  if (!user) return fail(req, res, 401, 'UNAUTHORIZED', 'Invalid or expired refresh token.');
  validRefreshTokens.delete(refreshToken); // rotación: el token usado deja de servir
  ok(res, { user: publicUser(user), tokens: issueTokens(user) });
});

auth.post('/logout', (req, res) => {
  validRefreshTokens.delete((req.body || {}).refreshToken);
  ok(res, { loggedOut: true });
});

auth.get('/me', requireAuth(), (req, res) => ok(res, publicUser(req.user)));

server.use('/api/v1/auth', auth);

// Endpoint solo para ADMIN: sirve para provocar un 403 real (Laboratorio 10, Paso 8)
server.get('/api/v1/users', requireAuth(['ADMIN']), (req, res) => ok(res, USERS.map(publicUser)));

// Cualquier otra ruta /api/v1/* → 404 con envelope
server.use('/api/v1', (req, res) => fail(req, res, 404, 'NOT_FOUND', `Cannot ${req.method} ${req.originalUrl}`));

// CRUD de empleados (json-server) — sin autenticación, como el mock de las clases
server.use(jsonServer.router('db.json'));

server.listen(PORT, '0.0.0.0', () => {
  console.log(`API lista en http://localhost:${PORT}  (empleados + /api/v1/auth)`);
});
