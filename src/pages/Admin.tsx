import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/lib/useCurrentUser";
import type { Adoption, AdoptionStatus, Pet } from "@/lib/types";

interface PetForm {
  name: string;
  breed: string;
  age: string;
  description: string;
  imageUrl: string;
  temperament: string;
  species: string;
  city: string;
  available: boolean;
}

const emptyForm: PetForm = {
  name: "",
  breed: "",
  age: "",
  description: "",
  imageUrl: "",
  temperament: "",
  species: "perro",
  city: "",
  available: true,
};

const COLOMBIAN_CITIES = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Manizales",
  "Santa Marta",
  "Cúcuta",
  "Ibagué",
  "Villavicencio",
  "Armenia",
  "Pasto",
  "Neiva",
  "Popayán",
  "Tunja",
  "Montería",
  "Sincelejo",
  "Valledupar",
];

const statusColors: Record<AdoptionStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-900",
  APPROVED: "bg-green-100 text-green-900",
  REJECTED: "bg-red-100 text-red-900",
  CANCELLED: "bg-gray-100 text-gray-700",
};

const Admin = () => {
  const { user, loading, isAdmin } = useCurrentUser();
  const [pets, setPets] = useState<Pet[]>([]);
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PetForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const refreshPets = async () => {
    try {
      const data = await apiFetch<Pet[]>("/api/pets");
      setPets(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error cargando mascotas");
    }
  };

  const refreshAdoptions = async () => {
    try {
      const data = await apiFetch<Adoption[]>("/api/adoptions", { auth: true });
      setAdoptions(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error cargando solicitudes");
    }
  };

  useEffect(() => {
    if (isAdmin) {
      refreshPets();
      refreshAdoptions();
    }
  }, [isAdmin]);

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar onLoginClick={() => setIsLoginOpen(true)} />
        <main className="flex-1 flex items-center justify-center px-4 pt-32">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-2">Acceso restringido</h1>
            <p className="text-muted-foreground">
              Esta sección es solo para administradores. Si crees que esto es un error,
              contacta al equipo.
            </p>
          </div>
        </main>
        <Footer />
        <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
      </div>
    );
  }

  const handleEdit = (pet: Pet) => {
    setEditingId(pet.id);
    setForm({
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      description: pet.description,
      imageUrl: pet.imageUrl ?? "",
      temperament: pet.temperament,
      species: pet.species,
      city: pet.city,
      available: pet.available,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, imageUrl: form.imageUrl || null };
      if (editingId) {
        await apiFetch(`/api/pets/${editingId}`, {
          method: "PUT",
          auth: true,
          body: JSON.stringify(payload),
        });
        toast.success("Mascota actualizada");
      } else {
        await apiFetch("/api/pets", {
          method: "POST",
          auth: true,
          body: JSON.stringify(payload),
        });
        toast.success("Mascota creada");
      }
      handleCancelEdit();
      refreshPets();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error guardando mascota");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (pet: Pet) => {
    if (!confirm(`¿Eliminar a ${pet.name}? Esta acción no se puede deshacer.`)) return;
    try {
      await apiFetch(`/api/pets/${pet.id}`, { method: "DELETE", auth: true });
      toast.success("Mascota eliminada");
      refreshPets();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error eliminando");
    }
  };

  const handleStatusChange = async (adoption: Adoption, status: AdoptionStatus) => {
    try {
      await apiFetch(`/api/adoptions/${adoption.id}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status }),
      });
      toast.success("Estado actualizado");
      refreshAdoptions();
      if (status === "APPROVED") refreshPets();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error actualizando estado");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4 space-y-12">
          <header>
            <h1 className="text-4xl font-bold mb-2">Panel de administración</h1>
            <p className="text-muted-foreground">
              Gestiona el catálogo de mascotas y las solicitudes de adopción.
            </p>
          </header>

          {/* Formulario crear/editar */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {editingId ? `Editando #${editingId}` : "Agregar nueva mascota"}
              </h2>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed">Raza</Label>
                  <Input
                    id="breed"
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    placeholder="Ej. 3 meses, 2 años"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="species">Especie</Label>
                  <select
                    id="species"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.species}
                    onChange={(e) => setForm({ ...form, species: e.target.value })}
                  >
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperament">Temperamento</Label>
                  <Input
                    id="temperament"
                    placeholder="Juguetón, tranquilo..."
                    value={form.temperament}
                    onChange={(e) => setForm({ ...form, temperament: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    list="city-options"
                    placeholder="Selecciona o escribe una ciudad de Colombia"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                  />
                  <datalist id="city-options">
                    {COLOMBIAN_CITIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL de imagen (opcional)</Label>
                  <Input
                    id="imageUrl"
                    placeholder="/pet-1.jpg o https://..."
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    id="available"
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  />
                  <Label htmlFor="available">Disponible para adopción</Label>
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <Button type="submit" disabled={submitting}>
                    {editingId ? "Guardar cambios" : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear mascota
                      </>
                    )}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de mascotas */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Mascotas ({pets.length})</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map((pet) => (
                <Card key={pet.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{pet.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          #{pet.id} · {pet.species} · {pet.breed}
                        </p>
                        <p className="text-xs text-muted-foreground">📍 {pet.city}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          pet.available ? "bg-green-100 text-green-900" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {pet.available ? "Disponible" : "No disponible"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{pet.description}</p>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(pet)}>
                        <Pencil className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(pet)}>
                        <Trash2 className="w-3 h-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Solicitudes de adopción */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Solicitudes de adopción ({adoptions.length})
            </h2>
            {adoptions.length === 0 ? (
              <p className="text-muted-foreground">No hay solicitudes todavía.</p>
            ) : (
              <div className="space-y-3">
                {adoptions.map((a) => (
                  <Card key={a.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold">
                            {a.user?.name} → quiere adoptar a{" "}
                            <span className="text-primary">{a.pet.name}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {a.user?.email} · {new Date(a.createdAt).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            📍 {a.pet.name} está en {a.pet.city}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${statusColors[a.status]}`}
                        >
                          {a.status}
                        </span>
                      </div>
                      <p className="text-sm bg-accent/30 p-3 rounded">{a.message}</p>
                      {a.phone && (
                        <p className="text-sm font-medium">
                          📞 <a href={`tel:${a.phone}`} className="text-primary hover:underline">{a.phone}</a>
                        </p>
                      )}
                      {a.status === "PENDING" && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(a, "APPROVED")}
                          >
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(a, "REJECTED")}
                          >
                            Rechazar
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
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

export default Admin;
