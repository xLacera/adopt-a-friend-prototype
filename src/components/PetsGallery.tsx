import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin } from "lucide-react";
import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";
import pet4 from "@/assets/pet-4.jpg";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useFavorites } from "@/lib/useFavorites";
import type { Pet } from "@/lib/types";

const PetsGallery = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const { isAuthenticated } = useCurrentUser();
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    apiFetch<Pet[]>("/api/pets")
      .then(setPets)
      .catch((err) => console.error("Error cargando mascotas:", err));
  }, []);

  const handleToggleFavorite = async (e: React.MouseEvent, petId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info("Inicia sesión para guardar favoritos");
      return;
    }
    const ok = await toggle(petId);
    if (!ok) toast.error("No se pudo actualizar el favorito");
  };

  const getPetImage = (imageUrl: string | null | undefined, index: number) => {
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estas adorables mascotas están buscando un hogar lleno de amor.
            ¿Podrías ser tú quien les dé una segunda oportunidad?
          </p>
        </div>

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
                  type="button"
                  onClick={(e) => handleToggleFavorite(e, pet.id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-background/90 rounded-full flex items-center justify-center shadow-md hover:bg-background transition-all"
                  aria-label={isFavorite(pet.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <Heart
                    className={`w-5 h-5 text-primary transition-all ${
                      isFavorite(pet.id) ? "fill-primary" : ""
                    }`}
                  />
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
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{pet.city}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{pet.age}</span>
                  <span className="text-primary font-medium">{pet.temperament}</span>
                </div>
                <Button asChild variant="default" className="w-full mt-2">
                  <Link to={`/pets/${pet.id}`}>Más Información</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetsGallery;
