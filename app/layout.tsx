import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './components/Theme/ThemeProvider';

export const metadata: Metadata = {
  title: 'Metamorphosis - Kafka Observability Platform',
  description: 'Monitor and visualize your Kafka clusters with Metamorphosis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

