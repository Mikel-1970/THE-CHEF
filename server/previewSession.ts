import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';

export type PreviewEnv = {
  CHEF_ACCESS_ISSUER?: string;
  CHEF_ACCESS_AUD?: string;
  CHEF_ADMIN_EMAIL?: string;
  CHEF_ADMIN_NAME?: string;
  CHEF_PREVIEW_URL?: string;
};
const resolvers = new Map<string, JWTVerifyGetKey>();
const json = (body: unknown, status = 200) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie, Cf-Access-Jwt-Assertion', 'X-Content-Type-Options': 'nosniff' }
});

// The optional key resolver is used by signature tests; production always uses Access JWKS.
export async function previewSession(request: Request, env: PreviewEnv, testKeys?: JWTVerifyGetKey): Promise<Response> {
  const issuer = env.CHEF_ACCESS_ISSUER?.replace(/\/$/, '');
  const audience = env.CHEF_ACCESS_AUD;
  const adminEmail = env.CHEF_ADMIN_EMAIL?.trim().toLowerCase();
  if (!issuer || !/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(issuer) || !audience || !adminEmail) {
    return json({ error: 'Acceso privado pendiente de configuración.' }, 503);
  }
  const assertion = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!assertion) return json({ error: 'Verifica tu acceso para continuar.' }, 401);
  try {
    let keys = testKeys ?? resolvers.get(issuer);
    if (!keys) {
      keys = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
      resolvers.set(issuer, keys);
    }
    const { payload } = await jwtVerify(assertion, keys, {
      issuer, audience, algorithms: ['RS256'], requiredClaims: ['exp', 'sub', 'email'], clockTolerance: 5
    });
    if (typeof payload.email !== 'string' || payload.email.trim().toLowerCase() !== adminEmail) {
      return json({ error: 'Esta cuenta no tiene acceso a la administración de pruebas.' }, 403);
    }
    return json({
      user: { id: `access:${payload.sub}`, email: adminEmail, name: env.CHEF_ADMIN_NAME || 'Administrador', role: 'admin' },
      expiresAt: payload.exp! * 1000,
      stableUrl: env.CHEF_PREVIEW_URL || null
    });
  } catch {
    return json({ error: 'La sesión ha caducado o no es válida. Vuelve a verificar tu acceso.' }, 401);
  }
}
