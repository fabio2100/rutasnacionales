import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

const RoutingMachine = ({ startPoint, endPoint, routeColor = 'red', routeName = 'Ruta' }) => {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(startPoint[0], startPoint[1]),
        L.latLng(endPoint[0], endPoint[1])
      ],
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      }),
      lineOptions: {
        styles: [
          {
            color: routeColor,
            weight: 6,
            opacity: 0.8
          }
        ],
        addWaypoints: false,
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      routeWhileDragging: false,
      addWaypoints: false,
      createMarker: function() {
        return null; // No crear marcadores en absoluto
      },
      show: false, // Ocultar las instrucciones por defecto
      collapsible: true,
      showAlternatives: false,
      fitSelectedRoutes: false
    }).addTo(map)

    // Evento cuando la ruta es encontrada
    routingControl.on('routesfound', function(e) {
      const routes = e.routes
      const summary = routes[0].summary
      console.log('Ruta encontrada:', {
        distancia: `${(summary.totalDistance / 1000).toFixed(1)} km`,
        tiempo: `${Math.round(summary.totalTime / 3600)} horas`
      })
      
      // Eliminar cualquier marcador que pudiera haber aparecido
      map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer)
        }
      })

      // Buscar y agregar popup a las líneas de ruta
      setTimeout(() => {
        map.eachLayer(function(layer) {
          if (layer instanceof L.Polyline && layer.options && layer.options.color === routeColor) {
            layer.bindPopup(`
              <div style="text-align: center;">
                <strong>${routeName}</strong><br>
                <span style="color: ${routeColor}; font-weight: bold;">Color: ${routeColor}</span><br>
                <small>Distancia: ${(summary.totalDistance / 1000).toFixed(1)} km</small><br>
                <small>Tiempo estimado: ${Math.round(summary.totalTime / 3600)} horas</small>
              </div>
            `)
          }
        })
      }, 100)
    })

    // Cleanup
    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl)
      }
    }
  }, [map, startPoint, endPoint, routeColor, routeName])

  return null
}

export default RoutingMachine
