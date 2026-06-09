import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
// import { JwtGuard } from './common/guards/jwt-guard';
import { CurrentUser } from './common/decorators/current-user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @UseGuards(JwtGuard)
  // @Get()
  // getHello(@Req() req): string {
  //   return this.appService.getHello(req.user.email);
  // }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
