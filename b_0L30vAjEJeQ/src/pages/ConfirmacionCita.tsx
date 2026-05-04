import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, ChevronDown, Edit } from "lucide-react";

const ConfirmacionCita = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();
  const { container, fullPair, selectedContainers, selectedDate, tariff } = (location.state as any) || {};
  const [ocularExpress, setOcularExpress] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [rfcTarifa, setRfcTarifa] = useState("");
  const [rfcCancelacion, setRfcCancelacion] = useState("");

  // Usar selectedContainers si viene de TarifaScreen (despues de posibles eliminaciones)
  const containerRows = selectedContainers 
    ? selectedContainers.map((c: any) => ({ id: c.id, estatus: c.estatus, etapa: "Completa", iso: c.iso, linea: c.linea }))
    : fullPair
      ? [
          { id: fullPair.principal, estatus: "Full armado", etapa: "Completa", iso: "40HC", linea: "FULL" },
          { id: fullPair.pair, estatus: "Full armado", etapa: "Completa", iso: "40HC", linea: "FULL" },
        ]
      : container
        ? [{ id: container.containerId, estatus: container.estatus || "Liberado", etapa: container.etapaDocumental || "Completa", iso: "22G1", linea: container.lineaNaviera || "MSC" }]
        : [{ id: "MSCU7234561", estatus: "Liberado", etapa: "Completa", iso: "22G1", linea: "MSC" }];

  const subtotal1 = tariff?.pricePerContainer || 500;
  const servicioUpgrade = 500;
  const costoTotal = subtotal1 * containerRows.length;

  const handleGenerarCita = () => {
    setShowReceipt(true);
  };

  // Generar folio unico al mostrar el recibo
  const [folio] = useState(() => `CIT-2025-${Math.floor(Math.random() * 9000 + 1000)}`);

  if (showReceipt) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="hp-card p-8 max-w-lg w-full text-center" id="printable-receipt">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Cita Confirmada</h2>
          <p className="text-muted-foreground mb-6">Tu cita de importacion ha sido generada exitosamente.</p>

          <div className="text-left space-y-3 border-t border-b border-border py-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fecha:</span>
              <span className="font-semibold">{selectedDate || "Abril 08, 2025"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tipo de programacion:</span>
              <span className="font-semibold">{tariff?.name || "PREMIUM"}</span>
            </div>
            {containerRows.map((row, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contenedor {i + 1}:</span>
                <span className="font-semibold">{row.id}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Costo total:</span>
              <span className="font-bold text-lg">${costoTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Folio:</span>
              <span className="font-semibold">{folio}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">RFC de Tarifa:</span>
              <span className="font-semibold">{rfcTarifa || "N/A"}</span>
            </div>
          </div>

          {/* Botones - ocultos en impresion */}
          <div className="flex gap-3 print:hidden">
            <button onClick={() => navigate("/tas")} className="flex-1 hp-btn-primary rounded">
              Volver a TAS
            </button>
            <button onClick={() => window.print()} className="flex-1 hp-btn-outline rounded">
              Imprimir comprobante
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="hp-header px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-white flex items-center gap-2 hover:text-white/80 transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Volver</span>
        </button>
        <span className="text-white font-semibold">Confirmacion de cita</span>
        <div className="text-white text-sm">Hola, <span className="font-bold">{user?.name}</span></div>
      </div>

      <div className="p-6 flex gap-8">
        {/* Left - appointment summary */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground mb-6">Confirmación de cita de importación</h1>

          <div className="hp-card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">{selectedDate || "04 abr 2025"}</p>
                <p className="text-sm mt-1">
                  Tipo de programación:{" "}
                  <span className="bg-hp-sky text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {tariff?.name || "Estándar"}
                  </span>
                </p>
              </div>
              <button 
                onClick={() => navigate("/nueva-cita", { state: { container, fullPair } })}
                className="hp-btn-outline text-xs px-4 py-1.5 rounded flex items-center gap-1 hover:bg-[hsl(var(--hp-sky))]/10 transition-colors"
              >
                <Edit size={14} />
                Editar detalles de la cita
              </button>
            </div>

            <h3 className="text-sm font-semibold mb-3">Número de contenedores ({containerRows.length})</h3>
            <table className="w-full text-sm mb-2">
              <thead>
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-2">ID Contenedor</th>
                  <th className="text-left py-2">Estatus</th>
                  <th className="text-left py-2">Etapa documental</th>
                  <th className="text-left py-2">ISO</th>
                  <th className="text-left py-2">Línea Naviera</th>
                  <th className="text-right py-2">Costo</th>
                </tr>
              </thead>
              <tbody>
                {containerRows.map((row, i) => (
                  <tr key={i} className={i < containerRows.length - 1 ? "border-b border-border" : ""}>
                    <td className="py-3">{row.id}</td>
                    <td className="py-3">{row.estatus}</td>
                    <td className="py-3">{row.etapa}</td>
                    <td className="py-3">{row.iso}</td>
                    <td className="py-3">{row.linea}</td>
                    <td className="py-3 text-right">
                      <div className="text-xs text-muted-foreground">$0 <span className="ml-2">Tarifa</span></div>
                      {i === 0 && (
                        <div className="text-xs text-muted-foreground">${servicioUpgrade} <span className="ml-2">Servicio Upgrade</span></div>
                      )}
                      <div className="font-bold">${subtotal1} <span className="ml-2 text-xs font-normal">Subtotal</span></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right - cost & actions */}
        <div className="w-80 space-y-4">
          <div className="hp-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Costo total</p>
                <p className="text-3xl font-black text-foreground">${costoTotal}</p>
              </div>
              <button onClick={handleGenerarCita} className="hp-btn-outline text-sm px-4 py-2 rounded">
                Generar cita
              </button>
            </div>

            <h3 className="font-semibold text-sm mb-3">Información adicional</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">RFC de la Tarifa</label>
                <div className="flex items-center border rounded px-3 py-2 mt-1">
                  <input className="flex-1 bg-transparent outline-none text-sm" value={rfcTarifa} onChange={e => setRfcTarifa(e.target.value)} />
                  <ChevronDown size={16} className="text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">RFC de Cancelación</label>
                <div className="flex items-center border rounded px-3 py-2 mt-1">
                  <input className="flex-1 bg-transparent outline-none text-sm" value={rfcCancelacion} onChange={e => setRfcCancelacion(e.target.value)} />
                  <ChevronDown size={16} className="text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">RFC de No Show</label>
                <div className="flex items-center justify-center py-4">
                  {/* Step indicator */}
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                        </div>
                        {s < 5 && <div className="w-6 h-0.5 bg-muted-foreground/20" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={ocularExpress}
                  onChange={(e) => setOcularExpress(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <span className="text-sm font-medium">Ocular express</span>
                  <span className="text-xs text-muted-foreground ml-2 bg-muted px-2 py-0.5 rounded">opcional</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Si se selecciona la opción de Previo Ocular Express, este se realizará únicamente sobre el contenedor que este disponible físicamente para su apertura, aunque se hayan seleccionado dos o más en el armado full.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionCita;
