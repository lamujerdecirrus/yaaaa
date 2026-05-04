import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, FileText, X, Download, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Documentos mock para el contenedor
const containerDocs = [
  { name: "Bill of Lading (BL)", status: "Completo", type: "bl" },
  { name: "Pedimento Aduanal", status: "Completo", type: "pedimento" },
  { name: "Factura Comercial", status: "Completo", type: "factura" },
  { name: "Certificado de Origen", status: "Pendiente", type: "certificado" },
  { name: "Packing List", status: "Completo", type: "packing" },
];

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const dayNames = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Generar colores dinamicos basados en la fecha actual
const getDayColor = (day: number, month: number, year: number): string => {
  const today = new Date();
  const checkDate = new Date(year, month, day);
  
  // Dias pasados no estan disponibles
  if (checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    return "bg-gray-200 text-gray-400";
  }
  
  // Fines de semana tienen poca disponibilidad (naranja)
  const dayOfWeek = checkDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return "bg-hp-orange text-white";
  }
  
  // Dias normales estan disponibles (verde)
  return "bg-green-500 text-white";
};

const NuevaCita = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();
  const container = (location.state as any)?.container;
  const fullPair = (location.state as any)?.fullPair;

  // Usar fecha actual
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menu al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownloadDoc = (docName: string, containerId: string) => {
    const docContent = `Documento: ${docName}\nContenedor: ${containerId}\nFecha: ${new Date().toLocaleString()}\n\nEste es un documento de ejemplo generado para demostracion.`;
    const blob = new Blob([docContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docName.replace(/\s/g, "_")}_${containerId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Documento descargado", description: docName });
  };

  const totalDays = daysInMonth(currentYear, currentMonth);
  const firstDay = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
  
  // Generar fechas de la semana actual basadas en la fecha seleccionada
  const getWeekDates = () => {
    const baseDate = selectedDate || today.getDate();
    const startOfWeek = Math.max(1, baseDate - 3);
    const dates: number[] = [];
    for (let i = 0; i < 7; i++) {
      const day = startOfWeek + i;
      if (day <= totalDays) {
        dates.push(day);
      }
    }
    return dates;
  };
  const weekDates = getWeekDates();

  // Build container rows based on what was passed
  const containerRows = fullPair
    ? [
        { id: fullPair.principal, estatus: "Full armado", iso: "40HC", linea: "FULL" },
        { id: fullPair.pair, estatus: "Full armado", iso: "40HC", linea: "FULL" },
      ]
    : container
      ? [{ id: container.containerId, estatus: container.estatus || "Liberado", iso: "22G1", linea: container.lineaNaviera || "MSC" }]
      : [{ id: "MSCU7234561", estatus: "Liberado", iso: "22G1", linea: "MSC" }];

  const handleSearchCita = () => {
    const dateStr = `${monthNames[currentMonth]} ${selectedDate}, ${currentYear}`;
    navigate("/tarifa", { state: { container, fullPair, selectedDate: dateStr } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="hp-header px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white flex items-center gap-2 hover:text-white/80 transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Volver</span>
          </button>
          <div className="h-5 w-px bg-white/30" />
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setDocsModalOpen(true)}
            className="text-white/60 text-sm font-medium px-4 py-1 rounded hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <FileText size={16} />
            Documentacion
          </button>
          {/* Menu desplegable de Programacion Cita */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white text-sm font-semibold bg-white/20 px-4 py-1 rounded flex items-center gap-2 hover:bg-white/30 transition-colors"
            >
              Programacion Cita
              <ChevronDown size={16} className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => { setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Nueva Cita
                </button>
                <button
                  onClick={() => { setMenuOpen(false); navigate("/tas"); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Ir a TAS
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="text-white text-sm">Hola, <span className="font-bold">{user?.name}</span></div>
      </div>

      <div className="p-6 flex gap-8 flex-1">
        {/* Left side */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground mb-6">Nueva cita de importación</h1>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-semibold">Número de contenedores ({containerRows.length})</span>
          </div>

          <div className="hp-card p-4 mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="text-left py-2 font-medium">ID Contenedor</th>
                  <th className="text-left py-2 font-medium">Estatus</th>
                  <th className="text-left py-2 font-medium">ISO</th>
                  <th className="text-left py-2 font-medium">Línea Naviera</th>
                </tr>
              </thead>
              <tbody>
                {containerRows.map((row, i) => (
                  <tr key={i} className={i < containerRows.length - 1 ? "border-b border-border" : ""}>
                    <td className="py-3 font-medium">{row.id}</td>
                    <td className="py-3">{row.estatus}</td>
                    <td className="py-3">{row.iso}</td>
                    <td className="py-3">{row.linea}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Week selector */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <button 
              onClick={() => setSelectedDate(Math.max(1, (selectedDate || today.getDate()) - 7))}
              className="text-hp-sky hover:text-hp-navy transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-muted-foreground">{monthNames[currentMonth].substring(0, 3)} {weekDates[0] || 1}</span>
            {weekDates.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  selectedDate === d ? "bg-hp-navy text-white" : "border border-hp-navy text-hp-navy"
                }`}
              >
                {monthNames[currentMonth].substring(0, 3)} {d < 10 ? `0${d}` : d}
              </button>
            ))}
            <button 
              onClick={() => setSelectedDate(Math.min(totalDays, (selectedDate || today.getDate()) + 7))}
              className="text-hp-sky hover:text-hp-navy transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <span className="text-xs text-muted-foreground">{monthNames[currentMonth].substring(0, 3)} {Math.min(totalDays, (weekDates[weekDates.length - 1] || 1) + 7)}</span>
          </div>

          <h3 className="text-sm font-semibold mb-2">Citas disponibles para fecha seleccionada (0)</h3>
          <p className="text-muted-foreground text-sm">No hay citas disponibles</p>
        </div>

        {/* Right side - Calendar */}
        <div className="w-80">
          <h3 className="text-sm font-semibold mb-3">Elegir fecha de retiro</h3>
          <div className="hp-card p-4">
            <div className="flex items-center justify-between mb-3">
              <button><ChevronLeft size={18} className="text-muted-foreground" /></button>
              <span className="font-semibold text-sm">{monthNames[currentMonth]} {currentYear}</span>
              <button><ChevronRight size={18} className="text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {dayNames.map((d) => (
                <div key={d} className="font-semibold text-muted-foreground py-1">{d}</div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} className="py-1.5"></div>
              ))}
              {Array.from({ length: totalDays }).map((_, i) => {
                const day = i + 1;
                const color = getDayColor(day, currentMonth, currentYear);
                const isSelected = selectedDate === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`py-1.5 rounded text-xs font-semibold transition-colors ${color} ${
                      isSelected ? "ring-2 ring-hp-navy ring-offset-1" : ""
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
          <button onClick={handleSearchCita} className="w-full mt-4 hp-btn-outline text-sm py-2 rounded">
            Iniciar Busqueda de cita
          </button>
        </div>
      </div>

      {/* Modal de Documentacion */}
      {docsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="bg-[hsl(var(--hp-navy))] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">Documentacion del Contenedor</h2>
                <p className="text-sm text-white/70">{containerRows[0]?.id || "N/A"}</p>
              </div>
              <button onClick={() => setDocsModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {containerDocs.map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-[hsl(var(--hp-navy))]" />
                      <div>
                        <p className="font-medium text-sm text-gray-800">{doc.name}</p>
                        <p className={`text-xs ${doc.status === "Completo" ? "text-green-600" : "text-amber-600"}`}>
                          {doc.status === "Completo" ? (
                            <span className="flex items-center gap-1"><CheckCircle size={12} /> Completo</span>
                          ) : (
                            "Pendiente"
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadDoc(doc.name, containerRows[0]?.id || "N/A")}
                      className="flex items-center gap-1.5 bg-[hsl(var(--hp-sky))] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[hsl(var(--hp-sky))]/90 transition-colors"
                    >
                      <Download size={14} />
                      Descargar
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setDocsModalOpen(false)}
                  className="w-full bg-[hsl(var(--hp-navy))] text-white font-semibold py-2.5 rounded-lg hover:bg-[hsl(var(--hp-navy))]/90 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuevaCita;
