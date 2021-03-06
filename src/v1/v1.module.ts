import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClockifyModule } from './clockify/clockify.module';
import { GithubModule } from './github/github.module';
import { GraphqlModule } from './graphql/graphql.module';
import { ImagesModule } from './images/images.module';
import { MapModule } from './maps/maps.module';
import { MinecraftModule } from './minecraft/minecraft.module';
import { V1Controller } from './v1.controller';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register(),
    LoggerModule.forRoot(),
    GithubModule,
    ClockifyModule,
    ImagesModule,
    MinecraftModule,
    MapModule,
    WebhooksModule,
    GraphqlModule,
  ],
  controllers: [V1Controller],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class V1Module {}
