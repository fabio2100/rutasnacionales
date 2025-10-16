import { MapContainer, TileLayer } from 'react-leaflet'
import { useState, useEffect, useMemo } from 'react'
import RoutingMachine from './RoutingMachine'
import routesData from '../../routes.json'
import exampleOnlyRoutesData from '../../exampleOnlyRoutes.json'
import 'leaflet/dist/leaflet.css'

const MapComponent = () => {
  // Posición inicial del mapa (centro entre Mendoza y Buenos Aires)
  const [position] = useState([-33.7, -63.5])
  
  // Función para extraer texto sin HTML
  const extractTextFromHTML = (htmlString) => {
    if (!htmlString) return '';
    return htmlString.replace(/<[^>]*>/g, '').trim();
  }

  // Puntos de la ruta Nacional 7
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
    console.log('🗺️ Mapa cargado con múltiples rutas usando Leaflet Routing Machine');
    console.log('🔄 Ejecutando combinación de datos...');
    
    // Función para combinar datos de routes.json con exampleOnlyRoutes.json
    const combineRoutesData = () => {
      console.log('🚀 Iniciando combinación de datos de rutas...');
      console.log('📊 Total rutas cargadas:', routesData.length);
      console.log('📊 Total exampleOnlyRoutes cargados:', exampleOnlyRoutesData.length);

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
      const withMatch = combinedArray.filter(item => item.estado !== '').length;
      const withoutMatch = combinedArray.filter(item => item.estado === '').length;

      console.log('✅ Total elementos combinados:', combinedArray.length);
      console.log('📈 Estadísticas:');
      console.log('  - Elementos con coincidencia (con estado):', withMatch);
      console.log('  - Elementos sin coincidencia (sin estado):', withoutMatch);
      console.log('🔍 Primeros 5 elementos del array combinado:');
      console.table(combinedArray);
      
      return combinedArray;
    }
    
    // Ejecutar la combinación de datos
    const combinedData = combineRoutesData();
    
    console.log('🎯 Datos de rutas mostradas en el mapa:');
    console.log('Ruta 1 (Roja) - Desde:', startPoint, 'Hasta:', endPoint);
    console.log('Ruta 2 (Verde) - Desde:', startPoint2, 'Hasta:', endPoint2);
    console.log('Ruta 3 (Verde) - Desde:', startPoint3, 'Hasta:', endPoint3);
    
    // Guardar en window para acceso global desde la consola
    window.rutasNacionalesData = combinedData;
    console.log('💾 Datos guardados en window.rutasNacionalesData para acceso global');
    
  }, [startPoint, endPoint, startPoint2, endPoint2, startPoint3, endPoint3])

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
        
        {/* Routing Machine para trazar la ruta Nacional 7 (roja) */}
        <RoutingMachine 
          startPoint={startPoint}
          endPoint={endPoint}
          routeColor="red"
          routeName="Ruta Nacional 7"
        />

        {/* Routing Machine para la segunda ruta (verde) */}
        <RoutingMachine 
          startPoint={startPoint2}
          endPoint={endPoint2}
          routeColor="green"
          routeName="Ruta 2"
        />
        <RoutingMachine 
          startPoint={startPoint3}
          endPoint={endPoint3}
          routeColor="green"
          routeName="Ruta 2"
        />
      </MapContainer>
    </div>
  )
}

export default MapComponent
