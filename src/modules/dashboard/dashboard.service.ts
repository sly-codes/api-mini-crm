import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [companies, contacts, opportunities, tasks, wonAmount] =
      await Promise.all([
        this.prisma.company.count({
          where: { deletedAt: null },
        }),

        this.prisma.contact.count({
          where: { deletedAt: null },
        }),

        this.prisma.opportunity.count({
          where: { deletedAt: null },
        }),

        this.prisma.task.count({
          where: { deletedAt: null },
        }),

        this.prisma.opportunity.aggregate({
          where: { deletedAt: null, status: 'WON' },
          _sum: {
            amount: true,
          },
        }),
      ]);

    return {
      companies,
      contacts,
      opportunities,
      tasks,
      wonAmount: wonAmount._sum.amount ?? 0,
    };
  }
}
