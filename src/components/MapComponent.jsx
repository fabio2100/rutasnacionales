import { MapContainer, TileLayer } from 'react-leaflet'
import { useState, useEffect, useMemo } from 'react'
import RoutingMachine from './RoutingMachine'
import 'leaflet/dist/leaflet.css'

const MapComponent = () => {
  // Posición inicial del mapa (centro entre Mendoza y Buenos Aires)
  const [position] = useState([-33.7, -63.5])
  
  // Puntos de la ruta Nacional 7
  const startPoint = useMemo(() => [-32.8492, -69.2666], []); // Mendoza
  const endPoint = useMemo(() => [-34.6346, -58.5317], []);   // Buenos Aires

  // Puntos de la segunda ruta (verde)
  const startPoint2 = useMemo(() => [-34.6620, -58.5180], []); // Punto inicial ruta 2
  const endPoint2 = useMemo(() => [-35.0262, -58.7447], []);   // Punto final ruta 2

  // Puntos de la segunda ruta (verde)
  const startPoint3 = useMemo(() => [-35.0262, -58.7447], []); // Punto inicial ruta 3
  const endPoint3 = useMemo(() => [-36.7920, -59.8404], []);   // Punto final ruta 3


  // Aquí podrías hacer fetch de tus datos reales
  useEffect(() => {
    console.log('Mapa cargado con múltiples rutas usando Leaflet Routing Machine')
    console.log('Ruta 1 (Roja) - Desde:', startPoint, 'Hasta:', endPoint)
    console.log('Ruta 2 (Verde) - Desde:', startPoint2, 'Hasta:', endPoint2)
  }, [startPoint, endPoint, startPoint2, endPoint2])

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
