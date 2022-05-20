import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MinecraftService } from './minecraft.service';
import { MinecraftServerController } from './minecraftServer.controller';

@Module({
  controllers: [MinecraftServerController],
  imports: [],
  providers: [MinecraftService, PrismaService],
})
export class MinecraftModule {}
