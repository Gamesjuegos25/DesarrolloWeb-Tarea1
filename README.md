# Mini RRHH — Desarrollo Web

**Sitio desplegado:** https://desarrolloweb-tarea1.onrender.com

Aplicacion de gestion de empleados con React + TypeScript + Vite. Incluye autenticacion (JWT, refresh y roles), CRUD de empleados con TanStack Query, formularios con React Hook Form + Zod, manejo centralizado de errores y pagina 404.

**Usuarios de prueba** (contrasena `Demo1234`): `admin@empresa.com` (ADMIN), `rrhh@empresa.com` (HR_MANAGER), `empleado@empresa.com` (EMPLOYEE).

## Desarrollo local

Instala las dependencias y levanta la aplicacion y la API mock en terminales separadas:

```bash
npm install
npm run mock-api   # server.js: empleados + /api/v1/auth
npm run dev
```

La API queda disponible en `http://localhost:3001`. Puedes cambiarla con `VITE_API_URL` usando `.env.local`.

## Despliegue en Render

Para un Static Site usa `npm run build` como build command y `dist` como publish directory. Define `VITE_API_URL` con la URL publica de tu API y **no definas** `VITE_AUTH_API_URL`: el login lo atiende el mismo servidor (`server.js`, comando `npm run mock-api`), asi no hay CORS entre servicios.

No uses `http://localhost:3001` en Render; `VITE_API_URL` debe apuntar a la API publica.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
