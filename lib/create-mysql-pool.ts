import mysql from "mysql2/promise";

/** Host-ovi u oblaku koji zahtijevaju TLS (TiDB Serverless, Aiven, PlanetScale…). */
function hostRequiresTls(host: string): boolean {
  const h = host.toLowerCase();
  return (
    h.endsWith("tidbcloud.com") ||
    h.endsWith("aivencloud.com") ||
    h.endsWith("psdb.cloud") ||
    h.includes("planetscale")
  );
}

/** Lokalni host — nikad ne forsiraj SSL (XAMPP/lokalni MySQL nema TLS). */
function isLocalHost(host: string): boolean {
  const h = host.toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

/**
 * Odlučuje treba li TLS na osnovu URI-ja i env-a:
 * - `DB_SSL=1` (ili `0`) eksplicitno uključuje/isključuje,
 * - inače: cloud hostovi (TiDB/Aiven/…) automatski TLS, lokalni bez.
 */
function shouldUseTls(connectionUri: string): boolean {
  const flag = process.env.DB_SSL?.trim();
  if (flag === "1" || flag?.toLowerCase() === "true") return true;
  if (flag === "0" || flag?.toLowerCase() === "false") return false;

  try {
    const u = new URL(connectionUri.replace(/^mysql2?:/i, "http:"));
    if (isLocalHost(u.hostname)) return false;
    return hostRequiresTls(u.hostname);
  } catch {
    return false;
  }
}

/**
 * Pool sa eksplicitnim `utf8mb4` (emoji, ć, š, ž, …) — izbjegava mojibake pri upisu/čitanju.
 * Koristi `uri` + `charset` kako mysql2 spaja URL i opcije (vidi ConnectionConfig).
 * TLS se automatski uključuje za cloud baze (TiDB/Aiven…), lokalni MySQL ostaje bez SSL.
 */
export function createMysqlPoolUtf8mb4(connectionUri: string): mysql.Pool {
  const useTls = shouldUseTls(connectionUri);

  return mysql.createPool({
    uri: connectionUri,
    charset: "utf8mb4",
    ...(useTls
      ? { ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true } }
      : {}),
  });
}
