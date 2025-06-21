# RedSalud Healthcare Management System

Sistema integral para la gestión de centros de salud, que permite administrar salas médicas (boxes), especialistas, reservas de pacientes y mantenciones en múltiples pisos del establecimiento.

---

## 🧩 Descripción General

Este sistema está compuesto por dos módulos principales:

- **Backend:** Servidor API en Node.js/Express con base de datos MongoDB.
- **Frontend:** Aplicación web desarrollada con Angular v19.2.12.

---

## ⚙️ Requisitos Previos

- Node.js ≥ 18
- MongoDB (última versión)
- Angular CLI 19.2.12
- npm (última versión)

---

## 🚀 Instrucciones de Inicio Rápido

### 🖥️ Backend

1. Navega al directorio del backend e instala dependencias:
   ```bash
   cd Backend
   npm install
   ```

2. Asegúrate de que MongoDB esté corriendo en `localhost:27017`.

3. Crea los usuarios administradores iniciales:
   ```bash
   node CreateUsers.js
   ```

4. Inicia el servidor backend:
   ```bash
   node index.js
   ```
   El servidor correrá en el puerto **3000** y se conectará a la base de datos `miapp`.

---

### 🌐 Frontend

1. Navega al directorio del frontend:
   ```bash
   cd frontend
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   ng serve --proxy-config proxy.conf.json
   ```

4. Accede a la aplicación en:
   ```
   http://localhost:4200/
   ```

---

## 🧠 Funcionalidades Clave

- **Gestión de Usuarios:** Autenticación con control de acceso basado en roles (administradores y especialistas).
- **Administración de Boxes:** Control y visualización de salas médicas distribuidas por piso.
- **Gestión de Especialistas:** Asignación y programación de turnos para profesionales de salud.
- **Sistema de Reservas:** Agendamiento de citas para pacientes.
- **Seguimiento de Mantenciones:** Programación y monitoreo de mantenciones de boxes.

---

## 👥 Provisión de Usuarios

El sistema incluye un script (`CreateUsers.js`) que:

- Crea usuarios administradores con contraseña por defecto `"admin"`.
- Evita duplicados verificando usuarios existentes.
- Utiliza **bcrypt** para el hash de contraseñas.

---

## 👨‍💻 Desarrollo

### Frontend

- Generar componentes:  
  ```bash
  ng generate component nombre-componente
  ```

- Ejecutar pruebas unitarias:  
  ```bash
  ng test
  ```

- Compilar para producción:  
  ```bash
  ng build
  ```

### Backend

- API construida con **Express.js** y **Mongoose**.
- Autenticación segura con **bcrypt**.
- Conexión establecida a:  
  ```
  mongodb://localhost:27017/miapp
  ```

---

## 📝 Notas

Este sistema está diseñado principalmente para centros de salud en **Chile**, con:

- Interfaz en idioma español.
- Soporte para RUT (Rol Único Tributario) en la identificación de usuarios.
- Panel de control adaptable según el tipo de usuario (admin o especialista).
