# 🏃 RUNVEX — SDK 54 (Expo Go compatible)

## ✅ Versiones verificadas
- expo: 54.0.21
- expo-router: 6.0.14
- react-native: 0.81.5
- react: 19.1.0

---

## Pasos para ejecutar

### 1. Extrae el ZIP → abre una terminal dentro de la carpeta `runvex`

### 2. Instalar dependencias
```
npm install
```

### 3. Arrancar
```
npx expo start --clear
```

### 4. Escanear el QR con Expo Go

---

## Si npm install falla
```
npm install --legacy-peer-deps
```

## Si hay error de caché Metro
```
npx expo start --clear --reset-cache
```

## Si aparece warning de versiones
Es solo un aviso, no un error. La app funciona igual.

---

## Base de datos SQLite
Se crea automáticamente: `runvex.db`
- Tabla `usuarios` — registro y login
- Tabla `carreras` — historial de carreras
- Tabla `rutas_guardadas` — rutas creadas
- Tabla `sesion` — sesión persistente
