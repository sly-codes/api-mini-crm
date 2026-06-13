import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactDto, userId: string) {
    const { firstName, lastName, email, contact, position, companyId } = dto;

    const data = await this.prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        contact,
        position,
        companyId,
        createdBy: userId,
      },
    });

    return data;
  }

  async findAll(page: number, limit: number, companyId?: string) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        where: { deletedAt: null, companyId: companyId },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      this.prisma.contact.count({
        where: { deletedAt: null, companyId: companyId },
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

  async findOne(contactId: string) {
    const data = await this.prisma.contact.findUnique({
      where: { id: contactId, deletedAt: null },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!data) throw new NotFoundException('Contact not found');

    return data;
  }

  async update(contactId: string, dto: UpdateContactDto, userId: string) {
    await this.findOne(contactId);

    const data = await this.prisma.contact.update({
      where: { id: contactId, deletedAt: null },
      data: {
        ...dto,
        updatedBy: userId,
      },
    });

    return data;
  }

  async remove(contactId: string, userId: string) {
    await this.findOne(contactId);

    await this.prisma.contact.update({
      where: { id: contactId, deletedAt: null },
      data: { deletedBy: userId, deletedAt: new Date() },
    });
  }
}
