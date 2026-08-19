# todo-api-cicd

API REST simple (Express) para gestión de tareas, con pipeline de CI/CD usando GitHub Actions.
Trabajo Extraclase — CI/CD con GitHub Actions — Programación IV.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | /health | Healthcheck |
| GET | /tasks | Lista todas las tareas |
| GET | /tasks/:id | Obtiene una tarea por ID |
| POST | /tasks | Crea una tarea (`name`, `priority`) |
| PATCH | /tasks/:id/complete | Marca una tarea como completada |
| DELETE | /tasks/:id | Elimina una tarea |

## Desarrollo local

```bash
npm install
npm run lint      # ESLint
npm test          # Jest + cobertura
npm start         # Servidor en http://localhost:3000
```

## Ejercicio 1 — Pipeline de CI (`.github/workflows/ci.yml`)

Se dispara en `push` a `main`/`develop` y en `pull_request` hacia `main`. Corre:
1. Checkout del código
2. Setup de Node.js 20 con cache de npm
3. `npm ci` (instalación limpia)
4. `npm run lint` (ESLint)
5. `npm test` (Jest, 7 pruebas unitarias + reporte de cobertura)
6. Sube el reporte de cobertura como artifact (`coverage-report`)
7. Notifica éxito/fallo (además de los status checks nativos de GitHub)

## Ejercicio 2 — Pipeline de CD (`.github/workflows/cd.yml`)

Se dispara automáticamente cuando el workflow de CI **termina exitosamente en `main`** (`workflow_run`).

**Job 1 — `build-and-push`:**
- Construye la imagen Docker de la app (`Dockerfile`)
- La sube a GitHub Container Registry (`ghcr.io`) con dos tags: el SHA del commit y `latest`
- Usa `secrets.GITHUB_TOKEN` (automático, no requiere configuración) para autenticarse

**Job 2 — `deploy`:**
- Depende del job anterior (`needs: build-and-push`)
- Usa un **environment** llamado `production` (ver configuración abajo)
- Dispara el despliegue llamando a un webhook guardado en el secret `DEPLOY_HOOK_URL`

### Configuración pendiente en GitHub (una sola vez)

1. **Crear el repositorio** en GitHub y hacer push de este proyecto.
2. **Proteger el environment de producción:**
   Settings → Environments → New environment → nombrarlo `production` →
   activar "Required reviewers" y agregarte a vos misma como aprobadora
   (esto satisface el requisito de "al menos una regla de protección").
3. **Configurar el despliegue real** (elegí un servicio gratuito, por ejemplo Render):
   - Creá un Web Service en Render apuntando a este repo (o a la imagen de ghcr.io)
   - Copiá el "Deploy Hook URL" que te da Render
   - En GitHub: Settings → Secrets and variables → Actions → New repository secret
     → nombre `DEPLOY_HOOK_URL`, valor: la URL que copiaste
4. Si no configurás el secret todavía, el job de deploy no falla: lo detecta y lo indica
   en los logs, para que puedas probar el resto del pipeline sin bloquearte.

### Ver las imágenes publicadas

Una vez que el CD corra con éxito, las imágenes quedan visibles en:
`https://github.com/<tu-usuario>/<tu-repo>/pkgs/container/<tu-repo>`

## Autor

Camila — Universidad Nacional de Costa Rica, Programación IV.
