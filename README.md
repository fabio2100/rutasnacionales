# Rutas Nacionales

Un proyecto React + Vite + React-Leaflet para visualización de mapas interactivos.

## Características

- 🗺️ Mapa interactivo con Leaflet
- ⚡ Desarrollo rápido con Vite
- ⚛️ Interfaz desarrollada en React
- 📍 Marcadores personalizables
- 🎯 Diseñado específicamente para visualización de datos geográficos

## Instalación

1. Clona o descarga el proyecto
2. Instala las dependencias:
```bash
npm install
```

## Uso

### Desarrollo
Para iniciar el servidor de desarrollo:
```bash
npm run dev
```

El proyecto se ejecutará en `http://localhost:5173`

### Construcción
Para crear una versión de producción:
```bash
npm run build
```

### Vista previa
Para previsualizar la versión de producción:
```bash
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/
│   └── MapComponent.jsx    # Componente principal del mapa
├── App.jsx                 # Componente principal de la aplicación
├── App.css                # Estilos principales
├── index.css              # Estilos globales
└── main.jsx               # Punto de entrada de la aplicación
```

## Personalización

### Agregar Datos
Modifica el estado `mapData` en `MapComponent.jsx` para agregar tus propios datos:

```javascript
const [mapData] = useState([
  {
    id: 1,
    name: "Tu ubicación",
    coordinates: [latitud, longitud],
    description: "Descripción de la ubicación"
  }
])
```

### Consumir API
Descomenta y modifica el código en el `useEffect` para consumir datos de una API:

```javascript
useEffect(() => {
  fetch('/api/tu-endpoint')
    .then(response => response.json())
    .then(data => setMapData(data))
}, [mapData])
```

### Personalizar el Mapa
- **Posición inicial**: Modifica el array `position` en `MapComponent.jsx`
- **Zoom inicial**: Cambia el valor `zoom` en el componente `MapContainer`
- **Estilo de mapa**: Modifica la URL del `TileLayer` para usar diferentes proveedores de mapas

## Tecnologías

- **React**: Librería para construir interfaces de usuario
- **Vite**: Herramienta de construcción y desarrollo
- **React-Leaflet**: Componentes React para Leaflet
- **Leaflet**: Librería de mapas interactivos

## Próximos Pasos

- [ ] Integrar con API de datos reales
- [ ] Agregar filtros y búsqueda
- [ ] Implementar diferentes tipos de marcadores
- [ ] Agregar capas de datos adicionales
- [ ] Implementar clustering de marcadores para mejor rendimiento
