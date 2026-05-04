import { useState, useRef, useMemo } from "react";
import { mockFullContainers, generateRecommendations, FullContainer } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Upload, FileSpreadsheet, Search, Filter, Package, ArrowLeft, RotateCcw } from "lucide-react";
import { useApp } from "@/context/AppContext";

const ArmadoFull = () => {
  const navigate = useNavigate();
  const { clientesByContainer, bulkAssignClientes } = useApp();
  const [containers, setContainers] = useState<FullContainer[]>(
    mockFullContainers.map((c) => ({ ...c }))
  );
  const [blFilter, setBlFilter] = useState("");
  const [filterCliente, setFilterCliente] = useState("Todos");
  const [filterDestino, setFilterDestino] = useState("Todos");
  const [filterPrioridad, setFilterPrioridad] = useState("Todos");
  const [filterPeso, setFilterPeso] = useState("Todos");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allSelected = containers.length > 0 && containers.every((c) => c.selected);

  const toggleSelectAll = () => {
    const newVal = !allSelected;
    setContainers((prev) => prev.map((c) => ({ ...c, selected: newVal })));
  };

  const uniqueDestinos = useMemo(() => [...new Set(containers.map(c => c.destino))].sort(), [containers]);

  // Contenedores con cliente asignado del contexto
  const containersWithClientes = useMemo(() => {
    return containers.map((c) => ({ ...c, cliente: clientesByContainer[c.contenedor] || c.cliente }));
  }, [containers, clientesByContainer]);

  // Obtener listas unicas de clientes (solo asignados)
  const uniqueClientes = useMemo(() => {
    const clientes = [...new Set(containersWithClientes.map(c => c.cliente).filter(c => c && c.trim() !== ""))];
    return clientes.sort();
  }, [containersWithClientes]);

  // Filtrar contenedores
  const displayContainers = useMemo(() => {
    return containersWithClientes
      .filter((c) => !blFilter || c.bl.toLowerCase().includes(blFilter.toLowerCase()) || c.contenedor.toLowerCase().includes(blFilter.toLowerCase()))
      .filter((c) => filterCliente === "Todos" || (filterCliente === "Sin asignar" && (!c.cliente || c.cliente.trim() === "")) || c.cliente === filterCliente)
      .filter((c) => filterDestino === "Todos" || c.destino === filterDestino)
      .filter((c) => filterPrioridad === "Todos" || c.prioridad === filterPrioridad)
      .filter((c) => {
        if (filterPeso === "Todos") return true;
        if (filterPeso === "Ligero") return c.pesoBruto < 20000;
        if (filterPeso === "Medio") return c.pesoBruto >= 20000 && c.pesoBruto < 23000;
        if (filterPeso === "Pesado") return c.pesoBruto >= 23000;
        return true;
      });
  }, [containersWithClientes, blFilter, filterCliente, filterDestino, filterPrioridad, filterPeso]);

  const selectedCount = containers.filter(c => c.selected).length;

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = String(ev.target?.result || "");
        const lines = text.split(/\r?\n/).filter((l) => l.trim());
        const mapping: Record<string, string> = {};
        const startIdx = /id|contenedor|cliente/i.test(lines[0] || "") ? 1 : 0;
        for (let i = startIdx; i < lines.length; i++) {
          const [id, ...rest] = lines[i].split(/[,;]/).map((s) => s.trim());
          const cliente = rest.join(",").trim();
          if (id && cliente) mapping[id] = cliente;
        }
        if (Object.keys(mapping).length === 0) {
          toast({ title: "CSV vacio o sin datos validos", variant: "destructive" });
          return;
        }
        bulkAssignClientes(mapping);
        toast({ title: `Clientes asignados a ${Object.keys(mapping).length} contenedores` });
      } catch {
        toast({ title: "Error al leer el archivo", variant: "destructive" });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const loadExampleCsv = () => {
    // Asignar clientes a todos los 21 contenedores
    const example: Record<string, string> = {
      // ACME EXPORTS SA DE CV - CDMX
      "MSCU7234561": "ACME EXPORTS SA DE CV",
      "MAEU9876543": "ACME EXPORTS SA DE CV",
      "HLBU1234567": "ACME EXPORTS SA DE CV",
      "EISU8765432": "ACME EXPORTS SA DE CV",
      "TCNU1122334": "ACME EXPORTS SA DE CV",
      // GLOBAL TRADE MX - GDL
      "CMAU4567890": "GLOBAL TRADE MX",
      "OOLU3456789": "GLOBAL TRADE MX",
      "YMLU6543210": "GLOBAL TRADE MX",
      "TRHU5566778": "GLOBAL TRADE MX",
      // LOGISTICA NORTE SA - MTY
      "COSU9012345": "LOGISTICA NORTE SA",
      "SUDU7788990": "LOGISTICA NORTE SA",
      "FCIU3344556": "LOGISTICA NORTE SA",
      "MRKU9900112": "LOGISTICA NORTE SA",
      // IMPORTADORA DEL SUR - PUE
      "GESU2233445": "IMPORTADORA DEL SUR",
      "TEMU6677889": "IMPORTADORA DEL SUR",
      "APLU1234567": "IMPORTADORA DEL SUR",
      "SEGU8899001": "IMPORTADORA DEL SUR",
      // COMERCIALIZADORA VERACRUZ - VER
      "KKFU5544332": "COMERCIALIZADORA VERACRUZ",
      "PONU2211009": "COMERCIALIZADORA VERACRUZ",
      "BMOU7766554": "COMERCIALIZADORA VERACRUZ",
      "ECMU3322110": "COMERCIALIZADORA VERACRUZ",
    };
    bulkAssignClientes(example);
    toast({ title: "Ejemplo cargado", description: `${Object.keys(example).length} contenedores con cliente asignado` });
  };

  const handleConsultar = () => {
    const selected = containers.filter((c) => c.selected);
    if (selected.length < 2) {
      toast({ title: "Selecciona al menos 2 contenedores para armar fulles", variant: "destructive" });
      return;
    }
    
    // Aplicar clientes del contexto a los contenedores seleccionados
    const selectedWithClientes = selected.map((c) => ({
      ...c,
      cliente: clientesByContainer[c.contenedor] || c.cliente
    }));
    
    // Verificar que al menos algunos contenedores tengan cliente asignado
    const containersWithCliente = selectedWithClientes.filter(c => c.cliente && c.cliente.trim() !== "");
    if (containersWithCliente.length < 2) {
      toast({ 
        title: "Clientes requeridos", 
        description: "Asigna clientes a al menos 2 contenedores (via CSV o ejemplo) para generar recomendaciones por cliente",
        variant: "destructive" 
      });
      return;
    }
    
    // Generar recomendaciones basadas en los contenedores seleccionados CON clientes asignados
    const recommendations = generateRecommendations(selectedWithClientes);
    
    if (recommendations.length === 0) {
      toast({ title: "No se encontraron combinaciones validas para los contenedores seleccionados", variant: "destructive" });
      return;
    }
    
    navigate("/armado-full-results", { state: { recommendations, containers: selectedWithClientes } });
  };

  const resetFilters = () => {
    setBlFilter("");
    setFilterCliente("Todos");
    setFilterDestino("Todos");
    setFilterPrioridad("Todos");
    setFilterPeso("Todos");
  };

  const hasActiveFilters = blFilter || filterCliente !== "Todos" || filterDestino !== "Todos" || filterPrioridad !== "Todos" || filterPeso !== "Todos";

  return (
    <div className="min-h-screen bg-[hsl(var(--hp-light-blue))]">
      {/* Header */}
      <div className="bg-[hsl(var(--hp-navy))] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/tas")} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Volver</span>
            </button>
            <div className="h-6 w-px bg-white/30" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--hp-sky))] rounded-lg flex items-center justify-center">
                <Package size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Armado de Full</h1>
                <p className="text-xs text-white/70">Sistema de optimizacion de carga</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right mr-4">
              <p className="text-xs text-white/70">Contenedores seleccionados</p>
              <p className="text-2xl font-bold text-[hsl(var(--hp-sky))]">{selectedCount}</p>
            </div>
            <button
              onClick={handleConsultar}
              disabled={selectedCount < 2}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                selectedCount >= 2
                  ? "bg-[hsl(var(--hp-sky))] text-white hover:bg-[hsl(var(--hp-sky))]/90 shadow-lg"
                  : "bg-white/20 text-white/50 cursor-not-allowed"
              }`}
            >
              Generar Recomendaciones
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-4">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-[hsl(var(--hp-navy))]/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-[hsl(var(--hp-navy))]" />
              <h3 className="font-semibold text-[hsl(var(--hp-navy))]">Filtros de Busqueda</h3>
            </div>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs text-[hsl(var(--hp-sky))] hover:underline flex items-center gap-1">
                <RotateCcw size={12} />
                Limpiar filtros
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Busqueda */}
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-600 mb-1 block">Buscar</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="BL o Contenedor..."
                  value={blFilter}
                  onChange={(e) => setBlFilter(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-[hsl(var(--hp-sky))] focus:ring-1 focus:ring-[hsl(var(--hp-sky))] outline-none transition-colors"
                />
              </div>
            </div>
            
            {/* Cliente */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Cliente</label>
              <select
                value={filterCliente}
                onChange={(e) => setFilterCliente(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[hsl(var(--hp-sky))] focus:ring-1 focus:ring-[hsl(var(--hp-sky))] outline-none transition-colors"
              >
                <option>Todos</option>
                <option value="Sin asignar">Sin asignar</option>
                {uniqueClientes.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            
            {/* Destino */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Destino</label>
              <select
                value={filterDestino}
                onChange={(e) => setFilterDestino(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[hsl(var(--hp-sky))] focus:ring-1 focus:ring-[hsl(var(--hp-sky))] outline-none transition-colors"
              >
                <option>Todos</option>
                {uniqueDestinos.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            
            {/* Prioridad */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Prioridad</label>
              <select
                value={filterPrioridad}
                onChange={(e) => setFilterPrioridad(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[hsl(var(--hp-sky))] focus:ring-1 focus:ring-[hsl(var(--hp-sky))] outline-none transition-colors"
              >
                <option>Todos</option>
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
              </select>
            </div>
            
            {/* Peso */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Rango de Peso</label>
              <select
                value={filterPeso}
                onChange={(e) => setFilterPeso(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[hsl(var(--hp-sky))] focus:ring-1 focus:ring-[hsl(var(--hp-sky))] outline-none transition-colors"
              >
                <option>Todos</option>
                <option value="Ligero">Ligero (&lt;20t)</option>
                <option value="Medio">Medio (20-23t)</option>
                <option value="Pesado">Pesado (&gt;23t)</option>
              </select>
            </div>
          </div>
        </div>

        {/* CSV Upload */}
        <div className="bg-white rounded-xl shadow-sm border border-[hsl(var(--hp-navy))]/10 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-[hsl(var(--hp-sky))]/10 rounded-lg flex items-center justify-center">
              <FileSpreadsheet size={16} className="text-[hsl(var(--hp-sky))]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[hsl(var(--hp-navy))]">Importar Clientes desde CSV</h3>
              <p className="text-xs text-gray-500">Formato: ID Contenedor, Nombre Cliente</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleCsvUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[hsl(var(--hp-navy))] text-white text-xs px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-[hsl(var(--hp-navy))]/90 transition-colors"
            >
              <Upload size={14} /> Cargar CSV
            </button>
            <button
              onClick={loadExampleCsv}
              className="border border-[hsl(var(--hp-navy))] text-[hsl(var(--hp-navy))] text-xs px-4 py-2 rounded-lg hover:bg-[hsl(var(--hp-navy))]/5 transition-colors"
            >
              Usar datos de ejemplo
            </button>
          </div>
        </div>

        {/* Tabla de contenedores */}
        <div className="bg-white rounded-xl shadow-sm border border-[hsl(var(--hp-navy))]/10 overflow-hidden">
          <div className="bg-[hsl(var(--hp-navy))]/5 px-5 py-3 border-b border-[hsl(var(--hp-navy))]/10">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[hsl(var(--hp-navy))]">
                Contenedores Disponibles
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({displayContainers.length} de {containers.length})
                </span>
              </h3>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-[hsl(var(--hp-sky))] focus:ring-[hsl(var(--hp-sky))]"
                />
                <span className="text-gray-600">{allSelected ? "Deseleccionar todos" : "Seleccionar todos"}</span>
              </label>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--hp-navy))] text-white">
                  <th className="px-4 py-3 text-left w-12"></th>
                  <th className="px-4 py-3 text-left font-semibold">Contenedor</th>
                  <th className="px-4 py-3 text-left font-semibold">BL</th>
                  <th className="px-4 py-3 text-left font-semibold">Cliente</th>
                  <th className="px-4 py-3 text-left font-semibold">Destino</th>
                  <th className="px-4 py-3 text-right font-semibold">Peso Bruto</th>
                  <th className="px-4 py-3 text-center font-semibold">Prioridad</th>
                </tr>
              </thead>
              <tbody>
                {displayContainers.map((c, idx) => (
                  <tr
                    key={c.id}
                    className={`border-b border-gray-100 hover:bg-[hsl(var(--hp-sky))]/5 transition-colors ${
                      c.selected ? "bg-[hsl(var(--hp-sky))]/10" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={c.selected}
                        onChange={() => {
                          setContainers((prev) =>
                            prev.map((x) => x.id === c.id ? { ...x, selected: !x.selected } : x)
                          );
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-[hsl(var(--hp-sky))] focus:ring-[hsl(var(--hp-sky))]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-[hsl(var(--hp-navy))]">{c.contenedor}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.bl}</td>
                    <td className="px-4 py-3">
                      {c.cliente && c.cliente.trim() !== "" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[hsl(var(--hp-sky))]/15 text-[hsl(var(--hp-navy))]">
                          {c.cliente}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 italic">
                          Sin asignar
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {c.destino}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">
                      {c.pesoBruto.toLocaleString()} kg
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        c.prioridad === "Alta" ? "bg-red-100 text-red-700" :
                        c.prioridad === "Media" ? "bg-amber-100 text-amber-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {c.prioridad}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {displayContainers.length === 0 && (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No se encontraron contenedores con los filtros aplicados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArmadoFull;
