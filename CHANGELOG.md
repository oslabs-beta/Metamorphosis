# Changelog

All notable changes to Metamorphosis will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-04

### Added - Platform Upgrade

#### Core Features
- **Next.js 14+ Migration**: Complete migration from React/Webpack to Next.js App Router with TypeScript
- **Consumer Lag Heatmap**: Per-partition consumer lag visualization with color-coded severity indicators
- **Kafka AdminClient Integration**: Direct Kafka API integration for real-time consumer group monitoring
- **Alerting Engine**: Threshold-based alerting with Email, Slack, and Webhook notification channels
- **Historical Data Storage**: TimescaleDB integration for long-term metric storage and trend analysis
- **Multi-Cluster Support**: Manage and monitor multiple Kafka clusters from a single interface
- **Plugin System**: Extensible architecture for custom metric fetchers, transformers, and alert checks
- **Export & Reporting**: PDF and CSV export functionality for dashboards and metrics
- **Dark/Light Theme**: User preference-based theme switching with system preference detection

#### Enhanced Broker Metrics
- JVM heap usage and GC pause times per broker
- Disk I/O metrics (read/write bytes)
- Network throughput metrics (in/out bytes)
- Thread count and resource monitoring
- Broker filtering and comparison views

#### Cloud Connectors
- AWS MSK adapter for AWS Managed Streaming for Apache Kafka
- Confluent Cloud connector with REST API integration
- Redpanda adapter for Kafka-compatible clusters

#### Deployment
- Docker Compose setup with Kafka, Prometheus, and TimescaleDB
- Helm charts for Kubernetes deployment
- Kubernetes manifests (Deployment, Service, Ingress)
- Multi-stage Docker builds for optimized images
- Health check endpoints and probes

#### Developer Experience
- Comprehensive TypeScript types throughout
- Plugin development documentation
- CI/CD pipeline with GitHub Actions
- Example plugin demonstrating all hooks
- API documentation structure

### Changed
- **Architecture**: Migrated from Express server to Next.js API routes
- **State Management**: Simplified from Redux to React Server Components + Client Components
- **Styling**: Maintained SCSS support while adding Material-UI theme system
- **Real-time Updates**: Enhanced Socket.io integration with Next.js custom server

### Technical Details
- **Performance**: Real-time metric updates < 5 second latency
- **Scalability**: Consumer lag calculation < 2 seconds for 100+ partitions
- **Alert Latency**: < 30 seconds after threshold breach
- **Database**: TimescaleDB hypertables for efficient time-series queries

### Documentation
- Updated README with architecture diagrams and deployment instructions
- Plugin development guide (docs/PLUGINS.md)
- API endpoint documentation
- Docker and Kubernetes deployment guides

## [Previous Versions]

### Original Features (Pre-1.0.0)
- Basic Kafka monitoring dashboards (Broker, Producer, Consumer)
- Prometheus integration for metrics collection
- Real-time updates via Socket.io
- Email alerting via nodemailer
- Auth0 authentication

---

**Note**: This changelog documents the major platform upgrade. For detailed commit history, see the git log.

