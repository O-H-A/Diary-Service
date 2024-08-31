import { Controller, Get, InternalServerErrorException } from '@nestjs/common';

@Controller('health')
export class HealthController {
  constructor() {}

  @Get()
  async checkHealth() {
    const result = { message: 'Healthy!!' };
    throw new InternalServerErrorException('알 수 없는 에러');
    return result;
  }
}
