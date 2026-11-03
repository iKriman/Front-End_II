# Supermercado La Huerta

Aplicación web para gestionar el inventario de un supermercado. Permite registrar artículos con su nombre, marca y tipo de producto, consultar el catálogo y actualizar las existencias desde una interfaz adaptable a distintos tamaños de pantalla.

Proyecto de **Desarrollo Frontend II (PFY2202)**, Experiencia 1, Semana 2. Continúa el sitio desarrollado durante la primera semana.

## Funcionalidades

- Página de inicio con resumen del inventario y artículos que requieren reposición.
- Formulario independiente para registrar nuevos artículos.
- Listado en tabla con nombre, marca, tipo, precio, disponibilidad y existencias.
- Búsqueda por nombre o marca, sin distinguir mayúsculas ni tildes.
- Filtros por tipo de producto y disponibilidad.
- Controles para aumentar o disminuir existencias, sin permitir cantidades negativas.
- Estado global compartido entre las páginas mediante Context y `useReducer`.
- Guardado local del inventario y recuperación de los datos de la primera versión.
- Páginas Quiénes somos y Nuestras tiendas.
- Menú de gestión de inventario y menú inferior de navegación.
- Estilos con Tailwind CSS y publicación automática en GitHub Pages.

## Tecnologías

| Tecnología               | Uso                                              |
| ------------------------ | ------------------------------------------------ |
| React 19                 | Componentes y actualización de la interfaz       |
| React Router 7           | Navegación entre páginas                         |
| Context API y useReducer | Estado global y acciones del inventario          |
| Tailwind CSS 4           | Estilos, componentes visuales y diseño adaptable |
| Vite 7                   | Servidor de desarrollo y compilación             |
| localStorage             | Persistencia en el navegador                     |
| Node.js Test Runner      | Pruebas de validación y actualización del estado |

## Requisitos

- Node.js 22.12 o superior.
- npm.

## Instalación

Descarga o clona el repositorio y abre una terminal en la carpeta que contiene `package.json`.

```bash
npm install
npm run dev
```

Abre la dirección que indica la terminal. Con la configuración actual, normalmente será:

```text
http://localhost:5173/
```

También puedes iniciar el servidor con `npm start`. Para detenerlo, presiona `Ctrl + C`.

## Comandos

| Comando           | Descripción                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo         |
| `npm start`       | Inicia el servidor de desarrollo         |
| `npm test`        | Ejecuta las pruebas del inventario       |
| `npm run build`   | Compila la aplicación en `dist/`         |
| `npm run preview` | Sirve una vista previa de la compilación |

Para revisar la versión de producción:

```bash
npm run build
npm run preview
```

## Páginas

| Ruta de React Router | Página                          |
| -------------------- | ------------------------------- |
| `/`                  | Inicio y resumen del inventario |
| `/articulos/nuevo`   | Formulario de registro          |
| `/inventario`        | Tabla de artículos              |
| `/quienes-somos`     | Presentación del supermercado   |
| `/nuestras-tiendas`  | Información de sucursales       |
| Cualquier otra ruta  | Página no encontrada            |

Se utiliza `HashRouter` para permitir la recarga de páginas internas en GitHub Pages. Por ejemplo, el inventario se abre en `/Front-End_II/#/inventario`.

## Estructura

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── components/
│   │   ├── PageIntro.jsx
│   │   ├── InventoryMenu.jsx
│   │   └── Summary.jsx
│   ├── context/
│   │   ├── InventoryContext.jsx
│   │   └── inventoryReducer.js
│   ├── data/
│   │   └── articles.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Stores.jsx
│   │   ├── Inventory.jsx
│   │   └── NewArticle.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── tests/
│   └── inventory.test.js
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Estado global

`InventoryProvider` envuelve la aplicación en `main.jsx` y mantiene una única lista de artículos. Las páginas acceden a ella con el hook `useInventory`.

- `NewArticle` envía los datos mediante `addArticle`.
- `Inventory` consulta la lista y utiliza `changeStock` para actualizar existencias.
- `Home` calcula sus indicadores a partir de esa misma lista.
- `inventoryReducer` centraliza las acciones `article/added` y `article/stockChanged` sin modificar el estado anterior.

Las búsquedas, filtros y entradas del formulario usan `useState`, ya que solo afectan a la página donde se utilizan. El inventario se mantiene en el contexto para compartirlo entre componentes.

## Registro de artículos

Desde el menú superior, selecciona **Ingresar artículo** y completa:

| Campo            | Validación                                  |
| ---------------- | ------------------------------------------- |
| Nombre           | Obligatorio, hasta 80 caracteres            |
| Marca            | Obligatoria, hasta 60 caracteres            |
| Tipo de producto | Una de las opciones del selector            |
| Precio unitario  | Entero entre 1 y 100.000.000 pesos chilenos |
| Existencias      | Entero entre 0 y 1.000.000 unidades         |

Al guardar, la aplicación agrega el artículo al estado global y abre el listado. Los errores se muestran junto a cada campo y el foco pasa al primer dato que requiere corrección.

## Disponibilidad

| Existencias       | Estado     |
| ----------------- | ---------- |
| 0 unidades        | Agotado    |
| De 1 a 9 unidades | Stock bajo |
| 10 unidades o más | Disponible |

El botón para disminuir existencias se deshabilita al llegar a cero. El botón para aumentarlas se deshabilita al alcanzar el límite de un millón de unidades.

## Persistencia

El inventario se guarda en la clave `la-huerta-inventario-v2` de `localStorage`. Los datos se conservan al navegar y recargar desde el mismo navegador y dirección.

Si todavía existe el inventario de la primera versión, se recupera al iniciar esta versión por primera vez. La categoría anterior se convierte en el tipo de producto y las marcas que no estaban registradas quedan como **Sin especificar**. Los artículos nuevos requieren una marca.

La información no se sincroniza entre dispositivos. Si se borra el almacenamiento del sitio, se pierde el catálogo guardado. Cuando el navegador bloquea el guardado, aparece un aviso y los cambios permanecen durante la sesión.

## Tailwind CSS

El framework está instalado como dependencia de desarrollo y se integra mediante `@tailwindcss/vite` en `vite.config.js`.

`src/styles.css` importa Tailwind y define los colores de La Huerta, los estilos base y algunas clases compartidas. Las páginas utilizan utilidades de Tailwind para las grillas, espaciados, colores, tipografía, tablas y adaptación a pantallas móviles. El CSS se genera durante la compilación, sin depender de una CDN.

## Pruebas

```bash
npm test
```

Las pruebas cubren el registro de artículos, la inmutabilidad del estado, el rechazo de registros inválidos o identificadores repetidos y los límites de las existencias.

Para verificar la aplicación manualmente:

1. Ingresa un artículo con nombre, marca, tipo, precio y existencias.
2. Comprueba que aparezca en el listado y en los totales de Inicio.
3. Búscalo por nombre y por marca, y combina los filtros disponibles.
4. Modifica sus existencias, navega a otra página y regresa.
5. Recarga para comprobar el guardado local.
6. Envía el formulario vacío y revisa los mensajes de validación.
7. Comprueba las páginas informativas y los botones Atrás y Adelante.
8. Revisa el formulario y el desplazamiento de la tabla en una pantalla estrecha.

## Formato y responsabilidades

El proyecto utiliza Prettier con dos espacios de indentación, punto y coma, comillas simples y un ancho de referencia de 100 caracteres.

```bash
npm run format
npm run format:check
```

`format` aplica el formato y `format:check` comprueba que se respete. Se excluyen los archivos generados y el archivo de bloqueo de dependencias.

Las responsabilidades se distribuyen así:

| Carpeta o archivo      | Responsabilidad                                                     |
| ---------------------- | ------------------------------------------------------------------- |
| `src/App.jsx`          | Estructura común y rutas                                            |
| `src/pages/`           | Contenido y comportamiento de cada página                           |
| `src/components/`      | Encabezado de página, menú de gestión y resumen reutilizables       |
| `src/context/`         | Estado global, persistencia, validaciones y acciones del inventario |
| `src/data/articles.js` | Catálogo inicial, tipos de producto y helpers compartidos           |
| `tests/`               | Verificación de reglas del inventario                               |

Los artículos iniciales son datos de demostración definidos en `src/data/articles.js`. A partir de ellos, el contexto gestiona los datos ingresados por el usuario y su guardado en el navegador.

## Publicación y rutas

En desarrollo y en una compilación local, la aplicación utiliza `/` como base. Para otro destino, define `VITE_BASE_PATH` en un archivo `.env.local`, tomando `.env.example` como referencia:

```dotenv
VITE_BASE_PATH=/mi-supermercado/
```

También se puede pasar la base desde la terminal:

```bash
npm run build -- --base=/mi-supermercado/
```

En GitHub Pages, el flujo `.github/workflows/deploy.yml` consulta la configuración de Pages y pasa su ruta a `VITE_BASE_PATH` antes de compilar. Así, el nombre del repositorio no queda fijado en el código y un dominio propio puede usar la raíz.

En **Settings > Pages > Build and deployment**, selecciona **GitHub Actions** como origen. Al subir cambios a `main`, el flujo comprueba el formato, ejecuta las pruebas, compila y publica `dist/`.

La dirección del repositorio actual es [https://ikriman.github.io/Front-End_II/](https://ikriman.github.io/Front-End_II/). Las páginas internas conservan `HashRouter`, por ejemplo `/Front-End_II/#/inventario`.

### Escenarios de navegación

| Destino                           | Base                | Comprobaciones                                                                       |
| --------------------------------- | ------------------- | ------------------------------------------------------------------------------------ |
| Desarrollo local o dominio propio | `/`                 | Inicio, menús, Atrás y Adelante, recarga de `/#/inventario` y ruta inexistente       |
| Repositorio actual en Pages       | `/Front-End_II/`    | Carga de recursos, registro, listado y recarga de `/Front-End_II/#/inventario`       |
| Otro repositorio o subcarpeta     | `/mi-supermercado/` | Los mismos recorridos bajo la nueva base y página no encontrada dentro del fragmento |

La base se resuelve al compilar: publica el contenido generado para el destino elegido. Las carpetas `node_modules/` y `dist/` no se incluyen en el repositorio.

## Contexto

La Huerta es una marca ficticia. Los artículos y las sucursales se utilizan como datos de demostración. La aplicación funciona en el navegador y no requiere un servidor de datos.

## Documentación

- [React: Context y reducer](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [React Router](https://reactrouter.com/start/declarative/routing)
- [Tailwind CSS con Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Publicación de Vite en GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
