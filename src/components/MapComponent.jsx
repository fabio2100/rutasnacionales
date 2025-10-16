import { MapContainer, TileLayer } from 'react-leaflet'
import { useState, useEffect, useMemo, useCallback } from 'react'
import RoutingMachine from './RoutingMachine'
import routesData from '../../routes.json'
import exampleOnlyRoutesData from '../../exampleOnlyRoutes.json'
import 'leaflet/dist/leaflet.css'

const MapComponent = () => {
  // Posición inicial del mapa (centro entre Mendoza y Buenos Aires)
  const [position] = useState([-33.7, -63.5])
  const [combinedData, setCombinedData] = useState([])
  
  // Función para extraer texto sin HTML
  const extractTextFromHTML = useCallback((htmlString) => {
    if (!htmlString) return '';
    return htmlString.replace(/<[^>]*>/g, '').trim();
  }, [])

  // Función para combinar datos de routes.json con exampleOnlyRoutes.json
  const combineRoutesData = useCallback(() => {

    const combinedArray = [];

    routesData.forEach(route => {
      // Buscar coincidencia en exampleOnlyRoutes
      const match = exampleOnlyRoutesData.find(example => {
        return example[1] === route.ruta && example[2] === route.tramo;
      });
      
      if (match) {
        // Crear nuevo elemento combinado
        const combinedElement = {
          ...route, // Todos los datos de routes.json
          estado: extractTextFromHTML(match[3]), // Cuarta posición sin HTML
          tipoDeRuta: match[4] || '', // Quinta posición 
          longitud: match[5] || '', // Sexta posición
          actualizacion: match[8] || match[match.length - 1] || '' // Novena posición o último elemento
        };
        
        combinedArray.push(combinedElement);
      } else {
        // Si no hay coincidencia, agregar solo los datos de routes con campos vacíos
        const combinedElement = {
          ...route,
          estado: '',
          tipoDeRuta: '',
          longitud: '',
          actualizacion: ''
        };
        
        combinedArray.push(combinedElement);
      }
    });

    return combinedArray;
  }, [extractTextFromHTML])

  // Función para determinar el color de la ruta basado en el estado
  const getRouteColor = (estado) => {
    if (estado === 'HABILITADA') return 'green';
    if (estado === 'CORTE TOTAL') return 'red';
    return 'orange';
  }

  // Puntos de la ruta Nacional 7 (mantenidos para referencia)
  const startPoint = useMemo(() => [-32.8492, -69.2666], []); // Mendoza
  const endPoint = useMemo(() => [-34.6346, -58.5317], []);   // Buenos Aires

  // Puntos de la segunda ruta (verde)
  const startPoint2 = useMemo(() => [-34.6620, -58.5180], []); // Punto inicial ruta 2
  const endPoint2 = useMemo(() => [-35.0262, -58.7447], []);   // Punto final ruta 2

  // Puntos de la segunda ruta (verde)
  const startPoint3 = useMemo(() => [-35.0262, -58.7447], []); // Punto inicial ruta 3
  const endPoint3 = useMemo(() => [-36.7920, -59.8404], []);   // Punto final ruta 3

  // Aquí se ejecuta la combinación de datos al cargar el componente
  useEffect(() => {
    
    // Función para combinar datos de routes.json con exampleOnlyRoutes.json
    const combineRoutesData = () => {
      const combinedArray = [];

      routesData.forEach(route => {
        // Buscar coincidencia en exampleOnlyRoutes
        const match = exampleOnlyRoutesData.find(example => {
          return example[1] === route.ruta && example[2] === route.tramo;
        });
        
        if (match) {
          // Crear nuevo elemento combinado
          const combinedElement = {
            ...route, // Todos los datos de routes.json
            estado: extractTextFromHTML(match[3]), // Cuarta posición sin HTML
            tipoDeRuta: match[4] || '', // Quinta posición (tipo de ruta)
            longitud: match[5] || '', // Sexta posición (longitud)
            actualizacion: match[8] || match[match.length - 1] || '' // Novena posición o último elemento
          };
          
          combinedArray.push(combinedElement);
        } else {
          // Si no hay coincidencia, agregar solo los datos de routes con campos vacíos
          const combinedElement = {
            ...route,
            estado: '',
            tipoDeRuta: '',
            longitud: '',
            actualizacion: ''
          };
          
          combinedArray.push(combinedElement);
        }
      });

      // Estadísticas

      
      return combinedArray;
    }
    
    // Ejecutar la combinación de datos
    const combinedResult = combineRoutesData();
      
    // Guardar en state y en window para acceso global desde la consola
    setCombinedData(combinedResult);
    window.rutasNacionalesData = combinedResult;
  }, [combineRoutesData, extractTextFromHTML, startPoint, endPoint, startPoint2, endPoint2, startPoint3, endPoint3])

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer 
        center={position} 
        zoom={6} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Renderizar rutas dinámicamente usando los primeros 5 elementos de combinedData */}
        {combinedData.slice(0, 2).map((route, index) => (
          <RoutingMachine 
            key={`${route.ruta}-${route.tramo}-${index}`}
            startPoint={route.coordinates.startPoint}
            endPoint={route.coordinates.endPoint}
            routeColor={getRouteColor(route.estado)}
            routeName={`Ruta ${route.ruta} - ${route.tramo}`}
          />
        ))}
      </MapContainer>
    </div>
  )
}

export default MapComponent
