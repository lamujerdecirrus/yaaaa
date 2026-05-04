import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { mockTariffs } from "@/data/mockData";
import { ArrowLeft, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TarifaScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { container, fullPair, selectedDate } = (location.state as any) || {};

  // Generar fechas basadas en la fecha actual
  const today = new Date();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const weekDates = Array.from({ length: 7 }, (_, i) => currentDay + i).filter(d => d <= 31);

  const initialContainerRows = fullPair
    ? [
        { id: fullPair.principal, estatus: "Full armado", iso: "40HC", linea: "FULL" },
        { id: fullPair.pair, estatus: "Full armado", iso: "40HC", linea: "FULL" },
      ]
    : container
      ? [{ id: container.containerId, estatus: container.estatus || "Liberado", iso: "22G1", linea: container.lineaNaviera || "MSC" }]
      : [{ id: "MSCU7234561", estatus: "Liberado", iso: "22G1", linea: "MSC" }];

  const [containerRows, setContainerRows] = useState(initialContainerRows);

  const handleRemoveContainer = (containerId: string) => {
    if (containerRows.length <= 1) {
      toast({ title: "No puedes eliminar", description: "Debe haber al menos un contenedor", variant: "destructive" });
      return;
    }
    setContainerRows(prev => prev.filter(c => c.id !== containerId));
    toast({ title: "Contenedor eliminado", description: `Se elimino ${containerId} de la cita` });
  };

  const handleSelectCita = (tariff: typeof mockTariffs[0]) => {
    // Pasar los contenedores actuales (despues de eliminar) en lugar de fullPair original
    navigate("/confirmacion-cita", {
      state: { 
        container, 
        fullPair: containerRows.length === 2 ? { principal: containerRows[0].id, pair: containerRows[1].id } : null,
        selectedContainers: containerRows,
        selectedDate, 
        tariff 
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="hp-header px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-white flex items-center gap-2 hover:text-white/80 transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Volver</span>
        </button>
        <span className="text-white font-semibold">Seleccion de Tarifa</span>
        <div className="w-20" />
      </div>

      <div className="p-6 flex-1">
        {/* Container info */}
        <div className="hp-card p-4 mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left py-2 font-medium">ID Contenedor</th>
                <th className="text-left py-2 font-medium">Estatus</th>
                <th className="text-left py-2 font-medium">ISO</th>
                <th className="text-left py-2 font-medium">Línea Naviera</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {containerRows.map((row, i) => (
                <tr key={i} className={i < containerRows.length - 1 ? "border-b border-border" : ""}>
                  <td className="py-3">{row.id}</td>
                  <td className="py-3">{row.estatus}</td>
                  <td className="py-3">{row.iso}</td>
                  <td className="py-3">{row.linea}</td>
                  <td>
                    <button 
                      onClick={() => handleRemoveContainer(row.id)}
                      className="hp-btn-outline text-xs px-3 py-1 rounded flex items-center gap-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                    >
                      <Trash2 size={12} />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Week selector */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <button className="text-hp-sky hover:text-hp-navy transition-colors"><ChevronLeft size={16} /></button>
          <span className="text-xs text-muted-foreground">{monthNames[currentMonth].substring(0, 3)} {weekDates[0]}</span>
          {weekDates.map((d, i) => (
            <button
              key={d}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                i === 0 ? "bg-hp-navy text-white" : "border border-hp-navy text-hp-navy"
              }`}
            >
              {monthNames[currentMonth].substring(0, 3)} {d < 10 ? `0${d}` : d}
            </button>
          ))}
          <button className="text-hp-sky hover:text-hp-navy transition-colors"><ChevronRight size={16} /></button>
        </div>

        <h3 className="text-sm font-semibold mb-4">Citas disponibles para fecha seleccionada (1)</h3>
        <p className="text-xs text-muted-foreground mb-4">{selectedDate || `${currentDay} ${monthNames[currentMonth].substring(0, 3).toLowerCase()} ${today.getFullYear()}`}</p>

        {/* Tariff cards */}
        <div className="grid grid-cols-3 gap-6">
          {mockTariffs.map((t) => (
            <div
              key={t.id}
              className={`hp-card p-5 flex flex-col ${
                t.highlight ? "ring-2 ring-hp-orange" : ""
              }`}
            >
              {t.highlight && (
                <div className="bg-hp-orange text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-2">
                  PREMIUM
                </div>
              )}
              {!t.highlight && (
                <h4 className="text-sm font-bold text-foreground mb-2">{t.name}</h4>
              )}

              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-2xl font-black text-foreground">${t.pricePerContainer}</span>
                <span className="text-xs text-muted-foreground">/ por contenedor</span>
              </div>

              {t.specialBadge && (
                <span className="text-xs bg-hp-sky/20 text-hp-sky font-semibold px-2 py-0.5 rounded-full self-start mb-3">
                  {t.specialBadge}
                </span>
              )}

              <div className="text-xs text-muted-foreground space-y-1 mb-4 flex-1">
                <p><strong>Cobro:</strong> {t.cobro}</p>
                <p><strong>Servicio Upgrade:</strong> {t.servicioUpgrade}</p>
                <p><strong>Cancelación:</strong> {t.cancelacion}</p>
                <div className="mt-2 pt-2 border-t border-border">
                  {t.notes.map((n, i) => (
                    <p key={i}>- {n}</p>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectCita(t)}
                className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
                  t.type === "BASICA"
                    ? "bg-hp-navy text-white"
                    : t.type === "FLEXIBLE"
                    ? "bg-hp-navy text-white"
                    : "hp-btn-outline"
                }`}
              >
                Seleccionar cita
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TarifaScreen;
