import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCompanyDto, userId: string) {
    const company = await this.prisma.company.create({
      data: {
        name: dto.name,
        email: dto.email,
        contact: dto.contact,
        website: dto.website,
        logo: dto.logo,
        ncc: dto.ncc,
        location: dto.location,
        activity: dto.activity,
        createdBy: userId,
      },
    });

    return company;
  }

  async findAll(page: number, limit: number) {
    
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.company.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        where: {
          deletedAt: null,
        },
      }),

      this.prisma.company.count({
        where: { deletedAt: null },
      }),
    ]);

    return {
      data: data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: {
        id: companyId,
        deletedAt: null,
      },
    });

    if(!company) throw new NotFoundException('Company not found')

    return company;
  }

  async update(companyId: string, dto: UpdateCompanyDto, userId: string) {
    await this.findOne(companyId);

    return await this.prisma.company.update({
      where: {
        id: companyId,
      },
      data: {...dto, updatedBy: userId},
    });
  }

  async remove(companyId: string, userId: string) {
    await this.findOne(companyId);

    await this.prisma.company.update({
      where: {
        id: companyId,
        deletedAt: null,
      },

      data: {deletedAt: new Date(), deletedBy: userId}
    });
  }
}
