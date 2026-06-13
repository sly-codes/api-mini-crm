import { Injectable, NotFoundException } from '@nestjs/common';
import { OpportunityStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOpportunityDto, userId: string) {
    const { title, amount, closeDate, status, contactId, companyId } = dto;

    const data = await this.prisma.opportunity.create({
      data: {
        title,
        amount,
        closeDate: new Date(closeDate),
        status,
        contactId,
        companyId,
        createdBy: userId,
      },
    });

    return data;
  }

  async findAll(page: number, limit: number, status?: OpportunityStatus) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.opportunity.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        where: { deletedAt: null, status: status },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          contact: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),

      this.prisma.opportunity.count({
        where: { deletedAt: null, status: status },
      }),
    ]);

    return {
      data: data,
      meta: {
        total: total,
        page: page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(opportunityId: string) {
    const data = await this.prisma.opportunity.findUnique({
      where: { id: opportunityId, deletedAt: null },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!data) throw new NotFoundException('Opportunity not found');

    return data;
  }

  async update(
    dto: UpdateOpportunityDto,
    userId: string,
    opportunityId: string,
  ) {
    await this.findOne(opportunityId);

    const { closeDate, ...rest } = dto;

    const data = await this.prisma.opportunity.update({
      where: { id: opportunityId, deletedAt: null },
      data: {
        ...rest,
        ...(closeDate ? { closeDate: new Date(closeDate) } : {}),
        updatedBy: userId,
      },
    });

    return data;
  }

  async remove(opportunityId: string, userId: string) {
    await this.findOne(opportunityId);

    await this.prisma.opportunity.update({
      where: { id: opportunityId, deletedAt: null },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
  }
}
