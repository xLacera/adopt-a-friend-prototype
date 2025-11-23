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

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [isLogin, setIsLogin] = useState(true);

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
        
        <form className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="tu@email.com"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="••••••••"
                className="w-full"
              />
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => setIsLogin(!isLogin)}
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
