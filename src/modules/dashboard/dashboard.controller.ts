import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/common/guards/jwt-guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getStats() {
    return this.dashboardService.getStats();
  }
}
