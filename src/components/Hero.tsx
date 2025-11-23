import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-pets.jpg";

const Hero = () => {
  return (
    <section id="inicio" className="pt-32 pb-20 md:pt-40 md:pb-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 order-2 md:order-1">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Encuentra tu Nuevo Mejor Amigo
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              En <span className="text-primary font-semibold">Adopt a Friend</span>, creemos que cada mascota merece un hogar lleno de amor. 
              Muy pronto podrás conocer a todas las mascotas que están esperando ser parte de tu familia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                variant="default"
                className="text-lg px-8 py-6 shadow-soft hover:shadow-lg transition-all"
                onClick={() => document.getElementById('nuestros-amigos')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Conoce a Nuestros Amigos
              </Button>
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-6"
                onClick={() => document.getElementById('quienes-somos')?.scrollIntoView({ behavior: 'smooth' })}
              >
                ¿Cómo Adoptar?
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 md:order-2">
            <div className="relative rounded-3xl overflow-hidden shadow-card">
              <img 
                src={heroImage} 
                alt="Perro y gato felices juntos" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
