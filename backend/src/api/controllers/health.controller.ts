import { Request, Response } from 'express';
import { HealthService } from '../services/health.service';

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  check = async (req: Request, res: Response) => {
    const status = this.healthService.getHealthStatus();
    res.status(200).json(status);
  };
}