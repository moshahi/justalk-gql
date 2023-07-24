import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  imports: [PrismaService],
})
export class PrismaModule {}
