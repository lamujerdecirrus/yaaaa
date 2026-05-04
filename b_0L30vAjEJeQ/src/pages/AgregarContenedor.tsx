import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, Upload, FileSpreadsheet, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ContainerForm {
  patente: string;
  contenedor: string;
  tipoMovimiento: string;
  transportista: string;
  placas: string;
  eco: string;
  license: string;
  linea: string;
  tamano: string;
  tipoContenedor: string;
  rfcManiobras: string;
  rfcExportador: string;
  sello1: string;
  sello2: string;
  sello3: string;
  fe: string;
  tipoCarga: string;
  descripcionMercancia: string;
  pesoNeto: string;
  referencia: string;
  booking: string;
  viaje: string;
  puertoDescarga: string;
  destino: string;
  temperatura: string;
  grados: string;
  ventilacion: string;
  co2: string;
  o2: string;
  cliente: string;
}

const emptyForm: ContainerForm = {
  patente: "", contenedor: "", tipoMovimiento: "Expo", transportista: "",
  placas: "", eco: "", license: "", linea: "",
  tamano: "", tipoContenedor: "", rfcManiobras: "", rfcExportador: "",
  sello1: "", sello2: "", sello3: "",
  fe: "", tipoCarga: "", descripcionMercancia: "",
  pesoNeto: "", referencia: "", booking: "", viaje: "",
  puertoDescarga: "", destino: "",
  temperatura: "", grados: "", ventilacion: "", co2: "", o2: "",
  cliente: "",
};

const exampleForm: ContainerForm = {
  patente: "3521", contenedor: "MSCU8847231", tipoMovimiento: "Expo", transportista: "TRANSPORTES DEL NORTE",
  placas: "AB-123-CD", eco: "ECO-4521", license: "LIC-99281", linea: "MSC",
  tamano: "40", tipoContenedor: "HC", rfcManiobras: "MAN850101AAA", rfcExportador: "EXP900202BBB",
  sello1: "SEL001", sello2: "SEL002", sello3: "SEL003",
  fe: "2025-04-15", tipoCarga: "General", descripcionMercancia: "Autopartes para exportación",
  pesoNeto: "22500", referencia: "REF-EXP-0042", booking: "BKG-2025-1234", viaje: "025E",
  puertoDescarga: "SHANGHAI", destino: "CHINA",
  temperatura: "", grados: "", ventilacion: "", co2: "", o2: "",
  cliente: "ACME EXPORTS SA DE CV",
};

const AgregarContenedor = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [form, setForm] = useState<ContainerForm>(emptyForm);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const set = (field: keyof ContainerForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const fillExample = () => setForm(exampleForm);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      // Simulate CSV auto-fill
      setForm(exampleForm);
      toast({ title: "CSV cargado", description: `Se llenaron los campos automáticamente desde "${file.name}".` });
    }
  };

  const handleSubmit = () => {
    if (!form.contenedor) {
      toast({ title: "Campo requerido", description: "Ingresa al menos el ID del contenedor.", variant: "destructive" });
      return;
    }
    toast({ title: "Contenedor agregado", description: `El contenedor ${form.contenedor} fue registrado exitosamente.` });
    navigate("/tas");
  };

  const handleDuplicate = () => {
    toast({ title: "Contenedor duplicado", description: "Se creó una copia del formulario actual." });
  };

  const inputClass = "w-full border border-border rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-hp-sky";
  const labelClass = "text-xs font-semibold text-muted-foreground mb-1 block";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="hp-header px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-white flex items-center gap-2 hover:text-white/80 transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Volver</span>
        </button>
        <span className="text-white font-semibold">Nuevo Contenedor</span>
        <div className="text-white text-sm">Hola, <span className="font-bold">{user?.name || "USUARIO"}</span></div>
      </div>

      <div className="p-6 max-w-5xl mx-auto w-full">
        <h1 className="text-xl font-bold text-foreground mb-6">Nuevo contenedor</h1>

        {/* CSV upload bar */}
        <div className="hp-card p-4 mb-6 flex items-center gap-4">
          <FileSpreadsheet size={20} className="text-hp-sky" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Carga automática por CSV</p>
            <p className="text-xs text-muted-foreground">Sube un archivo .csv para llenar automáticamente los campos del contenedor.</p>
          </div>
          <label className="hp-btn-outline text-sm px-4 py-1.5 rounded cursor-pointer flex items-center gap-2">
            <Upload size={14} />
            {csvFile ? csvFile.name : "Seleccionar CSV"}
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
          </label>
        </div>

        {/* Container form */}
        <div className="hp-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-base">Contenedor #1</h2>
              <button onClick={fillExample} className="flex items-center gap-1 text-xs text-hp-sky hover:text-hp-navy transition-colors border border-hp-sky rounded px-3 py-1">
                <Sparkles size={12} /> Ejemplo
              </button>
            </div>
            <button onClick={handleDuplicate} className="text-xs text-hp-sky hover:underline">📋 Duplicar</button>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div><label className={labelClass}>Patente</label><input className={inputClass} value={form.patente} onChange={set("patente")} /></div>
            <div><label className={labelClass}>Contenedor</label><input className={inputClass} value={form.contenedor} onChange={set("contenedor")} /></div>
            <div><label className={labelClass}>Tipo de Movimiento</label>
              <select className={inputClass} value={form.tipoMovimiento} onChange={set("tipoMovimiento")}>
                <option>Expo</option><option>Impo</option>
              </select>
            </div>
            <div><label className={labelClass}>Transportista</label><input className={inputClass} value={form.transportista} onChange={set("transportista")} /></div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div><label className={labelClass}>Placas</label><input className={inputClass} value={form.placas} onChange={set("placas")} /></div>
            <div><label className={labelClass}>ECO</label><input className={inputClass} value={form.eco} onChange={set("eco")} /></div>
            <div><label className={labelClass}>License</label><input className={inputClass} value={form.license} onChange={set("license")} /></div>
            <div><label className={labelClass}>Línea</label><input className={inputClass} value={form.linea} onChange={set("linea")} /></div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div><label className={labelClass}>Tamaño</label><input className={inputClass} value={form.tamano} onChange={set("tamano")} /></div>
            <div><label className={labelClass}>Tipo de Contenedor</label>
              <select className={inputClass} value={form.tipoContenedor} onChange={set("tipoContenedor")}>
                <option value="">Seleccionar</option><option>HC</option><option>ST</option><option>RF</option><option>OT</option>
              </select>
            </div>
            <div><label className={labelClass}>RFC Maniobras</label><input className={inputClass} value={form.rfcManiobras} onChange={set("rfcManiobras")} /></div>
            <div><label className={labelClass}>RFC Exportador</label><input className={inputClass} value={form.rfcExportador} onChange={set("rfcExportador")} /></div>
          </div>

          {/* Row 4 - Sellos */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div><label className={labelClass}>Sello 1</label><input className={inputClass} value={form.sello1} onChange={set("sello1")} /></div>
            <div><label className={labelClass}>Sello 2</label><input className={inputClass} value={form.sello2} onChange={set("sello2")} /></div>
            <div><label className={labelClass}>Sello 3</label><input className={inputClass} value={form.sello3} onChange={set("sello3")} /></div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div><label className={labelClass}>F/E</label><input className={inputClass} value={form.fe} onChange={set("fe")} /></div>
            <div><label className={labelClass}>Tipo de Carga</label>
              <select className={inputClass} value={form.tipoCarga} onChange={set("tipoCarga")}>
                <option value="">Seleccionar</option><option>General</option><option>Peligrosa</option><option>Refrigerada</option><option>Sobredimensionada</option>
              </select>
            </div>
            <div><label className={labelClass}>Descripción de Mercancía</label><input className={inputClass} value={form.descripcionMercancia} onChange={set("descripcionMercancia")} /></div>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div><label className={labelClass}>Peso Neto</label><input className={inputClass} value={form.pesoNeto} onChange={set("pesoNeto")} /></div>
            <div><label className={labelClass}>Referencia</label>
              <select className={inputClass} value={form.referencia} onChange={set("referencia")}>
                <option value="">Seleccionar</option><option>REF-EXP-0042</option><option>REF-IMP-0088</option>
              </select>
            </div>
            <div><label className={labelClass}>Booking</label><input className={inputClass} value={form.booking} onChange={set("booking")} /></div>
            <div><label className={labelClass}>Viaje</label><input className={inputClass} value={form.viaje} onChange={set("viaje")} /></div>
          </div>

          {/* Row 7 */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div><label className={labelClass}>Puerto Descarga</label><input className={inputClass} value={form.puertoDescarga} onChange={set("puertoDescarga")} /></div>
            <div><label className={labelClass}>Destino</label><input className={inputClass} value={form.destino} onChange={set("destino")} /></div>
            <div><label className={labelClass}>Cliente</label><input className={inputClass} value={form.cliente} onChange={set("cliente")} /></div>
            <div></div>
          </div>

          {/* Refrigeración section */}
          <div className="border-t border-border pt-4 mt-4">
            <h3 className="font-semibold text-sm mb-3">Refrigeración</h3>
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div><label className={labelClass}>Temperatura</label><input className={inputClass} value={form.temperatura} onChange={set("temperatura")} /></div>
              <div><label className={labelClass}>Grados</label><input className={inputClass} value={form.grados} onChange={set("grados")} /></div>
              <div><label className={labelClass}>Ventilación (%)</label><input className={inputClass} value={form.ventilacion} onChange={set("ventilacion")} /></div>
              <div><label className={labelClass}>CO2</label><input className={inputClass} value={form.co2} onChange={set("co2")} /></div>
              <div><label className={labelClass}>O2</label><input className={inputClass} value={form.o2} onChange={set("o2")} /></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => navigate("/tas")} className="hp-btn-outline text-sm px-6 py-2 rounded">Cancelar</button>
          <button onClick={handleSubmit} className="hp-btn-primary text-sm px-6 py-2 rounded">Guardar Contenedor</button>
        </div>
      </div>
    </div>
  );
};

export default AgregarContenedor;
