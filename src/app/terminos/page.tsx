import { LegalPageShell } from "@/components/legal/LegalPageShell"
import { TermsContent } from "@/components/legal/TermsContent"

export const metadata = {
  title: "Términos y Condiciones | DevLokos",
  description:
    "Términos y condiciones de uso de la aplicación DevLokos, desarrollada por DevLokos Enterprise.",
}

export default function TerminosPage() {
  return (
    <LegalPageShell title="Términos y Condiciones">
      <TermsContent />
    </LegalPageShell>
  )
}
