import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebhooksService } from '../webhooks/webhooks.service';

@Injectable()
export class ClockifyService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
    private readonly logger: PinoLogger,
    private webhooks: WebhooksService,
  ) {}

  // Start new timer for projectID
  addClockifyTimer(projectId: string, startTime: string) {
    return this.prisma.clockifyTimer.create({ data: { projectId, startTime } });
  }

  // Stop time for projectID
  removeClockifyTimer(projectID: string) {
    return this.prisma.clockifyTimer.delete({
      where: { projectId: projectID },
    });
  }

  // Get list of workspaces
  getWorkspaces(): Observable<any> {
    return this.http.get('workspaces');
  }

  // Function to run when timers are started
  startTimer(projectId: string): Observable<any> {
    if (projectId === null) {
      throw new BadRequestException('Must provide projectId');
    }

    // kick off the webhook for the timer start
    this.webhooks.sendDiscordMessage(`Clockify Project Started - ${projectId}`);
    return this.http.post(
      `/workspaces/${process.env.CLOCKIFY_WORKSPACE_ID}/time-entries`,
      {
        projectId,
      },
    );
  }

  // Function to run when timers are stopped
  stopTimer(projectId: string): Observable<any> {
    this.webhooks.sendDiscordMessage(`Clockify Project Stopped - ${projectId}`);
    return this.http.patch(
      `/workspaces/${process.env.CLOCKIFY_WORKSPACE_ID}/user/${process.env.CLOCKIFY_USER_ID}/time-entries`,
      {
        end: new Date().toISOString(),
      },
    );
  }

  // Get the build time of the projectID specified
  getBuildTime(projectId: string): Observable<any> {
    if (projectId === null) {
      throw new BadRequestException('Must provide clockify project_id');
    }

    return this.http.get(
      `workspaces/${process.env.CLOCKIFY_WORKSPACE_ID}/projects/${projectId}`,
    );
  }
}
