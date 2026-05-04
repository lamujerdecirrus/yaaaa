import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { terminals } from "@/data/mockData";
import { ChevronRight, ArrowLeft } from "lucide-react";

const TerminalSelector = () => {
  const navigate = useNavigate();
  const { setSelectedTerminal } = useApp();

  const handleSelect = (code: string) => {
    setSelectedTerminal(code);
    navigate("/");
  };

  return (
    <div className="min-h-screen hp-diagonal-bg flex flex-col">
      <div className="hp-header py-4 px-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-white flex items-center gap-2 hover:text-white/80 transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Volver</span>
          </button>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-black tracking-wider">SELECTOR DE TERMINAL</h1>
            <p className="text-sm font-semibold tracking-wide opacity-80">SELECCIONA LA TERMINAL DE TU PREFERENCIA</p>
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-5 px-6 py-8 max-w-3xl mx-auto w-full">
        {terminals.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelect(t.code)}
            className="w-full hp-card p-6 flex items-center justify-between hover:shadow-lg transition-shadow"
          >
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-hp-navy rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">HP</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-muted-foreground tracking-wider">HUTCHISON</span>
                  <span className="text-xs text-muted-foreground">PORTS</span>
                </div>
              </div>
              <h3 className="text-xl font-black text-primary">{t.code}</h3>
              <span className="text-xs hp-btn-outline py-0.5 px-3 rounded-full mt-1 inline-block">INFO</span>
            </div>
            <ChevronRight size={32} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TerminalSelector;
