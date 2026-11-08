# Supermercado La Huerta

Aplicación React para administrar artículos, consultar existencias y gestionar un carrito de compras sincronizado con el inventario. Cada cambio de cantidad actualiza la disponibilidad del artículo sin recargar la página.

## Funcionalidades

- Inicio con indicadores de inventario y artículos que requieren reposición.
- Registro de artículos con nombre, marca, categoría, precio y existencias.
- Tabla completa del inventario y búsqueda por nombre o marca.
- Filtro dinámico por categoría y disponibilidad, sin modificar el catálogo original.
- Detalle de cada artículo mediante una ruta dinámica.
- Selección de cantidades y agregado al carrito con control de existencias.
- Carrito con aumento, disminución, eliminación y vaciado de artículos.
- Descuento y devolución de unidades al inventario en cada operación del carrito.
- Persistencia conjunta del inventario y el carrito en el navegador.
- Recuperación de artículos válidos y avisos ante inconsistencias de almacenamiento.
- Páginas Quiénes somos y Nuestras tiendas.
- Diseño responsive, navegación por teclado y mensajes accesibles.

## Tecnologías

| Tecnología               | Uso                                                 |
| ------------------------ | --------------------------------------------------- |
| React 19                 | Componentes e interfaz                              |
| React Router 7           | Navegación, rutas anidadas y parámetros dinámicos   |
| Context API y useReducer | Estado global y operaciones de inventario y carrito |
| Tailwind CSS 4           | Estilos, tema visual y diseño adaptable             |
| Vite 7                   | Desarrollo y compilación                            |
| localStorage             | Persistencia local                                  |
| Prettier                 | Formato del código                                  |
| Node.js Test Runner      | Pruebas de reglas y recuperación de datos           |

Se importa directamente desde `react-router`. La versión exacta de cada dependencia está registrada en `package-lock.json`.

## Instalación

Requiere Node.js 22.12 o superior y npm. La publicación utiliza Node.js 24.

Desde la carpeta que contiene `package.json`:

```bash
npm ci
npm run dev
```

Abre la dirección que indique la terminal, normalmente [http://localhost:5173/](http://localhost:5173/). Para detener el servidor, presiona `Ctrl + C`.

## Comandos

| Comando                     | Descripción                      |
| --------------------------- | -------------------------------- |
| `npm run dev` o `npm start` | Inicia el servidor de desarrollo |
| `npm test`                  | Ejecuta las pruebas              |
| `npm run format`            | Aplica Prettier                  |
| `npm run format:check`      | Comprueba el formato             |
| `npm run build`             | Genera la aplicación en `dist/`  |
| `npm run preview`           | Sirve la compilación localmente  |

## Recorrido de uso

1. Ingresa a **Listado de artículos** para consultar el inventario completo.
2. Selecciona una categoría o escribe un nombre o marca. El filtro cambia la vista y no elimina artículos.
3. Haz clic en el nombre de un artículo para abrir su detalle.
4. Ingresa una cantidad y presiona **Agregar al carrito**. Las unidades se descuentan de las existencias disponibles.
5. Abre **Carrito** para modificar la selección. **+** descuenta una unidad adicional y **−** devuelve una unidad al inventario.
6. Si la cantidad llega a cero, se elimina esa línea del carrito. **Quitar artículo** devuelve todas las unidades de la línea; **Vaciar carrito y devolver unidades** hace lo mismo para la selección completa.
7. Regresa al inventario para comprobar las existencias actualizadas.

Los botones **+** y **−** del listado son ajustes administrativos de existencias. Los botones del carrito transfieren unidades entre el carrito y el stock disponible.

## Reglas del inventario

- Nombre y marca son obligatorios, con un máximo de 80 y 60 caracteres respectivamente.
- La categoría debe existir en el catálogo de categorías.
- Precio: entero entre 1 y 100.000.000 pesos chilenos.
- Existencias: entero entre 0 y 1.000.000 unidades.
- Las entradas numéricas aceptan solo dígitos decimales. No admiten espacios, signos, decimales, hexadecimal ni notación científica.
- No se puede agregar al carrito una cantidad superior a las existencias disponibles.
- Un artículo agotado puede consultarse, pero no agregarse al carrito.
- El stock disponible más las unidades del carrito no puede superar el límite de existencias por artículo.
- Los precios se muestran en pesos chilenos, sin decimales.

| Unidades disponibles | Estado     |
| -------------------- | ---------- |
| 0                    | Agotado    |
| De 1 a 9             | Stock bajo |
| 10 o más             | Disponible |

## Estado y flujo de datos

`InventoryProvider` mantiene un estado global con `articles`, `cart` y un aviso temporal. El formulario, el inventario, los detalles, el carrito y el encabezado consultan esa misma fuente de datos.

Las acciones se procesan en `inventoryReducer`. Una operación de carrito calcula primero la nueva cantidad y, en la misma actualización, modifica el stock disponible y la línea del carrito. Esto evita descuentos parciales y cantidades calculadas a partir de un render anterior.

```text
Formulario → article/added → Estado global → Listado e Inicio
Detalle → cart/added → Inventario y carrito actualizados juntos
Carrito → cart/changed o cart/removed → Unidades transferidas al inventario
Estado global → Guardado de articles y cart en una sola entrada
```

Los mensajes de existencias se construyen a partir del resultado de cada acción. Los avisos pueden cerrarse, caducan a los seis segundos y se descartan al abandonar la página donde se mostraron. El aviso de registro se presenta en el listado después de guardar.

Los filtros se mantienen en los parámetros de búsqueda de la ruta. La lista visible se deriva del catálogo; no se guarda una segunda copia del inventario.

## Rutas

| Ruta                    | Página                       |
| ----------------------- | ---------------------------- |
| `/`                     | Inicio                       |
| `/inventario`           | Listado y filtros            |
| `/articulos/nuevo`      | Registro de artículos        |
| `/articulos/:articleId` | Detalle del artículo         |
| `/carrito`              | Carrito de compras           |
| `/quienes-somos`        | Información del supermercado |
| `/nuestras-tiendas`     | Sucursales                   |
| Cualquier otra ruta     | Página no encontrada         |

`AppRoutes.jsx` centraliza las rutas. `SiteLayout` comparte encabezado, menús, avisos y pie de página mediante `Outlet`. Las páginas se cargan bajo demanda con `lazy` y `Suspense`.

Se utiliza `HashRouter` para que los enlaces internos funcionen al recargar en GitHub Pages. Ejemplo: `/Front-End_II/#/articulos/2`. Un identificador inexistente muestra un mensaje y permite volver al inventario.

## Organización

```text
src/
├── components/
│   ├── inventory/
│   │   ├── ArticleRow.jsx
│   │   ├── InventoryEmpty.jsx
│   │   ├── InventoryFilters.jsx
│   │   ├── InventoryTable.jsx
│   │   └── StockControls.jsx
│   ├── layout/
│   │   ├── BottomNavigation.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   └── SiteLayout.jsx
│   ├── CartItem.jsx
│   ├── InventoryMenu.jsx
│   ├── Notice.jsx
│   ├── PageIntro.jsx
│   ├── StockBadge.jsx
│   └── Summary.jsx
├── context/
│   ├── InventoryContext.jsx
│   └── inventoryReducer.js
├── data/
│   └── articles.js
├── lib/
│   ├── inventory.js
│   └── storage.js
├── pages/
│   ├── About.jsx
│   ├── ArticleDetail.jsx
│   ├── Cart.jsx
│   ├── Home.jsx
│   ├── Inventory.jsx
│   ├── NewArticle.jsx
│   ├── NotFound.jsx
│   └── Stores.jsx
├── routes/
│   └── AppRoutes.jsx
├── App.jsx
├── main.jsx
└── styles.css
```

`data/articles.js` contiene los artículos iniciales de demostración, las categorías y los helpers de presentación. `lib/inventory.js` concentra la validación y la selección de artículos. `lib/storage.js` se ocupa de leer, recuperar y guardar datos. Los componentes de presentación no realizan operaciones directas sobre el almacenamiento.

## Persistencia y recuperación

El estado se guarda en `la-huerta-inventario-v3` con la versión del esquema, los artículos y el carrito. Al recargar, el stock ya descontado se recupera junto con el carrito; no se vuelve a descontar.

Si no hay datos de la versión 3, se intenta recuperar el inventario de las versiones 2 y 1. La categoría anterior se conserva y las marcas ausentes de la primera versión quedan como **Sin especificar**.

Cuando hay registros inválidos o duplicados, se recuperan los artículos válidos y se informa qué se omitió. Antes de guardar el resultado se conserva el contenido original en `la-huerta-inventario-v3-recuperacion`, si todavía no existe una copia. Si no puede guardarse la copia, tampoco se sobrescribe el original.

Un contenido ilegible o con estructura incorrecta abre un inventario vacío con un aviso; no se sustituye silenciosamente por productos de muestra. Las líneas inconsistentes del carrito se omiten y se solicita revisar existencias porque no es posible reconstruirlas con certeza.

Los datos iniciales solo se usan cuando no hay un inventario anterior o no se puede acceder al almacenamiento. Si el guardado está bloqueado, se informa en pantalla y los cambios permanecen durante la sesión.

Este almacenamiento pertenece al navegador y al origen de la página. No se sincroniza entre dispositivos ni entre pestañas abiertas. La aplicación no procesa pagos ni confirma pedidos.

## Estilos y accesibilidad

Tailwind CSS se integra con Vite y genera el CSS de producción. `styles.css` define el tema de La Huerta y clases compartidas para botones, paneles, menús y controles de existencias.

La interfaz adapta columnas y formularios a pantallas estrechas. La tabla conserva sus columnas y permite desplazamiento horizontal dentro de su contenedor. Se incluyen etiquetas de campos, encabezados de tablas, foco visible, enlace para saltar al contenido, mensajes anunciables y validaciones asociadas a cada entrada.

## Pruebas

```bash
npm test
npm run format:check
npm run build
```

Las pruebas de `tests/inventory.test.js` verifican registro, validación, filtrado, inmutabilidad, operaciones de carrito, devolución de unidades, límites, orden de líneas y mensajes calculados desde el estado actualizado. Incluyen una secuencia de 500 operaciones que comprueba la conservación de unidades.

`tests/storage.test.js` verifica migración, recuperación parcial, JSON ilegible, copias de recuperación, almacenamiento bloqueado y persistencia conjunta de inventario y carrito.

Para comprobar el comportamiento completo, registra un artículo con 5 unidades, agrega 2 al carrito, aumenta a 3, disminuye a 2 y quítalo. El stock esperado es 5 → 3 → 2 → 3 → 5. Recarga con el carrito ocupado para verificar que no se descuente dos veces.

## Publicación en GitHub Pages

1. Sube este proyecto completo a la raíz del repositorio, incluyendo `.github/workflows/deploy.yml`.
2. En **Settings > Pages > Build and deployment > Source**, selecciona **GitHub Actions**.
3. Al subir cambios a `main`, el flujo instala dependencias con `npm ci`, comprueba el formato, ejecuta las pruebas, compila y publica `dist/`.
4. En **Actions**, espera a que **Publicar en GitHub Pages** termine correctamente. Si es necesario, ejecútalo con **Run workflow** sobre `main`.

El flujo obtiene la base de publicación de la configuración de Pages y la pasa como `VITE_BASE_PATH`. No hay un nombre de repositorio fijado en el código.

En local, la base es `/`. Para compilar manualmente bajo otra ruta:

```bash
npm run build -- --base=/mi-supermercado/
```

También puedes definir `VITE_BASE_PATH` en `.env.local` usando `.env.example` como referencia. La base se establece durante la compilación.

La dirección del repositorio utilizado hasta esta versión es [https://github.com/iKriman/Front-End_II](https://github.com/iKriman/Front-End_II), con Pages en [https://ikriman.github.io/Front-End_II/](https://ikriman.github.io/Front-End_II/).

No subas `node_modules/`, `dist/` ni archivos privados de entorno. El archivo `.gitignore` los excluye.

## Referencias

- [React: reducer y Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [React Router](https://reactrouter.com/start/declarative/routing)
- [Tailwind CSS con Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Publicación con Vite](https://vite.dev/guide/static-deploy.html)
