import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const RoutingMachine = ({ routeId, routingData, routeColor = 'red', routeName = 'Ruta', routeData = {} }) => {
  const map = useMap()
  const routeLineRef = useRef(null)

  useEffect(() => {
    if (!map || !routingData || !routingData.coordinates) return

    // Eliminar cualquier marcador previo
    map.eachLayer(function(layer) {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })

    // Remover la línea anterior si existe
    if (routeLineRef.current && map.hasLayer(routeLineRef.current)) {
      map.removeLayer(routeLineRef.current)
    }

    // Crear una polyline usando las coordenadas pre-calculadas
    const routeLine = L.polyline(
      routingData.coordinates.map(coord => [coord.lat, coord.lng]),
      {
        color: routeColor,
        weight: 6,
        opacity: 0.8,
        routeId: routeId
      }
    )

    // Construir el contenido del popup
    const popupContent = `
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <strong style="font-size: 16px; margin-bottom: 8px; display: block;">${routeName}</strong>
        
        <div style="margin: 6px 0;">
          <strong>Tramo:</strong> ${routeData.tramo || 'No disponible'}
        </div>
        
        <div style="margin: 6px 0;">
          <strong>Longitud:</strong> ${routeData.longitud || 'No disponible'}
        </div>
        
        <div style="margin: 6px 0;">
          <strong>Estado:</strong> 
          <span style="color: ${routeColor}; font-weight: bold; margin-left: 4px;">
            ${routeData.estado || 'No disponible'}
          </span>
        </div>
        
        <div style="margin: 6px 0;">
          <strong>Tipo de Ruta:</strong> ${routeData.tipoDeRuta || 'No disponible'}
        </div>
        
        <div style="margin: 6px 0;">
          <strong>Actualización:</strong> ${routeData.actualizacion || 'No disponible'}
        </div>

        ${routeData.observaciones ? `<div style="margin: 6px 0;">
          <strong>Observaciones:</strong> ${routeData.observaciones}
        </div>` : ''}
        
        <hr style="margin: 8px 0; border: none; border-top: 1px solid #ccc;">
        
        <div style="font-size: 12px; color: #666;">
          <div>Distancia calculada: ${(routingData.totalDistance / 1000).toFixed(1)} km</div>
          <div>Tiempo estimado: ${Math.round(routingData.totalTime / 3600)} horas</div>
        </div>
      </div>
    `
    
    // Bind popup to the polyline
    routeLine.bindPopup(popupContent, {
      maxWidth: 300,
      className: 'route-popup'
    })

    // Add to map
    routeLine.addTo(map)
    routeLineRef.current = routeLine

    // Cleanup
    return () => {
      if (routeLineRef.current && map.hasLayer(routeLineRef.current)) {
        map.removeLayer(routeLineRef.current)
      }
    }
  }, [map, routeId, routingData, routeColor, routeName, routeData])

  return null
}

export default RoutingMachine
