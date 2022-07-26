import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { BasicAuthGuard } from 'src/guards/basicAuth.guard';
import { ResponseTransformInterceptor } from 'src/interceptors/responseTransform.interceptor';
import { ClockifyService } from './clockify.service';
import { StartTimerDto } from './dto';

@Controller({ version: '1', path: 'clockify' })
@ApiTags('Clockify')
@ApiSecurity('x-api-key')
@UseGuards(BasicAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class ClockifyController {
  constructor(private clockify: ClockifyService) {}

  @Get('workspaces')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get list of workspaces' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getWorkspaces(): Observable<any> {
    return this.clockify.getWorkspaces();
  }

  @Get('projects')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get list of projects' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProjects(
    @Param('archived') archived: boolean,
    @Param('page-size') pageSize: number,
  ): Observable<any> {
    return this.clockify.getProjects(archived, pageSize);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Start timer of provided project' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Must provide ProjectID',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('start-timer')
  async startTimer(@Body('projectID') projectID: StartTimerDto): Promise<any> {
    const data = this.clockify.startTimer(projectID);
    return data;
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
