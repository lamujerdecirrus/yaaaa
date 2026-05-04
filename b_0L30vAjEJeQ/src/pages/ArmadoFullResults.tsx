import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FullRecommendation } from "@/data/mockData";
import { Star, Download, CalendarDays, ArrowLeft, Package, CheckCircle2, AlertCircle, MinusCircle, XCircle, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useApp } from "@/context/AppContext";

const ArmadoFullResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleFavorite, isFavorite, favoritePairs } = useApp();
  const initialRecs = ((location.state as { recommendations?: FullRecommendation[] })?.recommendations || []) as FullRecommendation[];

  const [viewMode, setViewMode] = useState<"optimized" | "detailed">("optimized");
  const [recommendations] = useState(initialRecs);
  const [filterCliente, setFilterCliente] = useState("Todos");

  const toggleStar = (principal: string, pair: string, type: string, cliente: string) => {
    toggleFavorite({ type, principal, pair, cliente });
  };

  const filteredRecs = filterCliente === "Todos"
    ? recommendations
    : recommendations.filter((r) => r.cliente === filterCliente);

  // Resultados optimizados sin duplicados (A↔B = B↔A)
  const optimizedRecs = useMemo(() => {
    const seen = new Set<string>();
    const result: { cliente: string; principal: string; pair: string; category: string; icon: React.ReactNode; bgColor: string; borderColor: string }[] = [];

    const categories = [
      { key: "ideal" as const, label: "Ideal", icon: <CheckCircle2 size={20} className="text-emerald-600" />, bgColor: "bg-emerald-50", borderColor: "border-emerald-200" },
      { key: "buena" as const, label: "Buena", icon: <AlertCircle size={20} className="text-blue-600" />, bgColor: "bg-blue-50", borderColor: "border-blue-200" },
      { key: "alternativa" as const, label: "Alternativa", icon: <MinusCircle size={20} className="text-amber-600" />, bgColor: "bg-amber-50", borderColor: "border-amber-200" },
      { key: "ultimaOpcion" as const, label: "Ultima Opcion", icon: <XCircle size={20} className="text-gray-500" />, bgColor: "bg-gray-50", borderColor: "border-gray-200" },
    ];

    for (const cat of categories) {
      for (const rec of filteredRecs) {
        for (const item of rec[cat.key]) {
          const pairKey = [rec.contenedorPrincipal, item.contenedor].sort().join("-");
          if (!seen.has(pairKey)) {
            seen.add(pairKey);
            result.push({
              cliente: rec.cliente,
              principal: rec.contenedorPrincipal,
              pair: item.contenedor,
              category: cat.label,
              icon: cat.icon,
              bgColor: cat.bgColor,
              borderColor: cat.borderColor,
            });
          }
        }
      }
    }
    return result;
  }, [filteredRecs]);

  const uniqueClientes = [...new Set(recommendations.map((r) => r.cliente))];

  const handleAgendarCita = (principal: string, pair: string) => {
    navigate("/nueva-cita", {
      state: {
        container: {
          id: `full-opt`,
          containerId: `${principal} + ${pair}`,
          lineaNaviera: "FULL",
          buque: "-",
          referencia: `FULL-${principal}`,
          estadoContenedor: "En terminal",
          programacion: new Date().toLocaleDateString("es-MX"),
          etapaDocumental: "Completa",
          estatus: "Full armado",
          type: "retiro",
        },
        fullPair: { principal, pair },
      },
    });
  };

  const handleDownload = () => {
    // Crear contenido CSV
    const csvContent = [
      "Cliente,Contenedor Principal,Contenedor Par,Tipo de Recomendacion",
      ...optimizedRecs.map(r => `"${r.cliente}","${r.principal}","${r.pair}","${r.category}"`)
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `armado-full-recomendaciones-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    
    toast({ title: "Archivo descargado correctamente" });
  };

  // Estadisticas
  const stats = {
    total: optimizedRecs.length,
    ideal: optimizedRecs.filter(r => r.category === "Ideal").length,
    buena: optimizedRecs.filter(r => r.category === "Buena").length,
    alternativa: optimizedRecs.filter(r => r.category === "Alternativa").length,
    ultima: optimizedRecs.filter(r => r.category === "Ultima Opcion").length,
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--hp-light-blue))]">
      {/* Header */}
      <div className="bg-[hsl(var(--hp-navy))] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/armado-full")} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Volver</span>
            </button>
            <div className="h-6 w-px bg-white/30" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--hp-sky))] rounded-lg flex items-center justify-center">
                <Package size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Recomendaciones de Armado</h1>
                <p className="text-xs text-white/70">{stats.total} combinaciones encontradas</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <Download size={16} /> Exportar CSV
            </button>
            {favoritePairs.length > 0 && (
              <button
                onClick={() => navigate("/tas")}
                className="bg-[hsl(var(--hp-orange))] hover:bg-[hsl(var(--hp-orange))]/90 text-white text-sm px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Star size={16} className="fill-white" /> Ver Favoritos ({favoritePairs.length})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-4">
        {/* Estadisticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[hsl(var(--hp-navy))]/10">
            <p className="text-xs text-gray-500 font-medium">Total Combinaciones</p>
            <p className="text-2xl font-bold text-[hsl(var(--hp-navy))]">{stats.total}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 shadow-sm border border-emerald-200">
            <p className="text-xs text-emerald-600 font-medium">Ideales</p>
            <p className="text-2xl font-bold text-emerald-700">{stats.ideal}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">Buenas</p>
            <p className="text-2xl font-bold text-blue-700">{stats.buena}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 shadow-sm border border-amber-200">
            <p className="text-xs text-amber-600 font-medium">Alternativas</p>
            <p className="text-2xl font-bold text-amber-700">{stats.alternativa}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500 font-medium">Ultima Opcion</p>
            <p className="text-2xl font-bold text-gray-600">{stats.ultima}</p>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-xl shadow-sm border border-[hsl(var(--hp-navy))]/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <label className="text-sm text-gray-600">Cliente:</label>
                <select
                  value={filterCliente}
                  onChange={(e) => setFilterCliente(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-[hsl(var(--hp-sky))] focus:ring-1 focus:ring-[hsl(var(--hp-sky))] outline-none"
                >
                  <option>Todos</option>
                  {uniqueClientes.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("optimized")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === "optimized" ? "bg-[hsl(var(--hp-navy))] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Vista Optimizada
              </button>
              <button
                onClick={() => setViewMode("detailed")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === "detailed" ? "bg-[hsl(var(--hp-navy))] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Vista Detallada
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {viewMode === "optimized" ? (
          <div className="space-y-3">
            {optimizedRecs.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-[hsl(var(--hp-navy))]/10">
                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No se encontraron combinaciones para el cliente seleccionado</p>
              </div>
            ) : (
              optimizedRecs.map((item, i) => (
                <div
                  key={i}
                  className={`${item.bgColor} ${item.borderColor} border rounded-xl p-4 flex items-center justify-between transition-all hover:shadow-md`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500 bg-white/80 px-2 py-0.5 rounded">{item.category}</span>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="text-xs font-medium text-[hsl(var(--hp-navy))]">{item.cliente}</span>
                      </div>
                      <p className="font-mono font-semibold text-[hsl(var(--hp-navy))]">
                        {item.principal} <span className="text-gray-400 mx-2">+</span> {item.pair}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStar(item.principal, item.pair, item.category, item.cliente)}
                      className={`p-2 rounded-lg transition-colors ${
                        isFavorite(item.principal, item.pair)
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-white/80 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                      }`}
                      title="Agregar a favoritos"
                    >
                      <Star size={18} className={isFavorite(item.principal, item.pair) ? "fill-yellow-500" : ""} />
                    </button>
                    <button
                      onClick={() => handleAgendarCita(item.principal, item.pair)}
                      className="bg-[hsl(var(--hp-navy))] hover:bg-[hsl(var(--hp-navy))]/90 text-white text-sm px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
                    >
                      <CalendarDays size={16} /> Agendar Cita
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Vista detallada por cliente */
          <div className="bg-white rounded-xl shadow-sm border border-[hsl(var(--hp-navy))]/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[hsl(var(--hp-navy))] text-white">
                    <th className="px-4 py-3 text-left font-semibold">Cliente</th>
                    <th className="px-4 py-3 text-left font-semibold">Contenedor Principal</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 size={14} /> Ideal
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <AlertCircle size={14} /> Buena
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <MinusCircle size={14} /> Alternativa
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <XCircle size={14} /> Ultima Opcion
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecs.map((rec, i) => (
                    <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[hsl(var(--hp-sky))]/15 text-[hsl(var(--hp-navy))]">
                          {rec.cliente}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-[hsl(var(--hp-navy))]">{rec.contenedorPrincipal}</td>
                      {[rec.ideal, rec.buena, rec.alternativa, rec.ultimaOpcion].map((items, ci) => (
                        <td key={ci} className="px-4 py-3">
                          {items.length > 0 ? (
                            <div className="space-y-1">
                              {items.map((r, j) => (
                                <div key={j} className="flex items-center gap-2">
                                  <button
                                    onClick={() => toggleStar(rec.contenedorPrincipal, r.contenedor, ["Ideal", "Buena", "Alternativa", "Ultima Opcion"][ci], rec.cliente)}
                                    className="flex-shrink-0"
                                  >
                                    <Star size={14} className={isFavorite(rec.contenedorPrincipal, r.contenedor) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
                                  </button>
                                  <span className="font-mono text-xs">{r.contenedor}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Leyenda */}
        <div className="bg-white rounded-xl shadow-sm border border-[hsl(var(--hp-navy))]/10 p-4">
          <h4 className="text-sm font-semibold text-[hsl(var(--hp-navy))] mb-3">Criterios de Clasificacion</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-emerald-700">Ideal</p>
                <p className="text-gray-500">Mismo BL, mismo destino, peso combinado &le;42t</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-700">Buena</p>
                <p className="text-gray-500">Mismo destino, peso combinado &le;42t</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MinusCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-700">Alternativa</p>
                <p className="text-gray-500">Mismo destino, peso combinado &le;44t</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <XCircle size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-600">Ultima Opcion</p>
                <p className="text-gray-500">Diferente destino, peso combinado &le;44t</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArmadoFullResults;
