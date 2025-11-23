import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";
import pet4 from "@/assets/pet-4.jpg";

const PetsGallery = () => {
  const pets = [
    {
      id: 1,
      name: "Max",
      type: "Perro - Beagle",
      age: "3 meses",
      image: pet1,
      description: "Juguetón y cariñoso"
    },
    {
      id: 2,
      name: "Luna",
      type: "Gato - Persa",
      age: "2 meses",
      image: pet2,
      description: "Tranquila y dulce"
    },
    {
      id: 3,
      name: "Rocky",
      type: "Perro - Golden Retriever",
      age: "2 años",
      image: pet3,
      description: "Energético y leal"
    },
    {
      id: 4,
      name: "Mimi",
      type: "Gato - Naranja",
      age: "1 año",
      image: pet4,
      description: "Elegante y amigable"
    }
  ];

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
          {pets.map((pet) => (
            <Card key={pet.id} className="border-none shadow-card hover:shadow-soft transition-all overflow-hidden group">
              <div className="relative overflow-hidden">
                <img 
                  src={pet.image} 
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
                  <p className="text-sm text-muted-foreground">
                    {pet.type}
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
      </div>
    </section>
  );
};

export default PetsGallery;
