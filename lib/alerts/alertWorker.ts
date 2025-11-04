import { getAlertEngine, MetricValue, AlertEvaluationResult } from './alertEngine';
import { throttledSendEmail } from './email';
import { AlertRule } from '@/types';

interface NotificationChannel {
  type: 'email' | 'slack' | 'webhook';
  config: {
    email?: string;
    slackWebhookUrl?: string;
    webhookUrl?: string;
  };
}

export class AlertWorker {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private checkInterval: number = 30000; // 30 seconds

  /**
   * Start the alert worker
   */
  start(intervalMs: number = 30000): void {
    if (this.isRunning) {
      console.warn('Alert worker is already running');
      return;
    }

    this.checkInterval = intervalMs;
    this.isRunning = true;

    // Run immediately
    this.checkAlerts();

    // Then run on interval
    this.intervalId = setInterval(() => {
      this.checkAlerts();
    }, this.checkInterval);

    console.log(`Alert worker started (checking every ${intervalMs}ms)`);
  }

  /**
   * Stop the alert worker
   */
  stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('Alert worker stopped');
  }

  /**
   * Check alerts by evaluating metrics
   */
  async checkAlerts(): Promise<void> {
    const alertEngine = getAlertEngine();
    const rules = alertEngine.getRules().filter((rule) => rule.enabled);

    if (rules.length === 0) {
      return;
    }

    // Fetch current metrics (this would typically come from Prometheus)
    // For now, we'll use a placeholder - in production this would query Prometheus
    const metrics = await this.fetchCurrentMetrics(rules);

    for (const metric of metrics) {
      const results = alertEngine.evaluateMetric(metric);

      for (const result of results) {
        if (result.fired) {
          await this.handleAlert(result, rules);
        }
      }
    }
  }

  /**
   * Fetch current metrics from Prometheus
   * This is a placeholder - in production, this would query Prometheus API
   */
  private async fetchCurrentMetrics(
    rules: AlertRule[]
  ): Promise<MetricValue[]> {
    const metrics: MetricValue[] = [];
    const uniqueMetrics = [...new Set(rules.map((rule) => rule.metric))];

    // TODO: Replace with actual Prometheus queries
    // For now, return empty array - this would be implemented with axios calls to Prometheus
    // const prometheusUrl = process.env.PROMETHEUS_URL || 'http://localhost:9090';
    // for (const metric of uniqueMetrics) {
    //   const response = await axios.get(`${prometheusUrl}/api/v1/query`, {
    //     params: { query: metric }
    //   });
    //   // Process response and create MetricValue objects
    // }

    return metrics;
  }

  /**
   * Handle a fired alert
   */
  private async handleAlert(
    result: AlertEvaluationResult,
    rules: AlertRule[]
  ): Promise<void> {
    const rule = rules.find((r) => r.id === result.ruleId);
    if (!rule) return;

    const alertMessage = this.formatAlertMessage(result, rule);

    // Send notifications via all configured channels
    for (const channel of rule.notificationChannels) {
      await this.sendNotification(channel, alertMessage, result);
    }
  }

  /**
   * Format alert message
   */
  private formatAlertMessage(
    result: AlertEvaluationResult,
    rule: AlertRule
  ): string {
    return `Alert: ${rule.name}
Metric: ${rule.metric}
Current Value: ${result.currentValue}
Threshold: ${result.operator} ${result.threshold}
Time: ${new Date(result.timestamp).toISOString()}`;
  }

  /**
   * Send notification via specified channel
   */
  private async sendNotification(
    channelId: string,
    message: string,
    result: AlertEvaluationResult
  ): Promise<void> {
    // TODO: Load channel configuration from database or config
    // For now, we'll use email as default
    const channelConfig = this.getChannelConfig(channelId);

    if (!channelConfig) {
      console.warn(`Channel ${channelId} not found`);
      return;
    }

    switch (channelConfig.type) {
      case 'email':
        if (channelConfig.config.email) {
          await throttledSendEmail(
            channelConfig.config.email,
            `Metamorphosis Alert: ${result.ruleName}`,
            message
          );
        }
        break;

      case 'slack':
        await this.sendSlackNotification(
          channelConfig.config.slackWebhookUrl!,
          message,
          result
        );
        break;

      case 'webhook':
        await this.sendWebhookNotification(
          channelConfig.config.webhookUrl!,
          message,
          result
        );
        break;
    }
  }

  /**
   * Get channel configuration (placeholder - would come from database)
   */
  private getChannelConfig(channelId: string): NotificationChannel | null {
    // TODO: Load from database
    // For now, return default email channel
    if (channelId.startsWith('email:')) {
      return {
        type: 'email',
        config: {
          email: channelId.replace('email:', ''),
        },
      };
    }

    if (channelId.startsWith('slack:')) {
      return {
        type: 'slack',
        config: {
          slackWebhookUrl: channelId.replace('slack:', ''),
        },
      };
    }

    if (channelId.startsWith('webhook:')) {
      return {
        type: 'webhook',
        config: {
          webhookUrl: channelId.replace('webhook:', ''),
        },
      };
    }

    return null;
  }

  /**
   * Send Slack notification
   */
  private async sendSlackNotification(
    webhookUrl: string,
    message: string,
    result: AlertEvaluationResult
  ): Promise<void> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `🚨 *Metamorphosis Alert: ${result.ruleName}*`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: message,
              },
            },
          ],
        }),
      });

      if (!response.ok) {
        console.error('Failed to send Slack notification:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending Slack notification:', error);
    }
  }

  /**
   * Send webhook notification
   */
  private async sendWebhookNotification(
    webhookUrl: string,
    message: string,
    result: AlertEvaluationResult
  ): Promise<void> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alert: result.ruleName,
          message,
          value: result.currentValue,
          threshold: result.threshold,
          timestamp: result.timestamp,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send webhook notification:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending webhook notification:', error);
    }
  }
}

// Singleton instance
let alertWorkerInstance: AlertWorker | null = null;

export function getAlertWorker(): AlertWorker {
  if (!alertWorkerInstance) {
    alertWorkerInstance = new AlertWorker();
  }
  return alertWorkerInstance;
}

