import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, PawPrint } from "lucide-react";
import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";
import pet4 from "@/assets/pet-4.jpg";

const PetsGallery = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("adopt_token"));
    
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem("adopt_token"));
    };
    
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/pets");
        if (res.ok) {
          const data = await res.json();
          setPets(data);
        }
      } catch (err) {
        console.error("Error cargando mascotas:", err);
      }
    };
    fetchPets();
  }, []);

  const getPetImage = (imageUrl: string, index: number) => {
    if (imageUrl === "/pet-1.jpg") return pet1;
    if (imageUrl === "/pet-2.jpg") return pet2;
    if (imageUrl === "/pet-3.jpg") return pet3;
    if (imageUrl === "/pet-4.jpg") return pet4;
    const fallbacks = [pet1, pet2, pet3, pet4];
    return fallbacks[index % 4];
  };

  return (
    <section id="nuestros-amigos" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Conoce a Nuestros Amigos
          </h2>
          {!isAuthenticated ? (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 max-w-2xl mx-auto mt-8">
              <PawPrint className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">¡Inicia sesión para ver las mascotas!</h3>
              <p className="text-muted-foreground">
                Por seguridad y privacidad de nuestros amigos peludos, la galería solo está disponible 
                para usuarios registrados en la plataforma.
              </p>
            </div>
          ) : (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estas adorables mascotas están buscando un hogar lleno de amor. 
              ¿Podrías ser tú quien les dé una segunda oportunidad?
            </p>
          )}
        </div>

        {isAuthenticated && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {pets.map((pet, index) => (
            <Card key={pet.id} className="border-none shadow-card hover:shadow-soft transition-all overflow-hidden group">
              <div className="relative overflow-hidden">
                <img 
                  src={getPetImage(pet.imageUrl, index)} 
                  alt={pet.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button 
                  className="absolute top-4 right-4 w-10 h-10 bg-background/90 rounded-full flex items-center justify-center shadow-md hover:bg-background transition-all"
                  aria-label="Agregar a favoritos"
                >
                  <Heart className="w-5 h-5 text-primary" />
                </button>
              </div>
              <CardContent className="p-6 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {pet.name}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {pet.species} - {pet.breed}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{pet.age}</span>
                  <span className="text-primary font-medium">{pet.description}</span>
                </div>
                <Button variant="default" className="w-full mt-2">
                  Más Información
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export default PetsGallery;
