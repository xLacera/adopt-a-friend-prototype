import { PawPrint } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 md:py-16 bg-accent/30 border-t border-border">
      <div className="container mx-auto px-4">
        {/* Special Message */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PawPrint className="w-6 h-6 text-primary" />
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Transformando vidas, una patita a la vez
            </h3>
            <PawPrint className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cada adopción es una historia de amor que comienza. 
            Gracias por ser parte de nuestra misión de dar hogar a quienes más lo necesitan.
          </p>
        </div>

        {/* Paw Prints Decoration */}
        <div className="flex justify-center gap-4 mb-8">
          <PawPrint className="w-8 h-8 text-primary/60" />
          <PawPrint className="w-8 h-8 text-primary/80" />
          <PawPrint className="w-8 h-8 text-primary" />
          <PawPrint className="w-8 h-8 text-primary/80" />
          <PawPrint className="w-8 h-8 text-primary/60" />
        </div>

        {/* Footer Links */}
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-3">Contacto</h4>
            <p className="text-muted-foreground text-sm">info@adoptafriend.org</p>
            <p className="text-muted-foreground text-sm">+34 123 456 789</p>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-3">Síguenos</h4>
            <p className="text-muted-foreground text-sm">Facebook | Instagram</p>
            <p className="text-muted-foreground text-sm">Twitter | TikTok</p>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-3">Ayúdanos</h4>
            <p className="text-muted-foreground text-sm">Donaciones</p>
            <p className="text-muted-foreground text-sm">Voluntariado</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2025 Adopt a Friend. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
