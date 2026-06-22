import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
    }),
    PrismaModule,
    AuthModule,
    CompaniesModule,
    ContactsModule,
    OpportunitiesModule,
    TasksModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
