import { useState } from "react";
import { Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import { Card, CardContent } from "@/components/ui/card";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  tag: string;
}

const articles: Article[] = [
  {
    slug: "primeros-dias-en-casa",
    title: "Los primeros días con tu nueva mascota",
    excerpt:
      "Adoptar es solo el comienzo. Acá te contamos cómo hacer que tu nuevo amigo se sienta seguro las primeras semanas.",
    body: "Las primeras 72 horas son clave para que la mascota gane confianza. Designa un espacio tranquilo, mantén una rutina predecible para las comidas y los paseos, y evita visitas masivas. Deja que sea ella quien se acerque a ti, no al revés.",
    date: "2025-08-12",
    tag: "Cuidados",
  },
  {
    slug: "mitos-adopcion",
    title: "5 mitos sobre adoptar mascotas adultas",
    excerpt:
      "Muchos creen que solo los cachorros se adaptan. La realidad es que las mascotas adultas suelen tener un montón de ventajas.",
    body: "Mito 1: 'Ya tienen mañas imposibles de cambiar'. Falso: con paciencia se adaptan a nuevas rutinas. Mito 2: 'No se encariñan'. La mayoría desarrolla un vínculo profundo con quien le da estabilidad. Mito 3: 'Se enferman más'. Si están vacunados y revisados, su salud es comparable. Mito 4: 'No son juguetones'. Depende de la mascota, no de la edad. Mito 5: 'Solo sirven para gente mayor'. Familias activas también se benefician de su carácter ya formado.",
    date: "2025-09-03",
    tag: "Mitos",
  },
  {
    slug: "alimentacion-balanceada",
    title: "Alimentación: lo básico que tu mascota necesita",
    excerpt:
      "No es solo elegir una marca cara. Te explicamos qué mirar en la etiqueta y cómo ajustar las porciones.",
    body: "Busca alimentos donde el primer ingrediente sea proteína animal real (pollo, res, cordero) y no subproductos. Las porciones dependen de peso, edad y nivel de actividad: consulta la tabla del fabricante como punto de partida y ajusta si tu mascota sube o baja de peso. Siempre agua fresca disponible. Evita darle restos de comida humana con cebolla, ajo, chocolate o uvas.",
    date: "2025-10-21",
    tag: "Salud",
  },
  {
    slug: "como-funciona-la-adopcion",
    title: "Cómo funciona el proceso de adopción en Adopt a Friend",
    excerpt:
      "Te explicamos paso a paso lo que pasa desde que envías la solicitud hasta que la mascota llega a casa.",
    body: "1. Encuentra la mascota que más se conecte contigo en la galería. 2. Envía la solicitud con un mensaje contándonos sobre ti, tu hogar y por qué te interesa esa mascota en particular. 3. Nuestro equipo revisa la solicitud, en algunos casos hacemos una llamada o visita. 4. Si todo va bien, coordinamos la entrega y firmamos el acuerdo de adopción responsable. 5. Te acompañamos durante las primeras semanas para resolver cualquier duda.",
    date: "2026-01-15",
    tag: "Proceso",
  },
];

const Blog = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Historias, consejos y guías para hacer de la adopción una experiencia feliz
              tanto para ti como para tu nueva mascota.
            </p>
          </header>

          <div className="space-y-6">
            {articles.map((article) => {
              const isOpen = openSlug === article.slug;
              return (
                <Card key={article.slug} className="border-none shadow-card">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="bg-accent text-primary px-2 py-1 rounded font-medium">
                        {article.tag}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{article.title}</h2>
                    <p className="text-muted-foreground">{article.excerpt}</p>
                    {isOpen && (
                      <p className="text-foreground leading-relaxed border-t border-border pt-3">
                        {article.body}
                      </p>
                    )}
                    <button
                      onClick={() => setOpenSlug(isOpen ? null : article.slug)}
                      className="text-sm text-primary font-medium hover:underline"
                    >
                      {isOpen ? "Ocultar" : "Leer más"}
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </div>
  );
};

export default Blog;
