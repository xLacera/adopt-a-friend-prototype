import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PawPrint, Menu, X } from "lucide-react";
import { clearToken } from "@/lib/api";
import { useCurrentUser } from "@/lib/useCurrentUser";

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar = ({ onLoginClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  // Anclas dentro de la home y rutas de página separada.
  const sectionLinks = [
    { name: "Inicio", section: "inicio" },
    { name: "¿Quiénes Somos?", section: "quienes-somos" },
    { name: "Nuestros Amigos", section: "nuestros-amigos" },
  ];

  const goToSection = (section: string) => {
    setIsMenuOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${section}`);
      // El scroll se hace tras el cambio de ruta
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-50 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <PawPrint className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold text-foreground">
              Adopt a Friend
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {sectionLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => goToSection(link.section)}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </button>
            ))}
            <Link
              to="/blog"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Blog
            </Link>
            {isAuthenticated && (
              <Link
                to="/perfil"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Perfil
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <Button onClick={handleLogout} variant="destructive" size="lg">
                Cerrar Sesión
              </Button>
            ) : (
              <Button onClick={onLoginClick} variant="default" size="lg">
                Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-border pt-4">
            {sectionLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => goToSection(link.section)}
                className="block w-full text-left text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </button>
            ))}
            <Link
              to="/blog"
              onClick={() => setIsMenuOpen(false)}
              className="block text-foreground hover:text-primary transition-colors font-medium"
            >
              Blog
            </Link>
            {isAuthenticated && (
              <Link
                to="/perfil"
                onClick={() => setIsMenuOpen(false)}
                className="block text-foreground hover:text-primary transition-colors font-medium"
              >
                Perfil
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="block text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <Button onClick={handleLogout} variant="destructive" size="lg" className="w-full">
                Cerrar Sesión
              </Button>
            ) : (
              <Button onClick={onLoginClick} variant="default" size="lg" className="w-full">
                Iniciar Sesión
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
