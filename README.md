# Gestor de Imágenes en la Nube
Este proyecto es una aplicación web para subir, listar y eliminar imágenes en la nube, diseñada con un enfoque simple y funcional para usuarios finales. Utiliza tecnologías modernas como HTML5, Bootstrap 5, SweetAlert2 y JavaScript para ofrecer una experiencia de usuario fluida y amigable.

Railway se encarga de alojar y ejecutar el backend, facilitando una API accesible públicamente para gestionar las imágenes.
Cloudinary actúa como servicio de almacenamiento y optimización de las imágenes en la nube, manejando el hosting y entrega de los archivos multimedia.

Características principales
Subida de imágenes: Permite seleccionar y subir archivos desde el navegador.

Listado de imágenes: Muestra una tabla con las imágenes subidas, sus URLs, IDs públicos y fecha de subida.

Eliminación de imágenes: Permite eliminar imágenes específicas del almacenamiento en la nube.

Indicador de carga (spinner): Muestra un spinner durante las operaciones de subida para mejorar la experiencia de usuario.

Alertas interactivas: Utiliza SweetAlert2 para mensajes claros de éxito, advertencia y error.

Tecnologías usadas
Frontend: HTML5, CSS3, Bootstrap 5, JavaScript (Vanilla)

Backend: Node.js con Express (API para gestión de archivos)

Servicios externos: Cloudinary (almacenamiento y entrega de imágenes), Railway (hosting del backend)

Alertas: SweetAlert2

Cómo funciona
El usuario selecciona una imagen desde el input de tipo archivo.

Al hacer clic en "Subir Imagen", se muestra un spinner de carga mientras la imagen se está subiendo.

Si la subida es exitosa, se muestra un mensaje de éxito y se redirige a una página de confirmación.

El usuario puede listar todas las imágenes almacenadas con sus detalles.

Se puede eliminar una imagen desde la tabla con confirmación previa.

Backend (API)
El backend está desarrollado en Node.js usando Express para crear endpoints REST.

Expone rutas para subir imágenes (POST /upload), listar todas las imágenes (GET /archivos) y eliminar imágenes específicas (DELETE /delete/:publicId).

Utiliza el SDK de Cloudinary para gestionar el almacenamiento, subida, listado y eliminación de archivos en la nube.

Está desplegado en Railway, lo que permite un acceso remoto y confiable al servicio API.

Para mejorar la experiencia de usuario, se agregó un spinner que aparece cuando se realiza la subida del archivo, indicando que el proceso está en curso.

El spinner está oculto inicialmente.

Se muestra justo antes de enviar la petición al backend.

Se oculta automáticamente cuando termina la operación, ya sea exitosa o fallida.

Esto evita que el usuario se confunda o piense que la aplicación está congelada.

Autor
Kevin Medina — Estudiante de Ingeniería de Sistemas