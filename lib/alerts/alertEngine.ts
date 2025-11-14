import { AlertRule, AlertEvent } from '../../types';

export interface MetricValue {
  metric: string;
  value: number;
  labels?: Record<string, string>;
  timestamp: number;
}

export interface AlertEvaluationResult {
  ruleId: string;
  ruleName: string;
  fired: boolean;
  currentValue: number;
  threshold: number;
  operator: string;
  timestamp: number;
}

export class AlertEngine {
  private rules: Map<string, AlertRule> = new Map();
  private alertHistory: AlertEvent[] = [];

  /**
   * Register or update an alert rule
   */
  addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove an alert rule
   */
  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  /**
   * Get all alert rules
   */
  getRules(): AlertRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Get a specific alert rule
   */
  getRule(ruleId: string): AlertRule | undefined {
    return this.rules.get(ruleId);
  }

  /**
   * Evaluate a metric value against all active alert rules
   */
  evaluateMetric(metricValue: MetricValue): AlertEvaluationResult[] {
    const results: AlertEvaluationResult[] = [];

    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;

      // Check if this rule applies to this metric
      if (rule.metric !== metricValue.metric) continue;

      // Evaluate the threshold condition
      const fired = this.evaluateThreshold(
        metricValue.value,
        rule.threshold,
        rule.operator
      );

      if (fired) {
        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          fired: true,
          currentValue: metricValue.value,
          threshold: rule.threshold,
          operator: rule.operator,
          timestamp: metricValue.timestamp,
        });

        // Record alert event
        this.recordAlertEvent(rule.id, metricValue.value, metricValue.timestamp);
      }
    }

    return results;
  }

  /**
   * Evaluate threshold condition
   */
  private evaluateThreshold(
    value: number,
    threshold: number,
    operator: AlertRule['operator']
  ): boolean {
    switch (operator) {
      case 'gt':
        return value > threshold;
      case 'gte':
        return value >= threshold;
      case 'lt':
        return value < threshold;
      case 'lte':
        return value <= threshold;
      case 'eq':
        return value === threshold;
      default:
        return false;
    }
  }

  /**
   * Record an alert event
   */
  private recordAlertEvent(
    ruleId: string,
    value: number,
    timestamp: number
  ): void {
    // Check if there's already a firing alert for this rule
    const existingFiring = this.alertHistory.find(
      (event) => event.ruleId === ruleId && event.status === 'firing'
    );

    if (!existingFiring) {
      // Create new firing alert
      const alertEvent: AlertEvent = {
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ruleId,
        status: 'firing',
        value,
        timestamp,
      };
      this.alertHistory.push(alertEvent);
    } else {
      // Update existing alert
      existingFiring.value = value;
      existingFiring.timestamp = timestamp;
    }
  }

  /**
   * Resolve an alert (mark as resolved)
   */
  resolveAlert(alertId: string): void {
    const alert = this.alertHistory.find((event) => event.id === alertId);
    if (alert && alert.status === 'firing') {
      alert.status = 'resolved';
      alert.resolvedAt = Date.now();
    }
  }

  /**
   * Get alert history
   */
  getAlertHistory(ruleId?: string): AlertEvent[] {
    if (ruleId) {
      return this.alertHistory.filter((event) => event.ruleId === ruleId);
    }
    return [...this.alertHistory].sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get currently firing alerts
   */
  getFiringAlerts(): AlertEvent[] {
    return this.alertHistory.filter((event) => event.status === 'firing');
  }
}

// Singleton instance
let alertEngineInstance: AlertEngine | null = null;

export function getAlertEngine(): AlertEngine {
  if (!alertEngineInstance) {
    alertEngineInstance = new AlertEngine();
  }
  return alertEngineInstance;
}

