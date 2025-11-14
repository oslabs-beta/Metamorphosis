import Sidebar from '@/app/components/layout/Sidebar';
import '@/app/styles/main.scss';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Sidebar isAuthenticated={true}>{children}</Sidebar>;
}

