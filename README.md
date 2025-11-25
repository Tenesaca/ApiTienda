# Gestión de Productos

## Descripción
Este proyecto es un sistema web para la gestión de productos, permitiendo crear, visualizar, actualizar y eliminar productos desde un frontend interactivo. La aplicación utiliza Node.js/Express en el backend y MongoDB como base de datos, y el frontend está desarrollado en HTML, CSS y JavaScript puro.

---

## Instalación y ejecución del backend

1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_REPOSITORIO>

2. Instalar dependencias
npm install

3. Configurar la base de datos
Crear un cluster en MongoDB Atlas o usar una instancia local.
Configurar la URL de conexión en un archivo .env:

MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/<nombreDB>?retryWrites=true&w=majority
PORT=3000

4. Ejecutar el servidor
npm start o nodemon
El backend quedará corriendo en http://localhost:3000 (o el puerto definido en .env).

5. Rutas de la API
Método	Ruta	Descripción
GET	/api/producto		Obtener todos los productos
GET	/api/producto/:id	Obtener un producto por ID
POST	/api/producto		Crear un nuevo producto
PUT	/api/producto/:id	Actualizar un producto existente
DELETE	/api/producto/:id	Eliminar un producto por ID
