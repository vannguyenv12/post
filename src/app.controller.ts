import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // Dependency Injection
  constructor(private readonly appService: AppService) {}

  @Get() // Decorator
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/calc')
  sayHi() {
    return this.appService.calc();
  }
}
