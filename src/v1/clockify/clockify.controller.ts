import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { BasicAuthGuard } from 'src/guards/basicAuth.guard';
import { ResponseTransformInterceptor } from 'src/interceptors/responseTransform.interceptor';
import { ClockifyService } from './clockify.service';

@Controller({ version: '1', path: 'clockify' })
@ApiTags('Clockify')
@UseGuards(BasicAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class ClockifyController {
  constructor(private clockify: ClockifyService) {}

  @Get('workspaces')
  getWorkspaces(): Observable<any> {
    return this.clockify.getWorkspaces();
  }

  @Post('start-timer')
  startTimer(@Body() body: any): Observable<any> {
    return this.clockify.startTimer(body?.projectId);
  }

  @Post('stop-timer')
  stopTimer(@Body() body: any): Observable<any> {
    return this.clockify.stopTimer(body?.projectId);
  }

  @Get('buildtime/:id')
  getBuildTime(@Param('id') id: any): Observable<any> {
    return this.clockify.getBuildTime(id);
  }
}
