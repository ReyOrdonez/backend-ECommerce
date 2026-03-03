# E-Commerce Backend API (User & Authentication Module)

Backend API desarrollada con arquitectura en capas, enfocada en separación de responsabilidades, testabilidad.

Implementa un módulo completo de gestión de usuarios y autenticación basada en verificación segura de credenciales, utilizando TypeScript y Prisma ORM sobre PostgreSQL.

---

## Arquitectura

La aplicación sigue un enfoque modular basado en MVC + capa de servicios:

server/
app/
routes/
controllers/
services/
middlewares/

### Principios

- Controllers (manejo exclusivo de request/response)
- Lógica de negocio en services
- Inyección manual de dependencias (Prisma y bcrypt)
- Manejo centralizado de errores mediante middleware global
- Clases de error personalizadas extendiendo `Error`

---

## Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (validación de datos)
- Bcrypt (hashing de contraseñas)
- Vitest (testing)

Infraestructura:

- Deploy en Railway
- Base de datos en Neon

---

## Seguridad y Autenticación

- Hashing seguro de contraseñas con bcrypt
- Verificación segura con `compare()`
- Validación estructurada con Zod
- Restricción de email único
- Exclusión del campo `password` en todas las respuestas (uso de `select` en Prisma)

El login valida credenciales correctamente y está preparado para evolucionar hacia autenticación basada en JWT.

---

## Funcionalidades Implementadas

### Users CRUD

- Crear usuario
- Obtener todos los usuarios
- Obtener usuario por ID
- Actualizar usuario
- Eliminar usuario

### Login

- Validación de credenciales
- Respuesta sin exposición de datos sensibles

---

## Testing

Testing enfocado en la capa de servicios usando Vitest.

Se incluyen:

- Casos positivos
- Casos negativos
- Verificación de lanzamiento de errores personalizados

La lógica de negocio está completamente testeada de forma aislada gracias al desacoplamiento de dependencias.

---

## Deploy

El proyecto está desplegado y listo para producción:

- Backend en Railway
- Base de datos PostgreSQL en Neon
- Variables de entorno configurables
- Seed ejecutable mediante Prisma para inicializar usuario administrador

---

## Instalación y Uso

### Clonar repositorio

```bash
git clone https://github.com/ReyOrdonez/backend-ECommerce.git

```
