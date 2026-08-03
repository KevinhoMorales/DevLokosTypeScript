import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin | DevLokos',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
