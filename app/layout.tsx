import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}

