import { HealthRepository } from '../repositories/health.repository';
import { HealthStatus } from '../models/health.model';

export class HealthService {
  private healthRepository: HealthRepository;

  constructor() {
    this.healthRepository = new HealthRepository();
  }

  getHealthStatus(): HealthStatus {
    return this.healthRepository.getHealthStatus();
  }
}