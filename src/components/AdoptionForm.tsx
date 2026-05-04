import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import type { Pet } from "@/lib/types";

interface AdoptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pet: Pet;
  onSubmitted?: () => void;
}

const AdoptionForm = ({ open, onOpenChange, pet, onSubmitted }: AdoptionFormProps) => {
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 10) {
      toast.error("El mensaje debe tener al menos 10 caracteres");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch("/api/adoptions", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ petId: pet.id, message: message.trim(), phone: phone.trim() || undefined }),
      });
      toast.success(`Solicitud enviada para ${pet.name}. El equipo te contactará pronto.`);
      setMessage("");
      setPhone("");
      onOpenChange(false);
      onSubmitted?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error enviando la solicitud");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Solicitar adopción de {pet.name}</DialogTitle>
          <DialogDescription>
            Cuéntanos un poco sobre ti y por qué te gustaría adoptar a {pet.name}.
            Revisaremos tu solicitud y te contactaremos pronto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje *</Label>
            <Textarea
              id="message"
              rows={5}
              placeholder={`Hola, me gustaría adoptar a ${pet.name} porque...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Mínimo 10 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono (opcional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+57 300 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Te contactaremos por correo, pero un número agiliza la coordinación.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdoptionForm;
