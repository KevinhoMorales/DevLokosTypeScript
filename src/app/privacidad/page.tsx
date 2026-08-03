import { LegalPageShell } from "@/components/legal/LegalPageShell"
import { PrivacyContent } from "@/components/legal/PrivacyContent"

export const metadata = {
  title: "Política de Privacidad | DevLokos",
  description:
    "Política de privacidad de la aplicación DevLokos: recopilación, uso y protección de datos.",
}

export default function PrivacidadPage() {
  return (
    <LegalPageShell title="Política de Privacidad">
      <PrivacyContent />
    </LegalPageShell>
  )
}
