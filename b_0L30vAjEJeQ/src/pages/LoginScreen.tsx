import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { mockUsers } from "@/data/mockData";
import { Eye, EyeOff, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LoginScreen = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const found = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setUser(found);
      navigate("/tas");
    } else {
      toast({ title: "Error", description: "Usuario o contraseña incorrectos", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen hp-diagonal-bg flex flex-col">
      <div className="hp-header py-4 px-6 text-center">
        <h1 className="text-2xl font-black tracking-wider">INICIAR SESIÓN</h1>
        <p className="text-sm font-semibold tracking-wide opacity-80">DESCUBRE SMARTPORT</p>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="hp-card p-8 w-full max-w-md flex flex-col gap-8">
          {/* Username */}
          <div className="border-b border-muted-foreground/30 pb-2 flex items-center gap-3">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
            <Mail size={20} className="text-muted-foreground" />
          </div>

          {/* Password */}
          <div className="border-b border-muted-foreground/30 pb-2 flex items-center gap-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            className="w-full bg-muted/60 rounded-full py-3 text-primary font-bold text-lg tracking-wider hover:bg-muted transition-colors"
          >
            INICIAR SESIÓN
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Olvidaste tu <span className="underline cursor-pointer">contraseña</span>?
          </p>

          <div className="flex-1" />

          <button className="w-full bg-muted/60 rounded-full py-3 text-primary font-bold text-lg tracking-wider hover:bg-muted transition-colors mt-8">
            REGÍSTRATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
