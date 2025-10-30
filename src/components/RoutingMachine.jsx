import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

const RoutingMachine = ({ routeId, startPoint, endPoint, routeColor = 'red', routeName = 'Ruta', routeData = {} }) => {
  const map = useMap()
  const routingControlRef = useRef(null)
  const routeLineRef = useRef(null)

  useEffect(() => {
    if (!map) return

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(startPoint[0], startPoint[1]),
        L.latLng(endPoint[0], endPoint[1])
      ],
      router: L.Routing.osrmv1({
        // Vite exposes env vars via import.meta.env and variables must be prefixed with VITE_
        serviceUrl: import.meta.env.VITE_ROUTE_SERVICE || 'https://router.project-osrm.org/route/v1'
      }),
      lineOptions: {
        styles: [
          {
            color: routeColor,
            weight: 0,
            opacity: 0
          }
        ],
        addWaypoints: false,
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      routeWhileDragging: false,
      addWaypoints: false,
      createMarker: function() {
        return null; // No crear marcadores
      },
      show: false,
      collapsible: true,
      showAlternatives: false,
      fitSelectedRoutes: false
    }).addTo(map)

    routingControlRef.current = routingControl

    // Evento cuando la ruta es encontrada
    routingControl.on('routesfound', function(e) {
      const routes = e.routes
      const summary = routes[0].summary
      
      // Eliminar cualquier marcador
      map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer)
        }
      })

      // Remover la línea anterior si existe
      if (routeLineRef.current && map.hasLayer(routeLineRef.current)) {
        map.removeLayer(routeLineRef.current)
      }

      // Crear una nueva polyline con el popup
      const coordinates = routes[0].coordinates
      const routeLine = L.polyline(
        coordinates.map(coord => [coord.lat, coord.lng]),
        {
          color: routeColor,
          weight: 6,
          opacity: 0.8,
          routeId: routeId // Agregar ID personalizado a las opciones
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
          
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #ccc;">
          
          <div style="font-size: 12px; color: #666;">
            <div>Distancia calculada: ${(summary.totalDistance / 1000).toFixed(1)} km</div>
            <div>Tiempo estimado: ${Math.round(summary.totalTime / 3600)} horas</div>
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

      console.log('✅ Popup asignado correctamente a:', routeName)
    })

    // Cleanup
    return () => {
      if (routingControlRef.current && map) {
        map.removeControl(routingControlRef.current)
      }
      // Limpiar la línea específica si existe
      if (routeLineRef.current && map.hasLayer(routeLineRef.current)) {
        map.removeLayer(routeLineRef.current)
      }
    }
  }, [map, startPoint, endPoint, routeColor, routeName, routeData, routeId])

  return null
}

export default RoutingMachine
