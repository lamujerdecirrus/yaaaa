import { useState } from "react";
import { Container } from "@/data/mockData";
import { X, FileText, Download, Plus, Eye, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Tab = "resumen" | "documentos" | "eventos" | "historial" | "notas";

interface Props {
  container: Container & { cliente: string };
  onClose: () => void;
}

const ContainerDetailModal = ({ container, onClose }: Props) => {
  const [tab, setTab] = useState<Tab>("resumen");

  const tabs: { key: Tab; label: string }[] = [
    { key: "resumen", label: "Resumen" },
    { key: "documentos", label: "Documentos" },
    { key: "eventos", label: "Eventos" },
    { key: "historial", label: "Historial" },
    { key: "notas", label: "Notas" },
  ];

  const timeline = [
    { date: "08/04/2025 10:30", text: "Contenedor descargado del buque" },
    { date: "08/04/2025 12:15", text: "Enviado a terminal" },
    { date: "08/04/2025 14:20", text: "Documentación completa" },
    { date: "08/04/2025 16:45", text: container.estatus },
  ];

  const docs = [
    { name: `BL_${container.containerId}.pdf`, status: "Completo" },
    { name: `Invoice_${container.referencia}.pdf`, status: "Completo" },
    { name: `PackingList_${container.referencia}.pdf`, status: "Pendiente" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="hp-header px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-white text-xs font-bold ${container.type === "retiro" ? "bg-[hsl(var(--hp-orange))]" : "bg-[hsl(var(--hp-sky))]"}`}>
              {container.type === "retiro" ? "R" : "D"}
            </span>
            <h2 className="font-bold text-lg">{container.containerId}</h2>
          </div>
          <button onClick={onClose} className="text-white hover:opacity-80">
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border px-5 flex gap-1 bg-muted/40">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-[hsl(var(--hp-sky))] text-[hsl(var(--hp-navy))]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-auto p-5 flex-1">
          {tab === "resumen" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="hp-card p-4">
                <h3 className="font-semibold text-sm mb-3 text-[hsl(var(--hp-navy))]">Información general</h3>
                <dl className="space-y-2 text-sm">
                  {[
                    ["ID Contenedor", container.containerId],
                    ["Línea Naviera", container.lineaNaviera],
                    ["Buque", container.buque],
                    ["Referencia", container.referencia],
                    ["Estado", container.estadoContenedor],
                    ["Programación", container.programacion],
                    ["Cliente", container.cliente || "— Sin asignar —"],
                    ["Estatus", container.estatus],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-border/50 pb-1.5">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="hp-card p-4">
                <h3 className="font-semibold text-sm mb-3 text-[hsl(var(--hp-navy))]">Línea de tiempo</h3>
                <ol className="space-y-3">
                  {timeline.map((ev, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-[hsl(var(--hp-navy))]" />
                        {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border my-1" />}
                      </div>
                      <div className="pb-2">
                        <p className="text-xs text-muted-foreground">{ev.date}</p>
                        <p className="text-sm font-medium">{ev.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="hp-card p-4">
                <h3 className="font-semibold text-sm mb-3 text-[hsl(var(--hp-navy))]">Documentos</h3>
                <ul className="space-y-2">
                  {docs.map((d) => (
                    <li key={d.name} className="flex items-center justify-between text-sm border-b border-border/50 pb-2">
                      <span className="flex items-center gap-2">
                        <FileText size={14} className="text-muted-foreground" /> {d.name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${d.status === "Completo" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {d.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hp-card p-4">
                <h3 className="font-semibold text-sm mb-3 text-[hsl(var(--hp-navy))]">Acciones rapidas</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setTab("documentos")}
                    className="w-full hp-btn-outline text-sm py-2 flex items-center justify-center gap-2 hover:bg-[hsl(var(--hp-sky))]/10 transition-colors"
                  >
                    <Eye size={14} /> Ver documentos
                  </button>
                  <button 
                    onClick={() => {
                      setTab("notas");
                      toast({ title: "Notas", description: "Escribe una nota en el campo de texto" });
                    }}
                    className="w-full hp-btn-outline text-sm py-2 flex items-center justify-center gap-2 hover:bg-[hsl(var(--hp-sky))]/10 transition-colors"
                  >
                    <Plus size={14} /> Agregar nota
                  </button>
                  <button 
                    onClick={() => {
                      const reportContent = `REPORTE DE CONTENEDOR\n\nID: ${container.containerId}\nLinea Naviera: ${container.lineaNaviera}\nBuque: ${container.buque}\nReferencia: ${container.referencia}\nEstado: ${container.estadoContenedor}\nProgramacion: ${container.programacion}\nCliente: ${container.cliente || "Sin asignar"}\nEstatus: ${container.estatus}\n\nGenerado: ${new Date().toLocaleString()}`;
                      const blob = new Blob([reportContent], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `Reporte_${container.containerId}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast({ title: "Reporte descargado", description: `Reporte_${container.containerId}.txt` });
                    }}
                    className="w-full hp-btn-outline text-sm py-2 flex items-center justify-center gap-2 hover:bg-[hsl(var(--hp-sky))]/10 transition-colors"
                  >
                    <Download size={14} /> Descargar reporte
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "documentos" && (
            <ul className="space-y-2">
              {docs.map((d) => (
                <li key={d.name} className="hp-card p-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm"><FileText size={16} /> {d.name}</span>
                  <button 
                    onClick={() => {
                      const docContent = `Documento: ${d.name}\nContenedor: ${container.containerId}\nEstatus: ${d.status}\n\nEste es un documento de ejemplo generado para demostracion.\n\nGenerado: ${new Date().toLocaleString()}`;
                      const blob = new Blob([docContent], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = d.name.replace(".pdf", ".txt");
                      a.click();
                      URL.revokeObjectURL(url);
                      toast({ title: "Documento descargado", description: d.name });
                    }}
                    className="hp-btn-primary text-xs px-3 py-1.5 rounded inline-flex items-center gap-1 hover:opacity-90 transition-opacity"
                  >
                    <Download size={12} /> Descargar
                  </button>
                </li>
              ))}
            </ul>
          )}

          {tab === "eventos" && (
            <ol className="space-y-3">
              {timeline.map((ev, i) => (
                <li key={i} className="hp-card p-3">
                  <p className="text-xs text-muted-foreground">{ev.date}</p>
                  <p className="text-sm font-medium">{ev.text}</p>
                </li>
              ))}
            </ol>
          )}

          {tab === "historial" && (
            <p className="text-sm text-muted-foreground">Sin movimientos previos registrados.</p>
          )}

          {tab === "notas" && (
            <div className="space-y-3">
              <textarea
                placeholder="Escribe una nota..."
                className="w-full border rounded p-3 text-sm min-h-32 focus:border-[hsl(var(--hp-sky))] focus:ring-1 focus:ring-[hsl(var(--hp-sky))] outline-none"
              />
              <button 
                onClick={() => toast({ title: "Nota guardada", description: "Tu nota ha sido guardada exitosamente" })}
                className="hp-btn-primary text-sm px-4 py-2 rounded inline-flex items-center gap-2"
              >
                <Save size={14} /> Guardar nota
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContainerDetailModal;
