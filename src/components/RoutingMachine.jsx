import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet/dist/leaflet.css'

const useOsrmApi = import.meta.env.VITE_USE_OSRM_API === 'true'

const RoutingMachine = ({ routeId, routingData, startPoint, endPoint, routeColor = 'red', routeName = 'Ruta', routeData = {} }) => {
  const map = useMap()
  const routingControlRef = useRef(null)
  const routeLineRef = useRef(null)

  useEffect(() => {
    if (!map) return

    // Modo 1: Usar OSRM API (modo legacy)
    if (useOsrmApi && startPoint && endPoint) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(startPoint[0], startPoint[1]),
          L.latLng(endPoint[0], endPoint[1])
        ],
        router: L.Routing.osrmv1({
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
          return null
        },
        show: false,
        collapsible: true,
        showAlternatives: false,
        fitSelectedRoutes: false
      }).addTo(map)

      routingControlRef.current = routingControl

      routingControl.on('routesfound', function(e) {
        if(routeId== 66){
          console.log('------------------------------------------------')
          console.log(e)
        }
        const routes = e.routes
        const summary = routes[0].summary
        
        map.eachLayer(function(layer) {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer)
          }
        })

        if (routeLineRef.current && map.hasLayer(routeLineRef.current)) {
          map.removeLayer(routeLineRef.current)
        }

        const coordinates = routes[0].coordinates
        const routeLine = L.polyline(
          coordinates.map(coord => [coord.lat, coord.lng]),
          {
            color:  routeColor,
            weight: 6,
            opacity: 0.8,
            routeId: routeId
          }
        )

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
            
            
           
          </div>
        `
        
        routeLine.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'route-popup'
        })

        routeLine.addTo(map)
        routeLineRef.current = routeLine
      })

      return () => {
        if (routingControlRef.current && map) {
          map.removeControl(routingControlRef.current)
        }
        if (routeLineRef.current && map.hasLayer(routeLineRef.current)) {
          map.removeLayer(routeLineRef.current)
        }
      }
    }

    // Modo 2: Usar datos pre-calculados
    if (!useOsrmApi && routingData && routingData.coordinates) {
      map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer)
        }
      })

      if (routeLineRef.current && map.hasLayer(routeLineRef.current)) {
        map.removeLayer(routeLineRef.current)
      }

      const routeLine = L.polyline(
        routingData.coordinates.map(coord => [coord.lat, coord.lng]),
        {
          color: routeColor,
          weight: 6,
          opacity: 0.8,
          routeId: routeId
        }
      )

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
          
          
          
        </div>
      `
      
      routeLine.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'route-popup'
      })

      routeLine.addTo(map)
      routeLineRef.current = routeLine

      return () => {
        if (routeLineRef.current && map.hasLayer(routeLineRef.current)) {
          map.removeLayer(routeLineRef.current)
        }
      }
    }
  }, [map, routeId, routingData, startPoint, endPoint, routeColor, routeName, routeData])

  return null
}

export default RoutingMachine
