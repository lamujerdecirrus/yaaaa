import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Calendar, MessageCircle, Newspaper, Menu } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MainScreen = () => {
  const navigate = useNavigate();
  const { selectedTerminal } = useApp();

  const handleItinerario = () => {
    toast({ title: "Itinerario", description: "Consultando itinerario de buques..." });
  };

  const handleEvaport = () => {
    toast({ title: "EVAPORT", description: "Abriendo sistema EVAPORT..." });
  };

  const handleNoticias = () => {
    toast({ title: "Noticias", description: "Cargando ultimas noticias..." });
  };

  return (
    <div className="min-h-screen hp-diagonal-bg flex flex-col">
      {/* Header */}
      <div className="hp-header py-3 px-6 flex items-center justify-between">
        <div />
        <button
          onClick={() => navigate("/terminal-selector")}
          className="border-2 border-white rounded-full px-6 py-1.5 text-white font-bold text-sm flex items-center gap-2 hover:bg-white/10 transition-colors"
        >
          {selectedTerminal} <span className="text-xs">&#9776;</span>
        </button>
        <button className="text-white">
          <Menu size={28} />
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-10 max-w-3xl mx-auto w-full">
        <button 
          onClick={handleItinerario}
          className="w-full hp-card p-8 flex items-center gap-6 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <Calendar size={48} className="text-muted-foreground" strokeWidth={1.5} />
          <h2 className="text-2xl font-black text-primary tracking-wide">ITINERARIO</h2>
        </button>

        <button 
          onClick={handleEvaport}
          className="w-full hp-card p-8 flex items-center gap-6 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <MessageCircle size={48} className="text-muted-foreground" strokeWidth={1.5} />
          <h2 className="text-2xl font-black text-primary tracking-wide">EVAPORT</h2>
        </button>

        <button 
          onClick={handleNoticias}
          className="w-full hp-card p-8 flex items-center gap-6 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <Newspaper size={48} className="text-muted-foreground" strokeWidth={1.5} />
          <h2 className="text-2xl font-black text-primary tracking-wide">NOTICIAS</h2>
        </button>
      </div>

      {/* Login button */}
      <div className="pb-10 flex justify-center">
        <button
          onClick={() => navigate("/login")}
          className="bg-white/90 rounded-full px-12 py-3 text-primary font-bold text-lg tracking-wider hover:bg-white transition-colors shadow-lg"
        >
          INICIAR SESION
        </button>
      </div>
    </div>
  );
};

export default MainScreen;
