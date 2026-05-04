import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, PawPrint } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import AdoptionForm from "@/components/AdoptionForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ApiError, apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useFavorites } from "@/lib/useFavorites";
import type { Pet } from "@/lib/types";
import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";
import pet4 from "@/assets/pet-4.jpg";

const fallbackImages = [pet1, pet2, pet3, pet4];

const resolveImage = (imageUrl: string | null | undefined, id: number) => {
  if (imageUrl === "/pet-1.jpg") return pet1;
  if (imageUrl === "/pet-2.jpg") return pet2;
  if (imageUrl === "/pet-3.jpg") return pet3;
  if (imageUrl === "/pet-4.jpg") return pet4;
  return fallbackImages[(id - 1) % fallbackImages.length];
};

const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdoptionOpen, setIsAdoptionOpen] = useState(false);
  const { isAuthenticated } = useCurrentUser();
  const { isFavorite, toggle } = useFavorites();

  const handleAdopt = () => {
    if (!isAuthenticated) {
      toast.info("Inicia sesión para iniciar el proceso de adopción");
      setIsLoginOpen(true);
      return;
    }
    setIsAdoptionOpen(true);
  };

  useEffect(() => {
    apiFetch<Pet>(`/api/pets/${id}`)
      .then(setPet)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          toast.error("No pudimos cargar la información de la mascota");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.info("Inicia sesión para guardar favoritos");
      setIsLoginOpen(true);
      return;
    }
    if (!pet) return;
    const ok = await toggle(pet.id);
    if (!ok) toast.error("No se pudo actualizar el favorito");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" className="mb-8">
            <Link to="/#nuestros-amigos">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la galería
            </Link>
          </Button>

          {loading && (
            <div className="text-center py-16 text-muted-foreground">
              Cargando información...
            </div>
          )}

          {notFound && (
            <div className="text-center py-16 max-w-md mx-auto">
              <PawPrint className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Mascota no encontrada</h1>
              <p className="text-muted-foreground mb-6">
                La mascota que buscas ya no está disponible o nunca existió.
              </p>
              <Button asChild>
                <Link to="/">Ir al inicio</Link>
              </Button>
            </div>
          )}

          {pet && (
            <Card className="border-none shadow-card overflow-hidden max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-80 md:h-full">
                  <img
                    src={resolveImage(pet.imageUrl, pet.id)}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleToggleFavorite}
                    className="absolute top-4 right-4 w-10 h-10 bg-background/90 rounded-full flex items-center justify-center shadow-md hover:bg-background transition-all"
                    aria-label={isFavorite(pet.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    <Heart
                      className={`w-5 h-5 text-primary ${
                        isFavorite(pet.id) ? "fill-primary" : ""
                      }`}
                    />
                  </button>
                </div>

                <CardContent className="p-8 space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">{pet.name}</h1>
                    <p className="text-lg text-muted-foreground capitalize">
                      {pet.species} · {pet.breed}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Edad</p>
                      <p className="font-semibold">{pet.age}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Temperamento</p>
                      <p className="font-semibold">{pet.temperament}</p>
                    </div>
                    <div className="col-span-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      <p className="font-semibold">{pet.city}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Estado</p>
                      <p className="font-semibold">
                        {pet.available ? "Disponible para adopción" : "Ya tiene un hogar"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-2">Sobre {pet.name}</p>
                    <p className="text-foreground leading-relaxed">{pet.description}</p>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleAdopt}
                    disabled={!pet.available}
                  >
                    {pet.available ? "Quiero adoptar" : "No disponible"}
                  </Button>
                </CardContent>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
      {pet && (
        <AdoptionForm open={isAdoptionOpen} onOpenChange={setIsAdoptionOpen} pet={pet} />
      )}
    </div>
  );
};

export default PetDetail;
