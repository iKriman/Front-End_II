# Supermercado La Huerta

Aplicación web para gestionar el inventario de un supermercado. Permite consultar productos, registrar nuevas entradas y actualizar sus existencias, además de navegar por la información del negocio y sus sucursales.


## Funcionalidades

- Catálogo de productos con categoría, precio, disponibilidad y existencias.
- Búsqueda por nombre, sin distinguir mayúsculas ni tildes.
- Filtros por categoría y estado de disponibilidad.
- Registro de productos con validación de campos obligatorios y valores numéricos.
- Aumento y disminución de existencias, sin permitir cantidades negativas.
- Resumen de productos registrados, unidades disponibles y productos que requieren reposición.
- Persistencia del inventario en el navegador mediante `localStorage`.
- Navegación entre páginas sin recargas completas con React Router.
- Diseño adaptable a pantallas de escritorio y dispositivos móviles.
- Página de error para rutas inexistentes.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| React 19 | Componentes y manejo del estado |
| React Router 7 | Rutas y navegación |
| JavaScript | Lógica del inventario y validaciones |
| HTML y CSS | Estructura, estilos y diseño adaptable |
| Vite 7 | Servidor de desarrollo y compilación |

## Requisitos

- Node.js 22.12 o superior.
- npm.

## Instalación

Descarga o clona el repositorio y abre una terminal en la carpeta que contiene `package.json`.

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre la dirección que aparece en la terminal. Por defecto, Vite utiliza [http://localhost:5173](http://localhost:5173).

También puedes iniciar la aplicación con `npm start`. Para detener el servidor, presiona `Ctrl + C`.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm start` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve una vista previa de la compilación |

Para revisar la versión de producción localmente:

```bash
npm run build
npm run preview
```

## Páginas y rutas

| Ruta | Página | Contenido |
| --- | --- | --- |
| `/` | Inicio | Inventario, filtros, formulario y resumen de existencias |
| `/quienes-somos` | Quiénes somos | Presentación del supermercado, misión, visión y valores |
| `/nuestras-tiendas` | Nuestras tiendas | Sucursales, direcciones, horarios y secciones disponibles |
| Cualquier otra ruta | Página no encontrada | Mensaje de error y enlace para volver al inicio |

El menú inferior está disponible en todas las páginas. Utiliza `NavLink` para identificar la sección activa y permite usar el historial del navegador.

## Estructura del proyecto

```text
supermercado/
├── src/
│   ├── App.jsx          # Páginas, rutas y lógica del inventario
│   ├── main.jsx         # Punto de entrada y configuración de BrowserRouter
│   └── styles.css       # Estilos y adaptación a distintos tamaños de pantalla
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
└── README.md
```

### Componentes principales

- **App:** define las rutas y mantiene el estado compartido de los productos.
- **Intro:** presenta el título y la descripción de cada sección.
- **Inventory:** muestra el catálogo y permite buscar, filtrar, agregar productos y modificar existencias.
- **About:** presenta la información del supermercado.
- **Stores:** muestra los datos de las sucursales.

## Uso del inventario

### Buscar y filtrar

Escribe el nombre de un producto en el buscador. Puedes combinar la búsqueda con los filtros de categoría y disponibilidad. Si no hay coincidencias, el botón **Limpiar filtros** permite volver al catálogo completo.

### Agregar un producto

1. Presiona **Agregar producto**.
2. Ingresa el nombre, la categoría, el precio y las existencias iniciales.
3. Presiona **Guardar producto**.

El precio debe ser un número entero mayor que cero. Las existencias deben ser un número entero igual o mayor que cero. Los precios se muestran en pesos chilenos (CLP).

### Actualizar existencias

Utiliza los botones **+** y **−** de cada producto. El botón para disminuir se deshabilita cuando las existencias llegan a cero.

La disponibilidad se calcula según la siguiente regla:

| Existencias | Estado |
| --- | --- |
| 0 unidades | Agotado |
| Entre 1 y 9 unidades | Stock bajo |
| 10 unidades o más | Disponible |

## Almacenamiento

El catálogo inicial se carga al utilizar la aplicación por primera vez. Los cambios se guardan en `localStorage` y se recuperan al recargar la página o volver a abrir la aplicación desde el mismo navegador y dirección.

Los datos son locales: no se sincronizan entre dispositivos y se eliminan si se borra el almacenamiento del sitio. Si el navegador impide guardar información, la aplicación muestra un aviso y conserva los cambios durante la sesión.

## Verificación manual

- Recorrer las tres páginas y comprobar la URL y el enlace activo del menú.
- Usar los botones Atrás y Adelante del navegador.
- Abrir una ruta interna directamente y recargarla.
- Buscar productos y combinar los filtros disponibles.
- Registrar un producto y comprobar que se actualicen el catálogo y los totales.
- Comprobar que el formulario rechace campos vacíos y valores negativos.
- Modificar existencias y recargar para comprobar la persistencia.
- Verificar que las existencias no puedan bajar de cero.
- Abrir una ruta inexistente y regresar al inicio.
- Revisar el diseño en un teléfono o con una ventana estrecha.

## Consideraciones de despliegue

La aplicación utiliza `BrowserRouter`. El alojamiento debe redirigir las solicitudes de rutas internas a `index.html` para permitir el acceso directo y la recarga de esas páginas.

La carpeta `dist/` se genera con `npm run build`. Las carpetas `node_modules/` y `dist/` están excluidas del repositorio mediante `.gitignore`.

