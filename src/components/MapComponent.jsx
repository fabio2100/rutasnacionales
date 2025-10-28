import { MapContainer, TileLayer } from 'react-leaflet'
import { useState, useEffect, useCallback } from 'react'
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



  // Función para determinar el color de la ruta basado en el estado
  const getRouteColor = (estado) => {
    if (estado === 'HABILITADA') return 'green';
    if (estado === 'CORTE TOTAL') return 'red';
    return 'orange';
  }

  // Aquí se ejecuta la combinación de datos al cargar el componente
  useEffect(() => {
    
    // Función para combinar datos de routes.json con datos de Google Sheets
    const combineRoutesDataWithGoogleSheets = (googleSheetsValues) => {
      const combinedArray = [];

      routesData.forEach(route => {
        // Buscar coincidencia en los datos de Google Sheets
        const match = googleSheetsValues.find(example => {
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
      
      return combinedArray;
    }
    
    // Función para hacer petición al endpoint de Google Sheets
    const fetchGoogleSheetsData = async () => {
      try {
        console.log('📡 Iniciando petición a Google Sheets API...');
        const endpoint = 'https://sheets.googleapis.com/v4/spreadsheets/17AqjqeNvM4nG6cOUsUFKFaKXMiNmztYfzHIxeM9FcXk/values/tablavisible?key=AIzaSyCq2wEEKL9-6RmX-TkW23qJsrmnFHFf5tY&alt=json';
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('✅ Petición a Google Sheets completada exitosamente');
        console.log('📊 Datos recibidos de Google Sheets:');
        console.log(data);
        console.log('📋 Estructura del resultado:');
        console.log('  - Range:', data.range);
        console.log('  - Major Dimension:', data.majorDimension);
        console.log('  - Total de filas:', data.values ? data.values.length : 0);
        
        if (data.values && data.values.length > 0) {
          console.log('🔍 Primeras 3 filas de datos:');
          console.table(data.values.slice(0, 3));
          console.log('🔚 Últimas 2 filas de datos:');
          console.table(data.values.slice(-2));
          
          // Procesar los datos de Google Sheets y combinar con routesData
          const combinedResult = combineRoutesDataWithGoogleSheets(data.values);
          console.log('🔗 Datos combinados con Google Sheets:', combinedResult.length, 'rutas procesadas');
          
          // Actualizar el estado con los datos combinados
          setCombinedData(combinedResult);
          console.log(combinedResult)
          window.rutasNacionalesData = combinedResult;
        } else {
          console.warn('⚠️ No se recibieron datos válidos de Google Sheets, usando datos locales como fallback');
          // Fallback: usar datos locales si no hay datos de la API
          const localCombinedData = combineRoutesDataWithGoogleSheets(exampleOnlyRoutesData);
          setCombinedData(localCombinedData);
          window.rutasNacionalesData = localCombinedData;
        }
        
        return data;
      } catch (error) {
        console.error('❌ Error al obtener datos de Google Sheets:', error);
        console.error('🔍 Detalles del error:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        
        // Fallback: usar datos locales en caso de error
        console.log('🔄 Usando datos locales como fallback...');
        const localCombinedData = combineRoutesDataWithGoogleSheets(exampleOnlyRoutesData);
        setCombinedData(localCombinedData);
        window.rutasNacionalesData = localCombinedData;
        
        return null;
      }
    };
    
    // Ejecutar la petición a Google Sheets
    fetchGoogleSheetsData();
  }, [extractTextFromHTML])

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
        
        {/* Renderizar rutas dinámicamente usando los primeros 4 elementos de combinedData */}
        {combinedData.slice(0, 105).map((route, index) => (
          <RoutingMachine 
            key={`${route.ruta}-${route.tramo}-${index}`}
            routeId={`route-${route.ruta}-${route.tramo}-${index}`}
            startPoint={route.coordinates.startPoint}
            endPoint={route.coordinates.endPoint}
            routeColor={getRouteColor(route.estado)}
            routeName={`Ruta ${route.ruta} - ${route.tramo}`}
            routeData={{
              tramo: route.tramo,
              longitud: route.longitud,
              estado: route.estado,
              tipoDeRuta: route.tipoDeRuta
            }}
          />
        ))}
      </MapContainer>
    </div>
  )
}

export default MapComponent
