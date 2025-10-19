import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

const RoutingMachine = ({ routeId, startPoint, endPoint, routeColor = 'red', routeName = 'Ruta', routeData = {} }) => {
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

    // Variable para almacenar la referencia de la línea de esta ruta específica
    let routeLine = null;

    // Evento cuando la ruta es encontrada
    routingControl.on('routesfound', function(e) {
      const routes = e.routes
      const summary = routes[0].summary
      console.log('Ruta encontrada:', routeName, {
        distancia: `${(summary.totalDistance / 1000).toFixed(1)} km`,
        tiempo: `${Math.round(summary.totalTime / 3600)} horas`
      })
      
      // Eliminar cualquier marcador que pudiera haber aparecido
      map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer)
        }
      })

      // Buscar y marcar la línea de ruta específica de este componente
      setTimeout(() => {
        map.eachLayer(function(layer) {
          if (layer instanceof L.Polyline && 
              layer.options && 
              layer.options.color === routeColor && 
              !layer._routeId) { // Solo si no tiene ID asignado aún
            
            // Asignar el ID único a esta línea
            layer._routeId = routeId;
            routeLine = layer;
            
            // Construir el contenido del popup en el orden especificado
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
            
            layer.bindPopup(popupContent, {
              maxWidth: 300,
              className: 'route-popup'
            });
            
            console.log('Popup asignado a ruta:', routeId, routeName);
            return; // Salir del loop una vez que encontramos nuestra línea
          }
        })
      }, 100)
    })

    // Cleanup
    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl)
      }
      // Limpiar la línea específica si existe
      if (routeLine && map.hasLayer(routeLine)) {
        map.removeLayer(routeLine);
      }
    }
  }, [map, startPoint, endPoint, routeColor, routeName, routeData, routeId])

  return null
}

export default RoutingMachine
