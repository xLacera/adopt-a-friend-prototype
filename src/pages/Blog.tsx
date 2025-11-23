import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import LoginModal from "@/components/LoginModal";

const Blog = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      
      <main className="pt-32 pb-16 min-h-[60vh]">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-center">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            Próximamente compartiremos historias, consejos y noticias sobre nuestras mascotas.
          </p>
        </div>
      </main>

      <Footer />
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </div>
  );
};

export default Blog;
