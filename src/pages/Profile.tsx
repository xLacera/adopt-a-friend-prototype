import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Heart, PawPrint } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useFavorites } from "@/lib/useFavorites";
import type { Adoption, AdoptionStatus } from "@/lib/types";

const statusLabels: Record<AdoptionStatus, { text: string; classes: string }> = {
  PENDING: { text: "Pendiente", classes: "bg-yellow-100 text-yellow-900" },
  APPROVED: { text: "Aprobada", classes: "bg-green-100 text-green-900" },
  REJECTED: { text: "Rechazada", classes: "bg-red-100 text-red-900" },
  CANCELLED: { text: "Cancelada", classes: "bg-gray-100 text-gray-700" },
};

const Profile = () => {
  const { user, loading } = useCurrentUser();
  const { favorites } = useFavorites();
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    if (user) {
      apiFetch<Adoption[]>("/api/adoptions/mine", { auth: true })
        .then(setAdoptions)
        .catch(() => setAdoptions([]));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
          {/* Cabecera */}
          <Card>
            <CardContent className="p-8 flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
                <PawPrint className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Miembro desde {new Date(user.createdAt).toLocaleDateString()}
                  {user.role === "ADMIN" && (
                    <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                      ADMIN
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Favoritos */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary fill-primary" />
              Mis favoritos ({favorites.length})
            </h2>
            {favorites.length === 0 ? (
              <p className="text-muted-foreground">
                Aún no tienes mascotas en favoritos.{" "}
                <Link to="/#nuestros-amigos" className="text-primary underline">
                  Explora la galería
                </Link>
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((pet) => (
                  <Card key={pet.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-bold">{pet.name}</h3>
                          <p className="text-xs text-muted-foreground capitalize">
                            {pet.species} · {pet.breed}
                          </p>
                        </div>
                      </div>
                      <Button asChild size="sm" className="w-full">
                        <Link to={`/pets/${pet.id}`}>Ver detalle</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Mis solicitudes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Mis solicitudes de adopción ({adoptions.length})
            </h2>
            {adoptions.length === 0 ? (
              <p className="text-muted-foreground">
                Aún no has enviado solicitudes de adopción.
              </p>
            ) : (
              <div className="space-y-3">
                {adoptions.map((a) => {
                  const status = statusLabels[a.status];
                  return (
                    <Card key={a.id}>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold">
                              <Link to={`/pets/${a.pet.id}`} className="hover:underline">
                                {a.pet.name}
                              </Link>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Enviada el {new Date(a.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${status.classes}`}>
                            {status.text}
                          </span>
                        </div>
                        <p className="text-sm bg-accent/30 p-3 rounded">{a.message}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </div>
  );
};

export default Profile;
