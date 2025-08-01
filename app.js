// Configuración Supabase
const SUPABASE_URL = 'https://zpllugprxjqohnmxhizq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbGx1Z3ByeGpxb2hubXhoaXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjk0NTYsImV4cCI6MjA2NjkwNTQ1Nn0.wKZ1AgPUZMy178r75N2frJlJl6wbkrjCOk4m4MVqmEs';
//supaase ornato view
const SUPABASE_O_URL = 'https://strvklqwxyenoobrqtis.supabase.co';
const SUPABASE_O_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0cnZrbHF3eHllbm9vYnJxdGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NTU2MzQsImV4cCI6MjA2ODAzMTYzNH0.tBX7U1Bsq5de9man6iCDmq-AudmYr-NC86v62tz4IKg';

// Variables globales
let map;
let pointData = [];
let polygonData = [];
let cooperData = [];
let evinData = [];
let notifyData = [];
let markersLayer;
let polygonsLayer;
let cooperLayer;
let evinLayer;
let notifyLayer;

// Colores para marcadores según prioridad
const PRIORITY_COLORS = {
  'ALTA': '#dc3545',
  'MEDIA': '#ffc107',
  'BAJA': '#28a745',
  'DEFAULT': '#007bff'
};
const color_prioridad = {
  'Alta': '#dc3545',
  'Media': '#ffc107',
  'Baja': '#28a745',
  'DEFAULT': '#007bff'
};


// Colores para marcadores según prioridad
const DAMAGE_COOPER = {
  '7': '#dc3545',
  '6': '#dc3545',
  '5': '#dc3545',
  '4': '#ffc107',
  '3': '#ffc107',
  '2': '#28a745',
  '1': '#28a745',
  'DEFAULT': '#007bff'
};

const statusEvin = {
  'Damnificada': '#dc3545',
  'Afectada': '#ffc107',
  'Sin afectación': '#28a745',
  'DEFAULT': '#007bff'
};

// Iconos por tipo de evento
const EVENT_ICONS = {
  'Inundación': { icon: 'water', color: '#1e90ff' },
  'Movimiento en masas': { icon: 'mountain', color: '#8b4513' },
  'Amenaza de colapso estructural': { icon: 'building', color: '#ff4500' },
  'Sismo': { icon: 'house-crack', color: '#9932cc' },
  'Incendio': { icon: 'fire', color: '#ff4500' },
  'DEFAULT': { icon: 'exclamation-triangle', color: '#007bff' }
};

const cooper_icon = {
  '1': { icon: 'Home', color: '#1e90ff' },
  '2': { icon: 'Terrain', color: '#8b4513' },
  '3': { icon: 'road', color: '#ff4500' },
}

// Iconos por tipo de afectación
const AFECTACION_ICONS = {
  'Vivienda': { icon: 'home', color: '#4169e1' },
  'Predio': { icon: 'map', color: '#a0522d' },
  'Área verde': { icon: 'tree', color: '#228b22' },
  'Vialidad': { icon: 'road', color: '#696969' },
  'Equipamiento': { icon: 'building', color: '#4682b4' },
  'DEFAULT': { icon: 'location-dot', color: '#007bff' }
};

// Función para obtener el icono adecuado para puntos
function getCustomIcon(item) {
  const evento = (item.EVENTO || '').toLowerCase();
  const afectacion = (item.AFECTACION || item.afectacion || '').toUpperCase().trim();
  const prioridad = (item.PRIORIDAD || '').toUpperCase().trim();

  // Buscar icono para el evento
  let iconInfo = EVENT_ICONS.DEFAULT;
  for (const [key, value] of Object.entries(EVENT_ICONS)) {
    if (evento.includes(key.toLowerCase())) {
      iconInfo = value;
      break;
    }
  }

  // Si no encontramos un icono específico para el evento, probamos con la afectación
  if (iconInfo === EVENT_ICONS.DEFAULT) {
    for (const [key, value] of Object.entries(AFECTACION_ICONS)) {
      if (afectacion.includes(key)) {
        iconInfo = value;
        break;
      }
    }
  }

  // Color según prioridad
  const color = PRIORITY_COLORS[prioridad] || iconInfo.color || PRIORITY_COLORS.DEFAULT;

  return L.divIcon({
    className: 'custom-marker',
    html: `
          <div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
          ">
            <i class="fas fa-${iconInfo.icon}"></i>
          </div>
        `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}
// Función para obtener el icono adecuado para puntos
function getCustomIconCooper(item) {
  const tipe = (item.tipe || '')
  const clase = (item.class || '')
  const desc = (item.desc || '')

  // Buscar icono para el evento
  let iconInfo = { icon: 'home', color: '#1e90ff' };

  // Color según prioridad
  const color = DAMAGE_COOPER[clase] || iconInfo.color || DAMAGE_COOPER.DEFAULT;

  return L.divIcon({
    className: 'custom-marker',
    html: `
          <div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
          ">
            <i class="fas fa-${iconInfo.icon}"></i>
          </div>
        `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}
// Función para obtener el icono adecuado para puntos
function getCustomIconEvin(item) {
  const tipe = (item.status || '')
  const clase = (item.Estatus || '')
  const desc = (item.desc || '')

  // Buscar icono para el evento
  let iconInfo = { icon: 'alarm', color: '#1e90ff' };

  // Color según prioridad
  const color = statusEvin[clase] || iconInfo.color || statusEvin.DEFAULT;

  return L.divIcon({
    className: 'custom-marker',
    html: `
          <div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
          ">
            <i class="fas fa-${iconInfo.icon}"></i>
          </div>
        `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}
function getCustomIconNotify(item) {
  // Buscar icono para el evento
  let iconInfo = { icon: 'book', color: '#1e90ff' };

  // Color según prioridad
  // Color según prioridad
  const color = color_prioridad[item.prioridad] || iconInfo.color || color_prioridad.DEFAULT;

  return L.divIcon({
    className: 'custom-marker',
    html: `
          <div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
          ">
            <i class="fas fa-${iconInfo.icon}"></i>
          </div>
        `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}
// Toggle del formulario flotante
function toggleForm() {
  const form = document.getElementById('floatingForm');
  form.classList.toggle('active');
}
// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initializeMap();
  cargarDatos();
  setupLayerControls();
});

function initializeMap() {
  // Inicializar mapa centrado en Loja, Ecuador
  map = L.map('map').setView([-3.9939, -79.2042], 12);

  // Agregar capa base
  L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    attribution: '© Google Satellite'
  }).addTo(map);

  // Inicializar capas
  markersLayer = L.layerGroup().addTo(map);
  polygonsLayer = L.layerGroup().addTo(map);
  cooperLayer = L.layerGroup().addTo(map);
  evinLayer = L.layerGroup().addTo(map);
  notifyLayer = L.layerGroup().addTo(map)
}

function setupLayerControls() {
  const showPointsCheckbox = document.getElementById('showPoints');
  const showPolygonsCheckbox = document.getElementById('showPolygons');
  const showCooperCheckbox = document.getElementById('showCooper')
  const showEvinCheckbox = document.getElementById('showEvin')
  const showNotifyCheckbox = document.getElementById('ShowNotify')

  showPointsCheckbox.addEventListener('change', () => {
    if (showPointsCheckbox.checked) {
      map.addLayer(markersLayer);
    } else {
      map.removeLayer(markersLayer);
    }
  });

  showPolygonsCheckbox.addEventListener('change', () => {
    if (showPolygonsCheckbox.checked) {
      map.addLayer(polygonsLayer);
    } else {
      map.removeLayer(polygonsLayer);
    }
  });
  showCooperCheckbox.addEventListener('change', () => {
    if (showCooperCheckbox.checked) {
      map.addLayer(cooperLayer);
    } else {
      map.removeLayer(cooperLayer);
    }
  });
  showEvinCheckbox.addEventListener('change', () => {
    if (showEvinCheckbox.checked) {
      map.addLayer(evinLayer);
    } else {
      map.removeLayer(evinLayer);
    }
  });
  showNotifyCheckbox.addEventListener('change', () => {
    if (showNotifyCheckbox.checked) {
      map.addLayer(notifyLayer);
    } else {
      map.removeLayer(notifyLayer);
    }
  });
}

async function cargarDatos() {
  const status = document.getElementById('status');

  try {
    status.textContent = '🔄 Cargando datos de ambas tablas...';
    status.className = 'status loading';

    // Cargar datos de puntos (bd_loja_1)
    const pointResponse = await fetch(`${SUPABASE_URL}/rest/v1/bd_loja_1?select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    // Cargar datos de polígonos (pol_afect)
    const polygonResponse = await fetch(`${SUPABASE_URL}/rest/v1/pol_afect?select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    // Cargar datos de Cooper (damage_cooper)
    const cooperResponse = await fetch(`${SUPABASE_URL}/rest/v1/damage_cooper?select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    // Cargar datos de puntos (EVIN)
    const evinResponse = await fetch(`${SUPABASE_URL}/rest/v1/EVIN?select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    // Cargar datos de notificaciones (notificaciones)
    const notifyResponse = await fetch(`${SUPABASE_O_URL}/rest/v1/notify?select=*`, {
      headers: {
        'apikey': SUPABASE_O_KEY,
        'Authorization': `Bearer ${SUPABASE_O_KEY}`
      }
    });

    if (!pointResponse.ok || !polygonResponse.ok || !cooperResponse.ok || !evinResponse.ok || !notifyResponse.ok) {
      throw new Error('Error al cargar datos de las tablas');
    }

    pointData = await pointResponse.json();
    polygonData = await polygonResponse.json();
    cooperData = await cooperResponse.json();
    evinData = await evinResponse.json();
    notifyData = await notifyResponse.json();
    // Mostrar datos en el mapa
    mostrarPuntosEnMapa();
    mostrarPoligonosEnMapa();
    mostrarCooperEnMapa();
    mostrarEvinEnMapa();
    mostrarNotifyEnMapa();
    // Actualizar contadores
    actualizarContadores();

    // Ajustar vista del mapa
    ajustarVistaMapa();

    status.textContent = `✅ Datos cargados: ${pointData.length} afectacones, ${polygonData.length} áreas de influencia, ${cooperData.length} puntos de control, ${evinData.length} Evines, ${notifyData.length} notificaciones realizadas.`;
    status.className = 'status success';

  } catch (error) {
    console.error('Error al cargar datos:', error);
    status.textContent = `❌ Error: ${error.message}`;
    status.className = 'status error';
  }
}
//funcipon colapse leyend
function toggleLegend() {
    const content = document.getElementById('legendContent');
    if (content.style.display === 'none') {
      content.style.display = 'block';
    } else {
      content.style.display = 'none';
    }
  }

//crear punto
function createLocationCircle(lat, lng, radius, color = '#ff0000', fillOpacity = 0.2) {
  // Círculo geográfico
  const circle = L.circle([lat, lng], {
    radius: radius,
    color: color,
    fillColor: color,
    fillOpacity: fillOpacity,
    weight: 2
  });

  // Ícono animado de pulso
  const pulseIcon = L.divIcon({
    className: 'pulse-marker',
    html: `<div class="pulse-circle" style="width: 30px; height: 30px; background: ${color};"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  const pulseMarker = L.marker([lat, lng], {
    icon: pulseIcon,
    interactive: false, // para que no interfiera con clics
    zIndexOffset: 1000
  });

  // Devolver ambos en un grupo
  return L.layerGroup([circle, pulseMarker]);
}
function mostrarPuntosEnMapa() {
  // Limpiar marcadores anteriores
  markersLayer.clearLayers();
  // Agregar marcadores para datos que tengan coordenadas
  pointData.forEach(item => {
    let lat, lng;
    // Intentar obtener coordenadas de diferentes campos posibles
    if (item.geom && item.geom.coordinates) {
      // Formato GeoJSON
      lng = parseFloat(item.geom.coordinates[0]);
      lat = parseFloat(item.geom.coordinates[1]);
    } else {
      // Campos individuales
      lat = parseFloat(item.LATITUD || item.lat || item.latitude);
      lng = parseFloat(item.LONGITUD || item.lng || item.longitude);
    }
    // Verificar que las coordenadas sean válidas para el área de Loja
    if (isNaN(lat) || isNaN(lng) || lat < -4.5 || lat > -3.5 || lng < -80.5 || lng > -78.5) {
      // Generar coordenadas aleatorias dentro del área de Loja
      lat = -3.9939 + (Math.random() * 0.4 - 0.2);
      lng = -79.2042 + (Math.random() * 0.4 - 0.2);
    }
    // Crear marcador con icono personalizado
    const marker = L.marker([lat, lng], {
      icon: getCustomIcon(item)
    });
    // Crear popup con información
    const popupContent = crearPopupContentPuntos(item, lat, lng);
    marker.bindPopup(popupContent);
    // Agregar marcador a la capa
    markersLayer.addLayer(marker);
// Verificar condiciones para mostrar círculo de localización
    
    const radio = parseFloat(item.radio || item.RADIO || 0);
   
    if (item.PRIORIDAD === 'Alta' && item.radio > 0 && item.ESTADO === 'Pendiente') {
      console.log("hasta aqui bien")
      // Crear círculo de localización con radio en metros
      const circle = createLocationCircle(lat, lng, radio, PRIORITY_COLORS['ALTA']);
      circle.addTo(markersLayer);
      
      // Agregar información al popup sobre el radio
      marker.bindPopup(popupContent + 
        `<p><span class="label">Radio de afectación:</span> ${radio} metros</p>`);
    }

  });
}

function mostrarPoligonosEnMapa() {
  // Limpiar polígonos anteriores
  polygonsLayer.clearLayers();
  // Agregar polígonos
  polygonData.forEach(item => {
    let polygon;
    if (item.geom && item.geom.coordinates) {
      // Datos GeoJSON
      const coordinates = item.geom.coordinates;
      if (item.geom.type === 'Polygon') {
        // Convertir coordenadas GeoJSON a formato Leaflet
        const leafletCoords = coordinates[0].map(coord => [coord[1], coord[0]]);
        polygon = L.polygon(leafletCoords, {
          color: '#ff0000',
          fillColor: '#ff0000',
          fillOpacity: 0.3,
          weight: 2
        });
      } else if (item.geom.type === 'MultiPolygon') {
        // Manejar MultiPolygon
        const leafletCoords = coordinates.map(poly =>
          poly[0].map(coord => [coord[1], coord[0]])
        );
        polygon = L.polygon(leafletCoords, {
          color: item.tipo === 1 ? '#ffff00' : '#0000ff',
          fillColor: item.tipo === 1 ? '#ffff00' : '#0000ff',
          fillOpacity: 0.3,
          weight: 2
        });
      }
    } else {
      // Si no hay geometría válida, crear un polígono de ejemplo en Loja
      const centerLat = -3.9939 + (Math.random() * 0.2 - 0.1);
      const centerLng = -79.2042 + (Math.random() * 0.2 - 0.1);
      const size = 0.005; // Tamaño del polígono

      polygon = L.polygon([
        [centerLat - size, centerLng - size],
        [centerLat - size, centerLng + size],
        [centerLat + size, centerLng + size],
        [centerLat + size, centerLng - size]
      ], {
        color: '#ff0000',
        fillColor: '#ff0000',
        fillOpacity: 0.3,
        weight: 2
      });
    }

    if (polygon) {
      // Crear popup con información
      const popupContent = crearPopupContentPoligonos(item);
      polygon.bindPopup(popupContent);

      // Agregar polígono a la capa
      polygonsLayer.addLayer(polygon);
    }
  });
}

function mostrarCooperEnMapa() {
  // Limpiar marcadores anteriores
  cooperLayer.clearLayers();

  // Agregar marcadores para datos que tengan coordenadas
  cooperData.forEach(item => {
    let lat, lng;

    // Intentar obtener coordenadas de diferentes campos posibles
    if (item.geom && item.geom.coordinates) {
      // Formato GeoJSON
      lng = parseFloat(item.geom.coordinates[0]);
      lat = parseFloat(item.geom.coordinates[1]);
    } else {
      // Campos individuales
      lat = parseFloat(item.LATITUD || item.lat || item.latitude);
      lng = parseFloat(item.LONGITUD || item.lng || item.longitude);
    }

    // Verificar que las coordenadas sean válidas para el área de Loja
    if (isNaN(lat) || isNaN(lng) || lat < -4.5 || lat > -3.5 || lng < -80.5 || lng > -78.5) {
      // Generar coordenadas aleatorias dentro del área de Loja
      lat = -3.9939 + (Math.random() * 0.4 - 0.2);
      lng = -79.2042 + (Math.random() * 0.4 - 0.2);
    }

    // Crear marcador con icono personalizado
    const marker = L.marker([lat, lng], {
      icon: getCustomIconCooper(item)
    });

    // Crear popup con información
    const popupContent = crearPopupContentCooper(item, lat, lng);
    marker.bindPopup(popupContent);

    // Agregar marcador a la capa
    cooperLayer.addLayer(marker);
  });
}

function mostrarEvinEnMapa() {
  // Limpiar marcadores anteriores
  evinLayer.clearLayers();

  // Agregar marcadores para datos que tengan coordenadas
  evinData.forEach(item => {
    let lat, lng;

    // Intentar obtener coordenadas de diferentes campos posibles
    if (item.geom && item.geom.coordinates) {
      // Formato GeoJSON
      lng = parseFloat(item.geom.coordinates[0]);
      lat = parseFloat(item.geom.coordinates[1]);
    } else {
      // Campos individuales
      lat = parseFloat(item.LATITUD || item.lat || item.latitude);
      lng = parseFloat(item.LONGITUD || item.lng || item.longitude);
    }

    // Verificar que las coordenadas sean válidas para el área de Loja
    if (isNaN(lat) || isNaN(lng) || lat < -4.5 || lat > -3.5 || lng < -80.5 || lng > -78.5) {
      // Generar coordenadas aleatorias dentro del área de Loja
      lat = -3.9939 + (Math.random() * 0.4 - 0.2);
      lng = -79.2042 + (Math.random() * 0.4 - 0.2);
    }

    // Crear marcador con icono personalizado
    const marker = L.marker([lat, lng], {
      icon: getCustomIconEvin(item)
    });

    // Crear popup con información
    const popupContent = crearPopupContentEvin(item, lat, lng);
    marker.bindPopup(popupContent);

    // Agregar marcador a la capa
    evinLayer.addLayer(marker);
  });
}

function mostrarNotifyEnMapa() {
  // Limpiar marcadores anteriores
  notifyLayer.clearLayers();

  // Agregar marcadores para datos que tengan coordenadas
  notifyData.forEach(item => {
    let lat, lng;
    // Intentar obtener coordenadas de diferentes campos posibles
    if (item.geom && item.geom.coordinates) {
      // Formato GeoJSON
      lng = parseFloat(item.geom.coordinates[0]);
      lat = parseFloat(item.geom.coordinates[1]);

    }
    // Verificar que las coordenadas sean válidas para el área de Loja
    if (isNaN(lat) || isNaN(lng) || lat < -4.5 || lat > -3.5 || lng < -80.5 || lng > -78.5) {
      // Generar coordenadas aleatorias dentro del área de Loja
      lat = -3.9939 + (Math.random() * 0.4 - 0.2);
      lng = -79.2042 + (Math.random() * 0.4 - 0.2);
    }
    // Crear marcador con icono personalizado
    const marker = L.marker([lat, lng], {
      icon: getCustomIconNotify(item)
    });
    // Crear popup con información
    const popupContent = crearPopupContentNotify(item, lat, lng);
    marker.bindPopup(popupContent);
    // Agregar marcador a la capa
    notifyLayer.addLayer(marker);
  });
}

function crearPopupContentPuntos(item, lat, lng) {
  const formatCoords = (coord) => {
    return coord.toFixed(6);
  };

  let content = `<div class="popup-content">`;

  // Título
  const titulo = item.EVENTO || item.id || 'Registro de Punto';
  content += `<h4>${titulo} - ${item.id} </h4>`;
  content += `<img src="${item.ANEX_FOT}"
  style="max-width: 100%; max-height: 200px; height: auto; display: block; margin: 0 auto;"
   alt=${item.descripcion}>`;
  // Mostrar campos principales
  const camposPrincipales = ['FECHA', 'ANIO', 'SECTOR_BASICO', 'AFECTACION', 'PRIORIDAD'];
  camposPrincipales.forEach(campo => {
    if (item[campo]) {
      let valor = item[campo];
      if (campo === 'FECHA') {
        valor = new Date(valor).toLocaleDateString();
      }

      content += `<p><span class="label">${formatFieldName(campo)}:</span> ${valor}</p>`;
    }
  });
  // Descripción si existe
  if (item.descripcion) {
    const desc = item.descripcion.length > 100 ?
      item.descripcion.substring(0, 100) + '...' :
      item.descripcion;
    content += `<p><span class="label">Descripción:</span> ${desc}</p>`;
  }
  /* content += `<p><span class="label">Atención:</span><br>${item.depen}</p>`;
  content += `<p><span class="label">Posibles acciones a realizar:</span><br>${item.accions}</p>`;
  content += `<p><span class="label">Detalle:</span><br>${item.informe_tecnico}</p>`; */
  // Coordenadas
  content += `<p><span class="label">Coordenadas:</span><br>${formatCoords(lat)}, ${formatCoords(lng)}</p>`;
  // --- BOTÓN DE DESCARGA ---
  content += `
  <button onclick="generarPDF('${escapeHtml(titulo)}', ${lat}, ${lng}, '${escapeHtml(JSON.stringify(item))}')" 
          style="background: #4CAF50; color: white; border: none; padding: 8px 16px; cursor: pointer; margin-top: 10px;">
    Descargar Reporte (PDF)
  </button>
`;
  content += `</div>`;
  return content;
}

// Función generarPDF actualizada:
function generarPDF(titulo, lat, lng, itemStr) {
  try {
    const item = JSON.parse(decodeURIComponent(itemStr));
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración de márgenes
    const leftMargin = 15;
    const rightMargin = 15;
    const topMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - leftMargin - rightMargin;

    // Fecha actual de descarga
    const fechaDescarga = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Configuración inicial del documento
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Reporte: ${titulo}`, pageWidth / 2, topMargin, { align: 'center' });

    // Fecha de descarga (más pequeña y en esquina superior derecha)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado: ${fechaDescarga}`, pageWidth - rightMargin, topMargin, { align: 'right' });

    let yPosition = topMargin + 20;

    // Línea divisoria
    doc.setDrawColor(200, 200, 200);
    doc.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
    yPosition += 10;

    // Agregar imagen (si existe)
    if (item.ANEX_FOT) {
      // Ajustar tamaño de la imagen para que quepa en el ancho con márgenes
      const imgWidth = pageWidth - leftMargin - rightMargin;
      const imgHeight = 100; // Altura fija o podrías calcular proporción

      doc.addImage(item.ANEX_FOT, 'JPEG', leftMargin, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;

      // Otra línea divisoria después de la imagen
      doc.line(leftMargin, yPosition - 5, pageWidth - rightMargin, yPosition - 5);
      yPosition += 5;
    }

    // Coordenadas
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Ubicación:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, leftMargin + 30, yPosition);
    yPosition += 10;

    // Campos principales
    const camposPrincipales = ['FECHA', 'sector_barrio', 'afectación', 'PRIORIDAD', 'descripcion'];
    camposPrincipales.forEach(campo => {
      if (item[campo]) {
        let valor = item[campo];
        if (campo === 'FECHA') {
          valor = new Date(valor).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        }

        doc.setFont("helvetica", "bold");
        doc.text(`${campo}:`, leftMargin, yPosition);
        doc.setFont("helvetica", "normal");

        // Dividir texto largo en múltiples líneas
        const lines = doc.splitTextToSize(String(valor), maxWidth - 40);
        doc.text(lines, leftMargin + 30, yPosition);
        yPosition += Math.max(10, lines.length * 7);
      }
    });
    doc.setFont("helvetica", "bold");
    doc.text("atiende:", leftMargin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(item.depen, leftMargin + 30, yPosition);
    yPosition += 7;

    // Acciones a desarrollar con manejo de texto largo
    if (item.accions) {
      doc.setFont("helvetica", "bold");
      doc.text("Acciones a desarrollar:", leftMargin, yPosition);
      yPosition += 7;

      doc.setFont("helvetica", "normal");
      const accionesLines = doc.splitTextToSize(item.accions, maxWidth);
      doc.text(accionesLines, leftMargin, yPosition);
      yPosition += accionesLines.length * 7 + 10;
    }

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Reporte generado automáticamente", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    // Guardar el PDF
    doc.save(`reporte_${titulo.replace(/[^a-z0-9]/gi, '_')}_${fechaDescarga.replace(/[/,: ]/g, '-')}.pdf`);
  } catch (e) {
    console.error("Error al generar PDF:", e);
    alert("Ocurrió un error al generar el reporte");
  }
}

// Función para escapar HTML (seguridad)
function escapeHtml(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


function crearPopupContentPoligonos(item) {
  let content = `<div class="popup-content">`;

  // Título
  const titulo = item.tipo === 1 ? 'Susceptible a movimiento en masas' : 'Area Inundable';
  content += `<h4>${titulo}</h4>`;

  // Mostrar campos disponibles
  const campos = ['Descripcio',];

  campos.forEach(campo => {
    if (item[campo]) {
      let valor = item[campo];
      let label = formatFieldName(campo);
      content += `<p><span class="label">${label}:</span> ${valor}</p>`;
    }
  });

  // Información adicional

  content += `</div>`;
  return content;
}
function crearPopupContentCooper(item, lat, lng) {
  const formatCoords = (coord) => {
    return coord.toFixed(6);
  };
  let content = `<div class="popup-content">`;
  // Título
  const titulo = item.EVENTO || `clase ${item.class}` || 'Registro de Punto';
  content += `<h4>${item.id} - ${titulo}- </h4>`;
  // Mostrar campos principales
  const camposPrincipales = ['fecha', , "title", 'tipe', 'desc'];
  camposPrincipales.forEach(campo => {
    if (item[campo]) {
      let valor = item[campo];
      if (campo === 'fecha') {
        valor = new Date(valor).toLocaleDateString();
      }
      content += `<p><span class="label">${formatFieldName(campo)}:</span> ${valor}</p>`;
    }
  });
  // Coordenadas
  content += `<p><span class="label">Coordenadas:</span><br>${formatCoords(lat)}, ${formatCoords(lng)}</p>`;
  // Descripción si existe
  if (item.descripcion) {
    const desc = item.descripcion.length > 100 ?
      item.descripcion.substring(0, 100) + '...' :
      item.descripcion;
    content += `<p><span class="label">Descripción:</span> ${desc}</p>`;
  }
  content += `</div>`;
  return content;
}
function crearPopupContentEvin(item, lat, lng) {
  const formatCoords = (coord) => {
    return coord.toFixed(6);
  };
  let content = `<div class="popup-content">`;
  // Título
  const titulo = item.EVENTO || `Estado ${item.Estatus}` || 'Registro de Punto';
  content += `<h4>${titulo} -${item.id} </h4>`;
  // Mostrar campos principales
  const camposPrincipales = ['Fecha Entrevista', 'Fecha Subida', 'Ocupacion', 'Nivel_vivienda'];
  camposPrincipales.forEach(campo => {
    if (item[campo]) {
      let valor = item[campo];
      if (campo === 'FECHA') {
        valor = new Date(valor).toLocaleDateString();
      }
      content += `<p><span class="label">${formatFieldName(campo)}:</span> ${valor}</p>`;
    }
  });
  // Coordenadas
  content += `<p><span class="label">Coordenadas:</span><br>${formatCoords(lat)}, ${formatCoords(lng)}</p>`;
  // Descripción si existe
  if (item.descripcion) {
    const desc = item.descripcion.length > 100 ?
      item.descripcion.substring(0, 100) + '...' :
      item.descripcion;
    content += `<p><span class="label">Descripción:</span> ${desc}</p>`;
  }
  content += `</div>`;
  return content;
}
function crearPopupContentNotify(item, lat, lng) {
  const formatCoords = (coord) => {
    return coord.toFixed(6);
  };
  let content = `<div class="popup-content">`;
  // Título
  const titulo = item.EVENTO || `Reporta ${item.reporta}` || 'Registro de Punto';
  content += `<h4>${titulo} -${item.id} </h4>`;
  // Mostrar campos principales
  const camposPrincipales = ['boleta', 'Fecha', 'prioridad'];
  camposPrincipales.forEach(campo => {
    if (item[campo]) {
      let valor = item[campo];
      if (campo === 'FECHA') {
        valor = new Date(valor).toLocaleDateString();
      }
      content += `<p><span class="label">${formatFieldName(campo)}:</span> ${valor}</p>`;
    }
  });
  // Coordenadas
  content += `<p><span class="label">Coordenadas:</span><br>${formatCoords(lat)}, ${formatCoords(lng)}</p>`;
  // Descripción si existe
  if (item.desc) {
    /* const desc = item.descripcion.length > 100 ?
      item.descripcion.substring(0, 100) + '...' :
      item.descripcion; */
    content += `<p><span class="label">Descripción:</span> ${item.desc}</p>`;
  }
  return content;
}

function formatFieldName(field) {
  const fieldNames = {
    'ANIO': 'Año',
    'SECTOR_BASICO': 'Sector',
    'EVENTO': 'Tipo de Evento',
    'AFECTACION': 'Afectación',
    'ESTADO': 'Estado',
    'PRIORIDAD': 'Prioridad',
    'FECHA': 'Fecha',
    'id': 'ID',
    'tipo': 'Tipo',
    'desc': 'Descripción',
    'fid': 'ID Único'
  };
  return fieldNames[field] || field;
}

function actualizarContadores() {
  document.getElementById('pointCount').textContent = pointData.length;
  document.getElementById('polygonCount').textContent = polygonData.length;
  document.getElementById('cooperCount').textContent = cooperData.length;
  document.getElementById('evinCount').textContent = evinData.length;
  document.getElementById('notifyCount').textContent = notifyData.length;
}

document.getElementById('toggleSidebar').addEventListener('click', function () {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('collapsed');

  // Cambia la flecha del botón
  this.textContent = sidebar.classList.contains('collapsed') ? '⮞' : '⮜';
});
function ajustarVistaMapa() {
  const allLayers = [];
  // Agregar todas las capas para calcular bounds
  markersLayer.eachLayer(layer => allLayers.push(layer));
  polygonsLayer.eachLayer(layer => allLayers.push(layer));
  cooperLayer.eachLayer(layer => allLayers.push(layer));
  evinLayer.eachLayer(layer => allLayers.push(layer));
  notifyLayer.eachLayer(layer => allLayers.push(layer));

  if (allLayers.length > 0) {
    const group = new L.featureGroup(allLayers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
}