import * as SQLite from 'expo-sqlite';

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync('runvex.db');
    await setup(_db);
  }
  return _db;
}

async function setup(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS usuarios (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre      TEXT NOT NULL,
      apellidos   TEXT NOT NULL,
      correo      TEXT UNIQUE NOT NULL,
      usuario     TEXT UNIQUE NOT NULL,
      contrasena  TEXT NOT NULL,
      racha       INTEGER DEFAULT 0,
      foto_perfil TEXT,
      creado_en   TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS carreras (
      id                 INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id         INTEGER NOT NULL,
      fecha              TEXT DEFAULT (datetime('now')),
      distancia_km       REAL DEFAULT 0,
      tiempo_segundos    INTEGER DEFAULT 0,
      velocidad_promedio REAL DEFAULT 0,
      calorias           INTEGER DEFAULT 0,
      pasos              INTEGER DEFAULT 0,
      bpm_promedio       INTEGER DEFAULT 0,
      bpm_maximo         INTEGER DEFAULT 0,
      elevacion_m        REAL DEFAULT 0,
      ruta_json          TEXT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS rutas_guardadas (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id          INTEGER NOT NULL,
      nombre              TEXT NOT NULL,
      distancia_km        REAL NOT NULL,
      tiempo_estimado_min INTEGER NOT NULL,
      coordenadas_json    TEXT NOT NULL,
      creado_en           TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sesion (
      id         INTEGER PRIMARY KEY CHECK (id = 1),
      usuario_id INTEGER,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
  `);
}

// ─── USUARIOS ──────────────────────────────────────────────
export async function crearUsuario(
  nombre: string, apellidos: string,
  correo: string, usuario: string, contrasena: string
): Promise<number> {
  const db = await getDB();
  const r = await db.runAsync(
    `INSERT INTO usuarios (nombre,apellidos,correo,usuario,contrasena) VALUES (?,?,?,?,?)`,
    [nombre, apellidos, correo, usuario, contrasena]
  );
  return r.lastInsertRowId;
}

export async function loginUsuario(usuario: string, contrasena: string): Promise<any | null> {
  const db = await getDB();
  const row = await db.getFirstAsync<any>(
    `SELECT * FROM usuarios WHERE (usuario=? OR correo=?) AND contrasena=?`,
    [usuario, usuario, contrasena]
  );
  if (row) {
    await db.runAsync(
      `INSERT OR REPLACE INTO sesion (id, usuario_id) VALUES (1, ?)`, [row.id]
    );
  }
  return row;
}

export async function obtenerSesionActiva(): Promise<any | null> {
  const db = await getDB();
  return db.getFirstAsync<any>(
    `SELECT u.* FROM sesion s JOIN usuarios u ON s.usuario_id = u.id WHERE s.id = 1`
  );
}

export async function cerrarSesion(): Promise<void> {
  const db = await getDB();
  await db.runAsync(`DELETE FROM sesion WHERE id = 1`);
}

export async function actualizarUsuario(
  id: number,
  datos: Partial<{ nombre:string; apellidos:string; correo:string; foto_perfil:string }>
): Promise<void> {
  const db = await getDB();
  const sets = Object.keys(datos).map(k => `${k}=?`).join(',');
  await db.runAsync(`UPDATE usuarios SET ${sets} WHERE id=?`, [...Object.values(datos), id]);
}

export async function actualizarRacha(id: number, racha: number): Promise<void> {
  const db = await getDB();
  await db.runAsync(`UPDATE usuarios SET racha=? WHERE id=?`, [racha, id]);
}

// ─── CARRERAS ──────────────────────────────────────────────
export interface DatosCarrera {
  usuario_id: number; distancia_km: number; tiempo_segundos: number;
  velocidad_promedio: number; calorias: number; pasos: number;
  bpm_promedio: number; bpm_maximo: number; elevacion_m: number; ruta_json: string;
}

export async function guardarCarrera(c: DatosCarrera): Promise<number> {
  const db = await getDB();
  const r = await db.runAsync(
    `INSERT INTO carreras
     (usuario_id,distancia_km,tiempo_segundos,velocidad_promedio,
      calorias,pasos,bpm_promedio,bpm_maximo,elevacion_m,ruta_json)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [c.usuario_id, c.distancia_km, c.tiempo_segundos, c.velocidad_promedio,
     c.calorias, c.pasos, c.bpm_promedio, c.bpm_maximo, c.elevacion_m, c.ruta_json]
  );
  return r.lastInsertRowId;
}

export async function obtenerCarreras(uid: number): Promise<any[]> {
  const db = await getDB();
  return db.getAllAsync<any>(
    `SELECT * FROM carreras WHERE usuario_id=? ORDER BY fecha DESC`, [uid]
  );
}

export async function obtenerUltimaCarrera(uid: number): Promise<any | null> {
  const db = await getDB();
  return db.getFirstAsync<any>(
    `SELECT * FROM carreras WHERE usuario_id=? ORDER BY fecha DESC LIMIT 1`, [uid]
  );
}

// ─── RUTAS ─────────────────────────────────────────────────
export async function guardarRuta(
  uid: number, nombre: string, distKm: number,
  minEst: number, coords: any[]
): Promise<number> {
  const db = await getDB();
  const r = await db.runAsync(
    `INSERT INTO rutas_guardadas (usuario_id,nombre,distancia_km,tiempo_estimado_min,coordenadas_json)
     VALUES (?,?,?,?,?)`,
    [uid, nombre, distKm, minEst, JSON.stringify(coords)]
  );
  return r.lastInsertRowId;
}

export async function obtenerRutas(uid: number): Promise<any[]> {
  const db = await getDB();
  return db.getAllAsync<any>(
    `SELECT * FROM rutas_guardadas WHERE usuario_id=? ORDER BY creado_en DESC`, [uid]
  );
}
