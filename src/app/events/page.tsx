import CommunitySection from '@/components/CommunitySection';
import { SECTION_PAGE_WRAPPER } from '@/lib/section-layout';

export const metadata = {
  title: "Eventos | DevLokos",
  description: "Eventos, talleres y encuentros en vivo. Próximos y pasados.",
};

export default function EventsPage() {
  return (
    <div className={SECTION_PAGE_WRAPPER}>
      <CommunitySection />
    </div>
  );
}
