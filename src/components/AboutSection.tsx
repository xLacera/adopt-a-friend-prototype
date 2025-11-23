import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Heart, Home } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Calendar,
      title: "Eventos Especiales",
      description: "Próximamente organizaremos eventos de adopción donde podrás conocer a nuestras mascotas en persona."
    },
    {
      icon: Heart,
      title: "Consejos de Cuidado",
      description: "Te compartiremos guías y consejos para que cuides de tu nueva mascota de la mejor manera."
    },
    {
      icon: Home,
      title: "Proceso Simple",
      description: "Hacemos que el proceso de adopción sea fácil y transparente para encontrar tu compañero perfecto."
    }
  ];

  return (
    <section id="quienes-somos" className="py-16 md:py-24 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Próximamente
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos trabajando para traerte la mejor experiencia de adopción. 
            Mientras tanto, conoce lo que tenemos preparado para ti.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-none shadow-card hover:shadow-soft transition-all">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Team Section */}
        <div className="mt-16 pt-16 border-t border-border">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Nuestro Equipo
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Camilo Gaitán", role: "Co-fundador" },
              { name: "Ana Cristina Vásquez", role: "Co-fundadora" },
              { name: "Alexandra Giraldo", role: "Co-fundadora" },
              { name: "Elías Lacera", role: "Co-fundador" }
            ].map((member, index) => (
              <Card key={index} className="border-none shadow-card text-center">
                <CardContent className="p-6 space-y-3">
                  <div className="w-20 h-20 mx-auto bg-accent rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {member.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
