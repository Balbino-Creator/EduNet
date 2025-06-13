# EduNet

EduNet es una plataforma educativa colaborativa para la gestión de usuarios, aulas y proyectos, con chat en tiempo real, live code y explorador de archivos.

## Tecnologías principales

- **Frontend:** React, Vite, TypeScript
- **Backend:** Node.js, Express, TypeScript, Sequelize
- **Base de datos:** PostgreSQL

## Instalación rápida

1. **Clona el repositorio:**
   ```sh
   git clone https://github.com/Balbino-Creator/EduNet.git
   cd EduNet
   ```

2. **Instala dependencias:**
   ```sh
   cd client
   npm install
   cd ../services
   npm install
   ```

3. **Configura las variables de entorno** en `client/.env.production` y `services/.env`.

4. **Arranca el frontend y el backend:**
   ```sh
   cd client
   npm run dev -- --host 0.0.0.0
   # En otra terminal:
   cd ../services
   npm run dev
   ```

## Estructura básica

```
EduNet/
├── client/      # Frontend
└── services/    # Backend
```

## Autor

Balbino Montiano Garay
