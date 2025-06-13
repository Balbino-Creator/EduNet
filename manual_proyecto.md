# EduNet

**EduNet** es una plataforma educativa colaborativa que permite la gestión de proyectos, aulas, usuarios y recursos en tiempo real, con chat, live code y explorador de archivos.  
Desarrollada con **React + Vite** en el frontend y **Node.js + Express + TypeScript** en el backend.

---

## Índice

1. [Características](#-características)
2. [Tecnologías utilizadas](#-tecnologías-utilizadas)
3. [Estructura principal del proyecto](#-estructura-principal-del-proyecto)
4. [Despliegue rápido en producción](#-despliegue-rápido-en-producción)
    1. [Clona el repositorio en tu servidor](#1-clona-el-repositorio-en-tu-servidor)
    2. [Configura variables de entorno](#2-configura-variables-de-entorno)
    3. [Instala dependencias](#3-instala-dependencias)
    4. [Arranca el backend](#4-arranca-el-backend)
    5. [Arranca el frontend](#5-arranca-el-frontend)
    6. [Configura Nginx como proxy inverso](#6-configura-nginx-como-proxy-inverso)
5. [Comandos útiles](#-comandos-útiles)
6. [Notas importantes](#-notas-importantes)
7. [Documentación de la API](#-documentación-de-la-api)
8. [Autor](#-autor)

## ✨ Características

- **Gestión de usuarios** (profesores y estudiantes) con autenticación segura.
- **Gestión de proyectos y aulas**: crea, edita y elimina proyectos y clases.
- **Chat en tiempo real** y **Live Code** colaborativo.
- **Explorador de archivos** y compartición de directorios del servidor.
- **Internacionalización** (Español/Inglés).
- **Integración con LDAP**.
- **API documentada con Swagger**.

---

## 🥗 Tecnologías utilizadas

- **Frontend:** React, Vite, TypeScript, TailwindCSS
- **Backend:** Node.js, Express, TypeScript, Sequelize, Socket.io
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT, integración opcional con LDAP
- **Documentación API:** Swagger
- **Servidor web:** Nginx
- **Gestión de procesos:** PM2

---

## 🗂️ Estructura principal del proyecto

```
EduNet/
├── client/           # Frontend (React + Vite)
│   ├── public/       # Recursos estáticos
│   ├── src/          # Código fuente (layouts, components, views, contexts)
│   ├── .env.production
│   └── vite.config.ts
├── services/         # Backend (Node.js + Express + TypeScript)
│   ├── src/          # Código fuente (handlers, models, config)
│   ├── migrations/   # Migraciones de base de datos
│   ├── .env
│   └── config/       # Configuración de base de datos
```

---

## 🚀 Despliegue rápido en producción

### 1. **Clona el repositorio en tu servidor**

```sh
git clone https://github.com/Balbino-Creator/EduNet.git
cd EduNet
```

### 2. **Configura variables de entorno**

- **Frontend:**  
  Crea `client/.env.production` con:

    ```
    VITE_API_URL=https://www.edunet.org.es/api
    VITE_SOCKET_URL=https://www.edunet.org.es
    ```

- **Backend:**  
  Crea `services/.env` con tus variables (puerto, LDAP, DB, JWT, etc):

    ```
    DATABASE_URL=postgresql://balbino:12345678@edunet.ct6bz2c2lxwi.us-east-1.rds.amazonaws.com:5432/edunet

    BACKEND_URL=http://www.edunet.org.es/api/
    
    JWT_SECRET=your_secret_key_here
    
    EMAIL_USER=1f87cc6283b660
    EMAIL_PASS=5ad605bef32019
    SMTP_HOST=sandbox.smtp.mailtrap.io
    SMTP_PORT=587
    
    LDAP_URL=ldap://34.200.166.109:389
    LDAP_BASE_DN=ou=users,dc=edunet,dc=ldap,dc=com
    LDAP_BIND_DN=cn=admin,dc=edunet,dc=ldap,dc=com
    LDAP_BIND_PASSWORD=12345678
    ```

### 3. **Instala dependencias**

```sh
cd client
npm install
cd ../services
npm install
```

### 4. **Arranca el backend**

```sh
cd ../services
pm2 start npm --name services -- run dev
```

### 5. **Arranca el frontend**

```sh
cd ../client
pm2 start npm --name client -- run dev -- --host 0.0.0.0
```

### 6. **Configura Nginx como proxy inverso**

Ejemplo de bloque para `/etc/nginx/sites-available/edunet.conf`:

```nginx
server {
    listen 443 ssl;
    server_name edunet.org.es www.edunet.org.es;

    ssl_certificate /etc/ssl/edunet/edunet.org.es_ssl_certificate.cer;
    ssl_certificate_key /etc/ssl/edunet/_.edunet.org.es_private_key.key;

    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /socket.io/ {
        proxy_pass http://localhost:4000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🛠️ Comandos útiles

- **Frontend desarrollo:**  
  ```sh
  cd client
  npm run dev -- --host 0.0.0.0
  ```
- **Backend desarrollo:**  
  ```sh
  cd services
  npm run dev
  ```
- **Arranque automático con PM2:**  
  ```sh
  pm2 start npm --name services -- run dev --cwd ./services
  pm2 start npm --name client -- run dev -- --host 0.0.0.0 --cwd ./client
  pm2 save
  pm2 startup
  ```

---

## 📝 Notas importantes

- **No uses rutas de Windows** para compartir directorios en el explorador de archivos; usa rutas absolutas de Linux.
- **Aumenta el límite de watchers** en la EC2 si usas nodemon/vite:
  ```sh
  echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
  sudo sysctl -p
  ```

---

## 📚 Documentación de la API

Accede a la documentación Swagger en:  
`https://www.edunet.org.es/api/docs`

---

## 👨‍💻 Autor

- Balbino Montiano Garay

---
