export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  terminal: string;
}

export const mockUsers: User[] = [
  { id: "1", username: "dgomez", password: "Pass1234", name: "DANIELA GOMEZ", terminal: "LCTPC" },
  { id: "2", username: "jlopez", password: "Pass1234", name: "JUAN LOPEZ", terminal: "LCTPC" },
  { id: "3", username: "mramirez", password: "Pass1234", name: "MARIA RAMIREZ", terminal: "ICAVE" },
  { id: "4", username: "carlosm", password: "Pass1234", name: "CARLOS MARTINEZ", terminal: "TIMSA" },
  { id: "5", username: "admin", password: "admin123", name: "ADMIN USUARIO", terminal: "LCTPC" },
];

export interface Terminal {
  id: string;
  name: string;
  code: string;
}

export const terminals: Terminal[] = [
  { id: "1", name: "HUTCHISON PORTS ICAVE", code: "ICAVE" },
  { id: "2", name: "HUTCHISON PORTS LCT", code: "LCT" },
  { id: "3", name: "HUTCHISON PORTS TIMSA", code: "TIMSA" },
  { id: "4", name: "HUTCHISON PORTS EIT", code: "EIT" },
  { id: "5", name: "HUTCHISON PORTS TILH", code: "TILH" },
  { id: "6", name: "HUTCHISON PORTS LCTPC", code: "LCTPC" },
];

export interface Container {
  id: string;
  containerId: string;
  lineaNaviera: string;
  buque: string;
  referencia: string;
  estadoContenedor: string;
  programacion: string;
  etapaDocumental: string;
  estatus: string;
  type: "deposito" | "retiro";
  cliente: string;
}

// Lista de contenedores (21 contenedores - consistente con mockFullContainers)
export const mockContainers: Container[] = [
  { id: "1", containerId: "MSCU7234561", lineaNaviera: "MSC", buque: "MSC OSCAR", referencia: "REF-001234", estadoContenedor: "En terminal", programacion: "08/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "retiro", cliente: "" },
  { id: "2", containerId: "MAEU9876543", lineaNaviera: "MAERSK", buque: "EMMA MAERSK", referencia: "REF-005678", estadoContenedor: "En transito", programacion: "09/04/2025", etapaDocumental: "Pendiente", estatus: "Liberado sin previo", type: "retiro", cliente: "" },
  { id: "3", containerId: "HLBU1234567", lineaNaviera: "HAPAG", buque: "COLOMBO EXPRESS", referencia: "REF-003456", estadoContenedor: "En patio", programacion: "07/04/2025", etapaDocumental: "En proceso", estatus: "Liberado sin previo", type: "retiro", cliente: "" },
  { id: "4", containerId: "EISU8765432", lineaNaviera: "EVERGREEN", buque: "EVER GIVEN", referencia: "REF-007890", estadoContenedor: "En terminal", programacion: "11/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "deposito", cliente: "" },
  { id: "5", containerId: "TCNU1122334", lineaNaviera: "TRITON", buque: "TRITON STAR", referencia: "REF-008901", estadoContenedor: "En terminal", programacion: "08/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "retiro", cliente: "" },
  { id: "6", containerId: "CMAU4567890", lineaNaviera: "CMA CGM", buque: "CMA MARCO POLO", referencia: "REF-009012", estadoContenedor: "En terminal", programacion: "10/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "deposito", cliente: "" },
  { id: "7", containerId: "OOLU3456789", lineaNaviera: "OOCL", buque: "OOCL HONG KONG", referencia: "REF-002345", estadoContenedor: "En terminal", programacion: "08/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "retiro", cliente: "" },
  { id: "8", containerId: "YMLU6543210", lineaNaviera: "YANG MING", buque: "YM WITNESS", referencia: "REF-006789", estadoContenedor: "En transito", programacion: "12/04/2025", etapaDocumental: "Pendiente", estatus: "Liberado sin previo", type: "deposito", cliente: "" },
  { id: "9", containerId: "TRHU5566778", lineaNaviera: "TURKON", buque: "TURKON STAR", referencia: "REF-001122", estadoContenedor: "En terminal", programacion: "09/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "retiro", cliente: "" },
  { id: "10", containerId: "COSU9012345", lineaNaviera: "COSCO", buque: "COSCO GALAXY", referencia: "REF-001111", estadoContenedor: "En terminal", programacion: "09/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "retiro", cliente: "" },
  { id: "11", containerId: "SUDU7788990", lineaNaviera: "HAMBURG SUD", buque: "CAP SAN MARCO", referencia: "REF-002222", estadoContenedor: "En terminal", programacion: "10/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "retiro", cliente: "" },
  { id: "12", containerId: "FCIU3344556", lineaNaviera: "ZIM", buque: "ZIM ANTWERP", referencia: "REF-003333", estadoContenedor: "En patio", programacion: "11/04/2025", etapaDocumental: "En proceso", estatus: "Liberado sin previo", type: "deposito", cliente: "" },
  { id: "13", containerId: "MRKU9900112", lineaNaviera: "MAERSK", buque: "MAERSK DENVER", referencia: "REF-003344", estadoContenedor: "En terminal", programacion: "10/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "retiro", cliente: "" },
  { id: "14", containerId: "GESU2233445", lineaNaviera: "MEDITERRANEAN", buque: "MSC GULSUN", referencia: "REF-004444", estadoContenedor: "En terminal", programacion: "08/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "retiro", cliente: "" },
  { id: "15", containerId: "TEMU6677889", lineaNaviera: "TRITON", buque: "TRITON WAVE", referencia: "REF-005555", estadoContenedor: "En transito", programacion: "13/04/2025", etapaDocumental: "Pendiente", estatus: "Liberado sin previo", type: "deposito", cliente: "" },
  { id: "16", containerId: "APLU1234567", lineaNaviera: "APL", buque: "APL MERLION", referencia: "REF-005566", estadoContenedor: "En terminal", programacion: "09/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "retiro", cliente: "" },
  { id: "17", containerId: "SEGU8899001", lineaNaviera: "SEAGO", buque: "SEAGO FELIXSTOWE", referencia: "REF-006677", estadoContenedor: "En terminal", programacion: "10/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "deposito", cliente: "" },
  { id: "18", containerId: "KKFU5544332", lineaNaviera: "K LINE", buque: "KASHIMA MARU", referencia: "REF-006666", estadoContenedor: "En terminal", programacion: "09/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "retiro", cliente: "" },
  { id: "19", containerId: "PONU2211009", lineaNaviera: "PIL", buque: "KOTA LEGIT", referencia: "REF-007777", estadoContenedor: "En terminal", programacion: "10/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "deposito", cliente: "" },
  { id: "20", containerId: "BMOU7766554", lineaNaviera: "BEACON", buque: "BEACON STAR", referencia: "REF-007788", estadoContenedor: "En patio", programacion: "11/04/2025", etapaDocumental: "En proceso", estatus: "Liberado sin previo", type: "retiro", cliente: "" },
  { id: "21", containerId: "ECMU3322110", lineaNaviera: "ECON", buque: "ECON TRADER", referencia: "REF-008899", estadoContenedor: "En terminal", programacion: "12/04/2025", etapaDocumental: "Completa", estatus: "Liberado sin previo", type: "deposito", cliente: "" },
];

export interface Tariff {
  id: string;
  name: string;
  type: "BASICA" | "FLEXIBLE" | "PREMIUM";
  pricePerContainer: number;
  cobro: string;
  servicioUpgrade: string;
  cancelacion: string;
  notes: string[];
  highlight?: boolean;
  specialBadge?: string;
}

export const mockTariffs: Tariff[] = [
  {
    id: "1", name: "BASICA", type: "BASICA", pricePerContainer: 0,
    cobro: "No", servicioUpgrade: "No", cancelacion: "No",
    notes: ["La fecha no es válida para BÁSICA.", "Agotado"],
  },
  {
    id: "2", name: "FLEXIBLE", type: "FLEXIBLE", pricePerContainer: 840,
    cobro: "No", servicioUpgrade: "No", cancelacion: "No",
    notes: ["La fecha no es válida para FLEXIBLE."],
  },
  {
    id: "3", name: "PREMIUM", type: "PREMIUM", pricePerContainer: 500,
    cobro: "No", servicioUpgrade: "No", cancelacion: "No",
    notes: ["Disponible según regla de fecha", "7+ espacios disponibles"],
    highlight: true, specialBadge: "Pocos espacios",
  },
];

export interface FullContainer {
  id: string;
  contenedor: string;
  bl: string;
  pesoBruto: number;
  cliente: string;
  destino: string;
  prioridad: "Alta" | "Media" | "Baja";
  selected: boolean;
}

// Los contenedores no tienen cliente asignado inicialmente - se asignan via CSV o manualmente
export const mockFullContainers: FullContainer[] = [
  { id: "1", contenedor: "MSCU7234561", bl: "BL-2025-001", pesoBruto: 24500, cliente: "", destino: "CDMX", prioridad: "Alta", selected: true },
  { id: "2", contenedor: "MAEU9876543", bl: "BL-2025-001", pesoBruto: 18200, cliente: "", destino: "CDMX", prioridad: "Media", selected: true },
  { id: "3", contenedor: "HLBU1234567", bl: "BL-2025-005", pesoBruto: 19800, cliente: "", destino: "CDMX", prioridad: "Baja", selected: true },
  { id: "4", contenedor: "EISU8765432", bl: "BL-2025-005", pesoBruto: 25000, cliente: "", destino: "MTY", prioridad: "Media", selected: true },
  { id: "5", contenedor: "TCNU1122334", bl: "BL-2025-008", pesoBruto: 20100, cliente: "", destino: "CDMX", prioridad: "Alta", selected: true },
  { id: "6", contenedor: "CMAU4567890", bl: "BL-2025-002", pesoBruto: 22100, cliente: "", destino: "GDL", prioridad: "Alta", selected: true },
  { id: "7", contenedor: "OOLU3456789", bl: "BL-2025-002", pesoBruto: 21500, cliente: "", destino: "GDL", prioridad: "Alta", selected: true },
  { id: "8", contenedor: "YMLU6543210", bl: "BL-2025-006", pesoBruto: 17600, cliente: "", destino: "GDL", prioridad: "Baja", selected: true },
  { id: "9", contenedor: "TRHU5566778", bl: "BL-2025-006", pesoBruto: 23100, cliente: "", destino: "GDL", prioridad: "Media", selected: true },
  { id: "10", contenedor: "COSU9012345", bl: "BL-2025-003", pesoBruto: 23400, cliente: "", destino: "MTY", prioridad: "Media", selected: true },
  { id: "11", contenedor: "SUDU7788990", bl: "BL-2025-003", pesoBruto: 19200, cliente: "", destino: "MTY", prioridad: "Alta", selected: true },
  { id: "12", contenedor: "FCIU3344556", bl: "BL-2025-007", pesoBruto: 21800, cliente: "", destino: "MTY", prioridad: "Baja", selected: true },
  { id: "13", contenedor: "MRKU9900112", bl: "BL-2025-007", pesoBruto: 24200, cliente: "", destino: "MTY", prioridad: "Alta", selected: true },
  { id: "14", contenedor: "GESU2233445", bl: "BL-2025-004", pesoBruto: 18500, cliente: "", destino: "PUE", prioridad: "Media", selected: true },
  { id: "15", contenedor: "TEMU6677889", bl: "BL-2025-004", pesoBruto: 22800, cliente: "", destino: "PUE", prioridad: "Alta", selected: true },
  { id: "16", contenedor: "APLU1234567", bl: "BL-2025-009", pesoBruto: 20400, cliente: "", destino: "PUE", prioridad: "Baja", selected: true },
  { id: "17", contenedor: "SEGU8899001", bl: "BL-2025-009", pesoBruto: 19700, cliente: "", destino: "PUE", prioridad: "Media", selected: true },
  { id: "18", contenedor: "KKFU5544332", bl: "BL-2025-010", pesoBruto: 21300, cliente: "", destino: "VER", prioridad: "Alta", selected: true },
  { id: "19", contenedor: "PONU2211009", bl: "BL-2025-010", pesoBruto: 18900, cliente: "", destino: "VER", prioridad: "Media", selected: true },
  { id: "20", contenedor: "BMOU7766554", bl: "BL-2025-011", pesoBruto: 24100, cliente: "", destino: "VER", prioridad: "Baja", selected: true },
  { id: "21", contenedor: "ECMU3322110", bl: "BL-2025-011", pesoBruto: 22600, cliente: "", destino: "VER", prioridad: "Alta", selected: true },
];

export interface FullRecommendation {
  cliente: string;
  contenedorPrincipal: string;
  ideal: { contenedor: string; selected: boolean }[];
  buena: { contenedor: string; selected: boolean }[];
  alternativa: { contenedor: string; selected: boolean }[];
  ultimaOpcion: { contenedor: string; selected: boolean }[];
}

// Funcion para generar recomendaciones dinamicas basadas en contenedores seleccionados y agrupados por cliente
export function generateRecommendations(containers: FullContainer[]): FullRecommendation[] {
  const recommendations: FullRecommendation[] = [];
  const usedPairs = new Set<string>();
  
  // Agrupar contenedores por cliente
  const containersByCliente: Record<string, FullContainer[]> = {};
  containers.forEach(c => {
    if (!containersByCliente[c.cliente]) {
      containersByCliente[c.cliente] = [];
    }
    containersByCliente[c.cliente].push(c);
  });
  
  // Para cada cliente, generar recomendaciones solo con sus contenedores
  Object.entries(containersByCliente).forEach(([cliente, clienteContainers]) => {
    if (clienteContainers.length < 2) return; // Necesita al menos 2 contenedores para hacer parejas
    
    clienteContainers.forEach(principal => {
      const otrosContenedores = clienteContainers.filter(c => c.contenedor !== principal.contenedor);
      if (otrosContenedores.length === 0) return;
      
      const ideal: { contenedor: string; selected: boolean }[] = [];
      const buena: { contenedor: string; selected: boolean }[] = [];
      const alternativa: { contenedor: string; selected: boolean }[] = [];
      const ultimaOpcion: { contenedor: string; selected: boolean }[] = [];
      
      otrosContenedores.forEach(otro => {
        // Crear clave unica para evitar duplicados (A-B = B-A)
        const pairKey = [principal.contenedor, otro.contenedor].sort().join("-");
        if (usedPairs.has(pairKey)) return;
        
        // Calcular peso combinado (maximo permitido: 44000 kg para un trailer)
        const pesoTotal = principal.pesoBruto + otro.pesoBruto;
        const mismoDestino = principal.destino === otro.destino;
        const mismoBL = principal.bl === otro.bl;
        
        // Clasificar segun criterios
        if (pesoTotal <= 42000 && mismoDestino && mismoBL) {
          ideal.push({ contenedor: otro.contenedor, selected: false });
        } else if (pesoTotal <= 42000 && mismoDestino) {
          buena.push({ contenedor: otro.contenedor, selected: false });
        } else if (pesoTotal <= 44000 && mismoDestino) {
          alternativa.push({ contenedor: otro.contenedor, selected: false });
        } else if (pesoTotal <= 44000) {
          ultimaOpcion.push({ contenedor: otro.contenedor, selected: false });
        }
      });
      
      // Solo agregar si hay al menos una recomendacion
      if (ideal.length > 0 || buena.length > 0 || alternativa.length > 0 || ultimaOpcion.length > 0) {
        recommendations.push({
          cliente,
          contenedorPrincipal: principal.contenedor,
          ideal,
          buena,
          alternativa,
          ultimaOpcion,
        });
      }
    });
  });
  
  return recommendations;
}

// Recomendaciones estaticas de respaldo
export const mockRecommendations: FullRecommendation[] = generateRecommendations(mockFullContainers);

export const fullTokens = ["TOKEN-AG001", "TOKEN-AG002", "TOKEN-AG003"];
