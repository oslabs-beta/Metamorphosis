import Link from 'next/link';
import Sidebar from '@/app/components/layout/Sidebar';
import '@/app/styles/main.scss';

export default function Home() {
  return (
    <Sidebar isAuthenticated={true}>
      <div className="home">
        <h1>Metamorphosis - Kafka Observability Platform</h1>
        <p>Welcome to Metamorphosis. Monitor and visualize your Kafka clusters.</p>
        <Link href="/connect">
          <button>Connect to Prometheus</button>
        </Link>
      </div>
    </Sidebar>
  );
}

