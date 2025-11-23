import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PawPrint, Menu, X } from "lucide-react";

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar = ({ onLoginClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Inicio", href: "#inicio" },
    { name: "¿Quiénes Somos?", href: "#quienes-somos" },
    { name: "Nuestros Amigos", href: "#nuestros-amigos" },
    { name: "Blog", href: "#blog" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-50 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2 group">
            <PawPrint className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold text-foreground">
              Adopt a Friend
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
            <Button onClick={onLoginClick} variant="default" size="lg">
              Iniciar Sesión
            </Button>
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
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button onClick={onLoginClick} variant="default" size="lg" className="w-full">
              Iniciar Sesión
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
