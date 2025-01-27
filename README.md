falta agregarle el filtro de vistas por usuario, ahorita cualquier usuario puede ver el /home de todos
# Proyecto Nuxt 3: Sistema de Autenticación con Firebase

## **Descripción del Proyecto**
Este proyecto implementa un sistema de autenticación utilizando Nuxt 3, Firebase y Tailwind CSS. Incluye funcionalidad de login, logout y protección de rutas mediante middleware. Está diseñado para ser modular y fácilmente escalable.

---

## **Tecnologías Utilizadas**

- **Nuxt 3**: Framework para aplicaciones web modernas con soporte SSR.
- **Firebase**: Para la autenticación del usuario.
- **Tailwind CSS**: Framework de utilidades CSS para diseño rápido y eficiente.
- **Pinia (Opcional)**: Manejo del estado global (si es necesario en el futuro).

---

## **Estructura del Proyecto**

nuxt-auth-module/
├── app.vue                    # Punto de entrada principal
├── assets/
│   └── css/
│       └── main.css          # Estilos globales
├── components/
│   ├── auth/
│   │   └── LoginForm.vue     # Formulario de login
│   └── Navbar.vue            # Barra de navegación
├── composables/
│   └── useAuth.js            # Lógica de autenticación
├── layouts/
│   └── default.vue           # Layout principal
├── middleware/
│   └── auth.js               # Middleware de protección de rutas
├── nuxt.config.ts            # Configuración global de Nuxt
├── pages/
│   ├── home.vue              # Página protegida (post-login)
│   ├── index.vue             # Página de inicio
│   ├── login.vue             # Página de login
│   └── register.vue          # Página de registro (opcional)
├── plugins/
│   └── firebase.client.js    # Inicialización de Firebase
├── public/
│   ├── favicon.ico           # Ícono de la aplicación
│   └── robots.txt            # Configuración de robots
├── tailwind.config.js        # Configuración de Tailwind CSS
├── tsconfig.json             # Configuración de TypeScript
└── README.md                 # Documentación del proyecto

---

## **Instalación y Ejecución**

### **Requisitos Previos**
- Node.js v16 o superior
- Yarn v1.22 o superior

### **Pasos de Instalación**
1. Clonar el repositorio:
   git clone <URL_DEL_REPOSITORIO>
   cd nuxt-auth-module

2. Instalar dependencias:
   yarn install

3. Configurar Firebase:
   - Crear un archivo .env en la raíz del proyecto con las siguientes variables:
     FIREBASE_API_KEY=TU_API_KEY
     FIREBASE_AUTH_DOMAIN=TU_AUTH_DOMAIN
     FIREBASE_PROJECT_ID=TU_PROJECT_ID
     FIREBASE_STORAGE_BUCKET=TU_STORAGE_BUCKET
     FIREBASE_MESSAGING_SENDER_ID=TU_MESSAGING_SENDER_ID
     FIREBASE_APP_ID=TU_APP_ID
     FIREBASE_MEASUREMENT_ID=TU_MEASUREMENT_ID

4. Iniciar el servidor de desarrollo:
   yarn dev

5. Abrir la aplicación en el navegador:
   - URL local: http://localhost:3000

---

## **Funcionalidades**

1. **Autenticación**:
   - Login con Firebase Authentication.
   - Logout con eliminación de la cookie de sesión.

2. **Protección de Rutas**:
   - Middleware auth.js para redirigir usuarios no autenticados a /login.

3. **Redirección**:
   - Redirección automática a /home tras un inicio de sesión exitoso.

4. **Diseño Responsivo**:
   - Utiliza Tailwind CSS para una interfaz moderna y adaptativa.

---

## **Comandos Disponibles**

- yarn dev: Inicia el servidor de desarrollo.
- yarn build: Genera los archivos para producción.
- yarn start: Inicia el servidor en modo producción.
- yarn lint: Ejecuta linter para verificar el código.

---

## **Contribuciones**
Si deseas contribuir al proyecto:
1. Realiza un fork del repositorio.
2. Crea una rama para tu nueva funcionalidad o corrección de errores:
   git checkout -b feature/nueva-funcionalidad
3. Haz un pull request cuando termines.

---

## **Licencia**
Este proyecto está licenciado bajo la Licencia MIT.

---

## **Créditos**
- Desarrollado por: Nano
- Contacto: pellanne.christian@gmail.com
EOF
