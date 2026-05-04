import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { PawPrint } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <PawPrint className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isLogin 
              ? "Ingresa a tu cuenta para continuar" 
              : "Crea una cuenta para comenzar tu viaje de adopción"
            }
          </DialogDescription>
        </DialogHeader>
        
        <form className="space-y-4 py-4" onSubmit={async (e) => {
          e.preventDefault();
          setErrorMsg("");
          const formData = new FormData(e.currentTarget);
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
          
          try {
            if (isLogin) {
              const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
              });
              const data = await res.json();
              if (res.ok) {
                localStorage.setItem("adopt_token", data.token);
                window.dispatchEvent(new Event("authChange"));
                toast.success("¡Inicio de sesión exitoso!");
                onOpenChange(false);
              } else {
                setErrorMsg(data.error || "Credenciales incorrectas");
              }
            } else {
              const confirmPassword = formData.get("confirm-password") as string;
              if (password !== confirmPassword) {
                setErrorMsg("Las contraseñas no coinciden");
                return;
              }
              const name = formData.get("name") as string || email.split('@')[0];
              const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name })
              });
              const data = await res.json();
              if (res.ok) {
                localStorage.setItem("adopt_token", data.token);
                window.dispatchEvent(new Event("authChange"));
                toast.success("¡Registro exitoso!");
                onOpenChange(false);
              } else {
                setErrorMsg(data.error || "Fallo en el registro");
              }
            }
          } catch (err) {
            setErrorMsg("Error conectando con el servidor");
          }
        }}>
          {errorMsg && (
            <div className="p-3 text-sm text-red-500 bg-red-100/50 border border-red-200 rounded-md text-center">
              {errorMsg}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                name="name"
                type="text" 
                placeholder="Tu nombre completo"
                className="w-full"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              placeholder="tu@email.com"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password" 
              name="password"
              type="password" 
              placeholder="••••••••"
              className="w-full"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                <Input 
                  id="confirm-password" 
                  name="confirm-password"
                  type="password" 
                  placeholder="••••••••"
                  className="w-full"
                  required={!isLogin}
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" size="lg">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={toggleMode}
            >
              {isLogin 
                ? "¿No tienes cuenta? Regístrate" 
                : "¿Ya tienes cuenta? Inicia sesión"
              }
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
