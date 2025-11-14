// Custom server for Socket.io with Next.js
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { queryCountMetrics, queryChartMetrics, setPrometheusUrl } from './lib/metrics/prometheus';
import { throttledSendEmail } from './lib/alerts/email';

// Initialize email transporter
import { initializeEmailTransporter } from './lib/alerts/email';
import { getAlertWorker } from './lib/alerts/alertWorker';
import { initializeDatabase } from './lib/metrics/ingestion';

initializeEmailTransporter();

// Initialize database connection (async, don't block server startup)
if (process.env.DATABASE_URL || process.env.DB_HOST) {
  (async () => {
    try {
      const pool = initializeDatabase();
      // Test connection
      const client = await pool.connect();
      client.release();
      console.log('Database connection initialized');
    } catch (error: any) {
      console.warn('Database initialization failed (continuing without historical storage):', error.message || error);
    }
  })();
}

// Start alert worker
const alertWorker = getAlertWorker();
alertWorker.start(30000); // Check every 30 seconds

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

interface ServerToClientEvents {
  data: (x: { [key: string]: any }) => void;
}

interface ClientToServerEvents {
  range: (x: string) => void;
  ip: (x: string) => void;
  alert: (data: { to: string; subject: string; text?: string }) => void;
}

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: dev ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST'],
    },
  });

  const queryIntervals = new Map<string, NodeJS.Timeout>();

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('range', async (range: string) => {
      const ip = process.env.PROMETHEUS_URL || 'localhost:9090';
      try {
        const chartMetrics = await queryChartMetrics(ip, Number(range));
        socket.emit('data', chartMetrics);
      } catch (error) {
        console.error('Error querying chart metrics:', error);
      }
    });

    socket.on('ip', (ip: string) => {
      setPrometheusUrl(ip);

      // Clear existing interval for this socket
      const existingInterval = queryIntervals.get(socket.id);
      if (existingInterval) {
        clearInterval(existingInterval);
      }

      // Set up periodic queries
      const interval = setInterval(async () => {
        try {
          const [countMetrics, chartMetrics] = await Promise.all([
            queryCountMetrics(ip),
            queryChartMetrics(ip, 15),
          ]);

          socket.emit('data', {
            ...countMetrics,
            ...chartMetrics,
          });
        } catch (error) {
          console.error('Error querying metrics:', error);
        }
      }, 5000);

      queryIntervals.set(socket.id, interval);
    });

    socket.on('alert', async (data: { to: string; subject: string; text?: string }) => {
      await throttledSendEmail(data.to, data.subject, data.text);
    });

    socket.on('disconnect', () => {
      const interval = queryIntervals.get(socket.id);
      if (interval) {
        clearInterval(interval);
        queryIntervals.delete(socket.id);
      }
      console.log('Client disconnected');
    });
  });

  httpServer
    .once('error', (err: NodeJS.ErrnoException) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

