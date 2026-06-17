import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto, userId: string) {
    const { title, description, status, contactId, opportunityId } = dto;
    const data = await this.prisma.task.create({
      data: {
        title,
        description,
        status,
        contactId,
        opportunityId,
        createdBy: userId,
      },
    });

    return data;
  }

  async findAll(page: number, limit: number, status?: TaskStatus) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        where: { deletedAt: null, status: status },
        include: {
          contact: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          opportunity: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),

      this.prisma.task.count({
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

  async findOne(taskId: string) {
    const data = await this.prisma.task.findUnique({
      where: { id: taskId, deletedAt: null },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!data) throw new NotFoundException('data not found');

    return data;
  }

  async update(dto: UpdateTaskDto, taskId: string, userId: string) {
    await this.findOne(taskId);

    const data = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...dto,
        updatedBy: userId,
      },
    });

    return data;
  }

  async remove(taskId: string, userId: string) {
    await this.findOne(taskId);

    await this.prisma.task.update({
      where: { id: taskId },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });
  }
}
