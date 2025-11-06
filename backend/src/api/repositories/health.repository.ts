import { HealthStatus } from '../models/health.model';

export class HealthRepository {
  getHealthStatus(): HealthStatus {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}