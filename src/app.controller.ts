import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('calc')
  calculate(@Query('a') a: string, @Query('b') b: string): string {
    return this.appService.calculate(Number(a), Number(b));
  }
}
