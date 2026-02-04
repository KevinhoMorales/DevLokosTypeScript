import EnterpriseSection from '@/components/EnterpriseSection';
import { SECTION_PAGE_WRAPPER } from '@/lib/section-layout';

export const metadata = {
  title: "Empresarial | DevLokos",
  description: "Servicios a medida, portfolio y formulario para iniciar un proyecto con DevLokos.",
};

export default function EmpresarialPage() {
  return (
    <div className={SECTION_PAGE_WRAPPER}>
      <EnterpriseSection />
    </div>
  );
}
