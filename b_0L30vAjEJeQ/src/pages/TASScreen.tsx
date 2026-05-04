import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { mockContainers, Container } from "@/data/mockData";
import { Menu, Grid3X3, Search, Filter, CalendarDays, Plus, Star, Trash2, LayoutGrid, List, Eye, Check, ArrowLeft, Package, Layers, ChevronRight } from "lucide-react";
import ContainerDetailModal from "@/components/ContainerDetailModal";

type TabType = "todas" | "deposito" | "retiro" | "favoritos";
type ViewMode = "table" | "kanban";

const KANBAN_STATES = ["En terminal", "En transito", "En patio", "En proceso", "Completos"];

const stateBadgeClass = (estado: string) => {
  switch (estado) {
    case "En terminal": return "bg-blue-100 text-blue-700";
    case "En transito": return "bg-amber-100 text-amber-700";
    case "En patio": return "bg-violet-100 text-violet-700";
    case "En proceso": return "bg-pink-100 text-pink-700";
    case "Completos":
    case "Completa": return "bg-green-100 text-green-700";
    default: return "bg-muted text-foreground";
  }
};

const TASScreen = () => {
  const navigate = useNavigate();
  const { user, favoritePairs, setFavoritePairs, clientesByContainer, setClienteForContainer } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>("retiro");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [detailContainer, setDetailContainer] = useState<Container | null>(null);
  const [editingClienteId, setEditingClienteId] = useState<string | null>(null);
  const [clienteDraft, setClienteDraft] = useState("");

  const [filterLineaNaviera, setFilterLineaNaviera] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterEtapa, setFilterEtapa] = useState("");
  const [filterCliente, setFilterCliente] = useState("");

  // Containers with applied client overrides
  const containersWithClient = useMemo(
    () => mockContainers.map((c) => ({ ...c, cliente: clientesByContainer[c.containerId] ?? c.cliente })),
    [clientesByContainer]
  );

  const filteredContainers = containersWithClient
    .filter((c) => {
      if (activeTab === "deposito") return c.type === "deposito";
      if (activeTab === "retiro") return c.type === "retiro";
      return true;
    })
    .filter((c) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.containerId.toLowerCase().includes(q) ||
        c.referencia.toLowerCase().includes(q) ||
        c.cliente.toLowerCase().includes(q) ||
        c.lineaNaviera.toLowerCase().includes(q) ||
        c.buque.toLowerCase().includes(q)
      );
    })
    .filter((c) => !filterLineaNaviera || c.lineaNaviera === filterLineaNaviera)
    .filter((c) => !filterEstado || c.estadoContenedor === filterEstado)
    .filter((c) => !filterEtapa || c.etapaDocumental === filterEtapa)
    .filter((c) => !filterCliente || (filterCliente === "Sin asignar" && !c.cliente) || c.cliente === filterCliente);

  const uniqueLineas = [...new Set(containersWithClient.map((c) => c.lineaNaviera))];
  const uniqueEstados = [...new Set(containersWithClient.map((c) => c.estadoContenedor))];
  const uniqueEtapas = [...new Set(containersWithClient.map((c) => c.etapaDocumental))];
  const uniqueClientes = [...new Set(containersWithClient.map((c) => c.cliente).filter(Boolean))];
  const hasFilters = filterLineaNaviera || filterEstado || filterEtapa || filterCliente;



  const tabs: { key: TabType; label: string; icon?: React.ReactNode }[] = [
    { key: "todas", label: "Todas" },
    { key: "deposito", label: "Deposito" },
    { key: "retiro", label: "Retiro" },
    { key: "favoritos", label: "Favoritos", icon: <Star size={14} className="fill-yellow-500 text-yellow-500" /> },
  ];

  // Contador de contenedores disponibles para armado full (tipo retiro con etapa completa)
  const containersAvailableForFull = containersWithClient.filter(
    (c) => c.type === "retiro" && c.etapaDocumental === "Completa" && c.estadoContenedor === "En terminal"
  ).length;

  const startEditCliente = (c: Container) => {
    setEditingClienteId(c.containerId);
    setClienteDraft(c.cliente || "");
  };
  const saveCliente = () => {
    if (editingClienteId) setClienteForContainer(editingClienteId, clienteDraft.trim());
    setEditingClienteId(null);
  };

  const clearFilters = () => {
    setFilterLineaNaviera("");
    setFilterEstado("");
    setFilterEtapa("");
    setFilterCliente("");
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--hp-light-blue))]">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-[hsl(var(--hp-navy))] text-white flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-[hsl(var(--hp-navy))] text-xs font-bold">HP</span>
                </div>
                <span className="font-bold text-sm">HUTCHISON PORTS</span>
              </div>
            </div>
            <nav className="flex-1 p-4">
              <button onClick={() => setSidebarOpen(false)} className="w-full text-left px-4 py-3 rounded-lg bg-white/10 font-semibold flex items-center gap-3">
                <Grid3X3 size={18} /> TAS
              </button>
            </nav>
          </div>
          <div className="flex-1 bg-black/30" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Header - Estilo consistente con ArmadoFull */}
      <div className="bg-[hsl(var(--hp-navy))] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="text-white hover:text-white/80 transition-colors">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--hp-sky))] rounded-lg flex items-center justify-center">
                <Package size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Lista de Contenedores</h1>
                <p className="text-xs text-white/70">Sistema TAS - Gestion de Contenedores</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="border border-white/30 bg-white/10 rounded-lg px-4 py-2 text-white font-semibold text-sm hover:bg-white/20 transition-colors">
              Pre-alta de informacion
            </button>
            <div className="text-white text-sm">
              Hola, <span className="font-bold">{user?.name || "USUARIO"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats cards - Clasificados por Estado y Etapa */}
        <div className="space-y-4">
          {/* Estado del Contenedor */}
          <div className="bg-white rounded-xl p-4 border border-[hsl(var(--hp-navy))]/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--hp-sky))]"></div>
              <h3 className="text-sm font-semibold text-[hsl(var(--hp-navy))]">Estado del Contenedor</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Total</p>
                <p className="text-2xl font-bold text-gray-700">{containersWithClient.length}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                <p className="text-xs text-gray-500 font-medium">En terminal</p>
                <p className="text-2xl font-bold text-blue-700">{containersWithClient.filter((c) => c.estadoContenedor === "En terminal").length}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-100">
                <p className="text-xs text-gray-500 font-medium">En transito</p>
                <p className="text-2xl font-bold text-amber-700">{containersWithClient.filter((c) => c.estadoContenedor === "En transito").length}</p>
              </div>
              <div className="bg-violet-50 rounded-lg p-3 text-center border border-violet-100">
                <p className="text-xs text-gray-500 font-medium">En patio</p>
                <p className="text-2xl font-bold text-violet-700">{containersWithClient.filter((c) => c.estadoContenedor === "En patio").length}</p>
              </div>
            </div>
          </div>

          {/* Etapa Documental */}
          <div className="bg-white rounded-xl p-4 border border-[hsl(var(--hp-navy))]/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--hp-orange))]"></div>
              <h3 className="text-sm font-semibold text-[hsl(var(--hp-navy))]">Etapa Documental</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-pink-50 rounded-lg p-3 text-center border border-pink-100">
                <p className="text-xs text-gray-500 font-medium">En proceso</p>
                <p className="text-2xl font-bold text-pink-700">{containersWithClient.filter((c) => c.etapaDocumental === "En proceso").length}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-100">
                <p className="text-xs text-gray-500 font-medium">Pendiente</p>
                <p className="text-2xl font-bold text-orange-700">{containersWithClient.filter((c) => c.etapaDocumental === "Pendiente").length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                <p className="text-xs text-gray-500 font-medium">Completa</p>
                <p className="text-2xl font-bold text-green-700">{containersWithClient.filter((c) => c.etapaDocumental === "Completa").length}</p>
              </div>
            </div>
          </div>

          {/* Sugerencia de Armado Full - Solo se muestra si hay contenedores disponibles */}
          {containersAvailableForFull >= 2 && (
            <button
              onClick={() => navigate("/armado-full")}
              className="w-full bg-gradient-to-r from-[hsl(var(--hp-sky))] to-[hsl(var(--hp-navy))] rounded-xl p-4 hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Layers size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Optimiza tus envios con Armado Full</h3>
                    <p className="text-xs text-white/80">
                      Tienes <span className="font-bold text-white">{containersAvailableForFull} contenedores</span> listos para combinar y ahorrar en costos de transporte
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/90 group-hover:text-white">
                  <span className="text-sm font-medium">Ver opciones</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Filtros y busqueda */}
        <div className="bg-white rounded-xl shadow-sm border border-[hsl(var(--hp-navy))]/10 p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Busqueda */}
            <div className="relative flex-1 min-w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por ID, referencia, cliente, naviera o buque..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-[hsl(var(--hp-sky))] focus:ring-1 focus:ring-[hsl(var(--hp-sky))] outline-none transition-colors"
              />
            </div>

            {/* Boton de filtros */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 text-sm border rounded-lg px-4 py-2 transition-colors ${
                  hasFilters 
                    ? "border-[hsl(var(--hp-sky))] bg-[hsl(var(--hp-sky))]/10 text-[hsl(var(--hp-navy))]" 
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <Filter size={16} /> 
                Filtros
                {hasFilters && (
                  <span className="bg-[hsl(var(--hp-sky))] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
              
              {filterOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-40 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-[hsl(var(--hp-navy))]">Filtros avanzados</span>
                    <button onClick={clearFilters} className="text-xs text-[hsl(var(--hp-sky))] hover:underline">
                      Limpiar todo
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Linea Naviera</label>
                      <select 
                        value={filterLineaNaviera} 
                        onChange={(e) => setFilterLineaNaviera(e.target.value)} 
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[hsl(var(--hp-sky))] focus:ring-1 focus:ring-[hsl(var(--hp-sky))] outline-none"
                      >
                        <option value="">Todas</option>
                        {uniqueLineas.map((l) => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Estado</label>
                      <select 
                        value={filterEstado} 
                        onChange={(e) => setFilterEstado(e.target.value)} 
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[hsl(var(--hp-sky))] focus:ring-1 focus:ring-[hsl(var(--hp-sky))] outline-none"
                      >
                        <option value="">Todos</option>
                        {uniqueEstados.map((e) => <option key={e}>{e}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Etapa Documental</label>
                      <select 
                        value={filterEtapa} 
                        onChange={(e) => setFilterEtapa(e.target.value)} 
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[hsl(var(--hp-sky))] focus:ring-1 focus:ring-[hsl(var(--hp-sky))] outline-none"
                      >
                        <option value="">Todas</option>
                        {uniqueEtapas.map((e) => <option key={e}>{e}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Cliente</label>
                      <select 
                        value={filterCliente} 
                        onChange={(e) => setFilterCliente(e.target.value)} 
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[hsl(var(--hp-sky))] focus:ring-1 focus:ring-[hsl(var(--hp-sky))] outline-none"
                      >
                        <option value="">Todos</option>
                        <option value="Sin asignar">Sin asignar</option>
                        {uniqueClientes.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFilterOpen(false)} 
                    className="mt-4 w-full bg-[hsl(var(--hp-navy))] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[hsl(var(--hp-navy))]/90 transition-colors"
                  >
                    Aplicar filtros
                  </button>
                </div>
              )}
            </div>

            {/* Vista y acciones */}
            <button
              onClick={() => setViewMode(viewMode === "table" ? "kanban" : "table")}
              className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:border-gray-300 transition-colors"
            >
              {viewMode === "table" ? <><LayoutGrid size={16} /> Kanban</> : <><List size={16} /> Tabla</>}
            </button>
            
            {/* Boton Armado Full destacado */}
            <button 
              onClick={() => navigate("/armado-full")} 
              className="flex items-center gap-2 bg-gradient-to-r from-[hsl(var(--hp-sky))] to-[hsl(var(--hp-navy))] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-md"
            >
              <Layers size={16} /> 
              <span>Armado Full</span>
              {containersAvailableForFull > 0 && (
                <span className="bg-white/20 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                  {containersAvailableForFull}
                </span>
              )}
              <ChevronRight size={14} className="ml-1" />
            </button>
            
            <button 
              onClick={() => navigate("/agregar-contenedor")} 
              className="flex items-center gap-2 bg-[hsl(var(--hp-navy))] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[hsl(var(--hp-navy))]/90 transition-colors"
            >
              <Plus size={16} /> Agregar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                activeTab === t.key 
                  ? "bg-[hsl(var(--hp-navy))] text-white" 
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[hsl(var(--hp-sky))]"
              }`}
            >
              {t.icon}
              {t.label}
              {t.key === "favoritos" && favoritePairs.length > 0 && (
                <span className="bg-[hsl(var(--hp-orange))] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritePairs.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenido segun tab */}
        {activeTab === "favoritos" ? (
          <div className="bg-white rounded-xl shadow-sm border border-[hsl(var(--hp-navy))]/10 overflow-hidden">
            {favoritePairs.length === 0 ? (
              <div className="p-12 text-center">
                <Star size={48} className="mx-auto mb-4 text-gray-200" />
                <h3 className="font-semibold text-lg text-gray-600 mb-2">Sin favoritos</h3>
                <p className="text-sm text-gray-500">Ve al apartado de Armado de Full, consulta las recomendaciones y marca parejas con estrella para agregarlas aqui.</p>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-[hsl(var(--hp-navy))]">Parejas de Fulles Favoritas</h3>
                  <p className="text-xs text-gray-500 mt-1">Estas parejas estan listas para agendar cita de ambos contenedores.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[hsl(var(--hp-navy))]/5 border-b border-gray-100">
                        <th className="px-4 py-3 text-left font-semibold text-[hsl(var(--hp-navy))]">Tipo</th>
                        <th className="px-4 py-3 text-left font-semibold text-[hsl(var(--hp-navy))]">Contenedor Principal</th>
                        <th className="px-4 py-3 text-left font-semibold text-[hsl(var(--hp-navy))]">Contenedor Par</th>
                        <th className="px-4 py-3 text-left font-semibold text-[hsl(var(--hp-navy))]">Cliente</th>
                        <th className="px-4 py-3 text-center font-semibold text-[hsl(var(--hp-navy))]">Agendar Cita</th>
                        <th className="px-4 py-3 text-center font-semibold text-[hsl(var(--hp-navy))]">Eliminar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {favoritePairs.map((p, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="text-xs bg-[hsl(var(--hp-sky))]/15 text-[hsl(var(--hp-navy))] px-2.5 py-1 rounded-full font-medium">{p.type}</span>
                          </td>
                          <td className="px-4 py-3 font-medium text-[hsl(var(--hp-navy))]">{p.principal}</td>
                          <td className="px-4 py-3 font-medium text-[hsl(var(--hp-navy))]">{p.pair}</td>
                          <td className="px-4 py-3 text-gray-600">{p.cliente || <span className="text-gray-400 italic">Sin asignar</span>}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                navigate("/nueva-cita", {
                                  state: {
                                    container: {
                                      id: `full-${i}`,
                                      containerId: `${p.principal} + ${p.pair}`,
                                      lineaNaviera: "FULL",
                                      buque: "-",
                                      referencia: `FULL-${p.principal}`,
                                      estadoContenedor: "En terminal",
                                      programacion: new Date().toLocaleDateString("es-MX"),
                                      etapaDocumental: "Completa",
                                      estatus: "Full armado",
                                      type: "retiro",
                                    },
                                    fullPair: { principal: p.principal, pair: p.pair },
                                  },
                                });
                              }}
                              className="inline-flex items-center gap-1.5 bg-[hsl(var(--hp-sky))] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[hsl(var(--hp-sky))]/90 transition-colors"
                            >
                              <CalendarDays size={14} /> Agendar Cita
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button 
                              onClick={() => setFavoritePairs((prev) => prev.filter((_, j) => j !== i))} 
                              className="text-red-500 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        ) : viewMode === "kanban" ? (
          /* KANBAN VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {KANBAN_STATES.map((state) => {
              const items = filteredContainers.filter((c) =>
                state === "Completos" ? c.etapaDocumental === "Completa" :
                state === "En proceso" ? c.etapaDocumental === "En proceso" :
                c.estadoContenedor === state
              );
              return (
                <div key={state} className="bg-white rounded-xl shadow-sm border border-[hsl(var(--hp-navy))]/10 overflow-hidden flex flex-col">
                  <div className={`px-4 py-3 font-semibold text-sm flex items-center justify-between ${stateBadgeClass(state)}`}>
                    <span>{state}</span>
                    <span className="bg-white/70 rounded-full px-2 py-0.5 text-xs">{items.length}</span>
                  </div>
                  <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto flex-1">
                    {items.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setDetailContainer(c)}
                        className="w-full text-left bg-gray-50 border border-gray-100 rounded-lg p-3 hover:border-[hsl(var(--hp-sky))] hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <p className="font-semibold text-sm text-[hsl(var(--hp-navy))]">{c.containerId}</p>
                          {c.type === "retiro" && c.etapaDocumental === "Completa" && c.estadoContenedor === "En terminal" && (
                            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-medium px-1.5 py-0.5 rounded" title="Disponible para Full">
                              Full
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{c.buque}</p>
                        <p className="text-xs text-gray-400">{c.programacion}</p>
                        {c.cliente && <p className="text-xs text-[hsl(var(--hp-sky))] mt-1 font-medium truncate">{c.cliente}</p>}
                      </button>
                    ))}
                    {items.length === 0 && <p className="text-xs text-gray-400 text-center py-4">Sin contenedores</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW */
          <>
            <div className="bg-white rounded-xl shadow-sm border border-[hsl(var(--hp-navy))]/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[hsl(var(--hp-navy))]/5 border-b border-gray-100">
                      <th className="px-4 py-3 text-left w-10"></th>
                      <th className="px-4 py-3 text-left font-semibold text-[hsl(var(--hp-navy))]">ID Contenedor</th>
                      <th className="px-4 py-3 text-left font-semibold text-[hsl(var(--hp-navy))]">Linea Naviera</th>
                      <th className="px-4 py-3 text-left font-semibold text-[hsl(var(--hp-navy))]">Buque</th>
                      <th className="px-4 py-3 text-left font-semibold text-[hsl(var(--hp-navy))]">Referencia</th>
                      <th className="px-4 py-3 text-left font-semibold text-[hsl(var(--hp-navy))]">Estado</th>
                      <th className="px-4 py-3 text-left font-semibold text-[hsl(var(--hp-navy))]">Programacion</th>
                      <th className="px-4 py-3 text-left font-semibold text-[hsl(var(--hp-navy))]">Etapa</th>
                      <th className="px-4 py-3 text-left font-semibold text-[hsl(var(--hp-navy))]">Cliente</th>
                      <th className="px-4 py-3 text-left font-semibold text-[hsl(var(--hp-navy))]">Estatus</th>
                      <th className="px-4 py-3 text-center font-semibold text-[hsl(var(--hp-navy))] w-24">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContainers.map((c, i) => (
                      <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-white text-[10px] font-bold ${
                            c.type === "retiro" ? "bg-[hsl(var(--hp-orange))]" : "bg-[hsl(var(--hp-sky))]"
                          }`}>
                            {c.type === "retiro" ? "R" : "D"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-[hsl(var(--hp-navy))]">{c.containerId}</td>
                        <td className="px-4 py-3 text-gray-600">{c.lineaNaviera}</td>
                        <td className="px-4 py-3 text-gray-600">{c.buque}</td>
                        <td className="px-4 py-3 text-gray-600">{c.referencia}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${stateBadgeClass(c.estadoContenedor)}`}>
                            {c.estadoContenedor}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{c.programacion}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${stateBadgeClass(c.etapaDocumental)}`}>
                            {c.etapaDocumental}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {editingClienteId === c.containerId ? (
                            <div className="flex items-center gap-1">
                              <input
                                autoFocus
                                value={clienteDraft}
                                onChange={(e) => setClienteDraft(e.target.value)}
                                onBlur={saveCliente}
                                onKeyDown={(e) => { if (e.key === "Enter") saveCliente(); if (e.key === "Escape") setEditingClienteId(null); }}
                                placeholder="Nombre del cliente"
                                className="border border-gray-200 rounded-lg px-2 py-1 text-xs w-40 focus:border-[hsl(var(--hp-sky))] outline-none"
                              />
                              <button onMouseDown={(e) => e.preventDefault()} onClick={saveCliente} className="text-[hsl(var(--hp-sky))]">
                                <Check size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditCliente(c)}
                              className={`text-left rounded-lg px-2 py-1 text-xs hover:bg-[hsl(var(--hp-sky))]/10 transition-colors ${
                                c.cliente ? "text-gray-700" : "text-gray-400 italic"
                              }`}
                              title="Clic para editar"
                            >
                              {c.cliente || "+ Asignar cliente"}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{c.estatus}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setDetailContainer(c)}
                              className="text-[hsl(var(--hp-navy))] hover:text-[hsl(var(--hp-sky))] transition-colors p-1"
                              title="Ver detalle"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => navigate("/nueva-cita", { state: { container: c } })}
                              className="text-[hsl(var(--hp-sky))] hover:text-[hsl(var(--hp-navy))] transition-colors p-1"
                              title="Generar cita"
                            >
                              <CalendarDays size={16} />
                            </button>
                            {/* Indicador de elegibilidad para Armado Full */}
                            {c.type === "retiro" && c.etapaDocumental === "Completa" && c.estadoContenedor === "En terminal" && (
                              <button
                                onClick={() => navigate("/armado-full")}
                                className="text-emerald-500 hover:text-emerald-600 transition-colors p-1"
                                title="Disponible para Armado Full"
                              >
                                <Layers size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredContainers.length === 0 && (
                      <tr>
                        <td colSpan={11} className="text-center py-12 text-gray-500">
                          No se encontraron contenedores con los filtros aplicados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Mostrando {filteredContainers.length} de {containersWithClient.length} contenedores
            </p>
          </>
        )}
      </div>

      {detailContainer && (
        <ContainerDetailModal container={detailContainer} onClose={() => setDetailContainer(null)} />
      )}
    </div>
  );
};

export default TASScreen;
