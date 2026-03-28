import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class EmailsService {
  constructor(
    @InjectQueue('email-queue') private readonly emailQueue: Queue,
  ) {}

  async sendWelcomeEmail(userId: string) {
    await this.emailQueue.add('send-welcome-email',
        { userId },
        {   
            jobId: `email-${userId}`,
            attempts: 5,
            backoff: { type: 'exponential', delay: 3000 },
            removeOnComplete: true,
            removeOnFail: false, // keep failed for inspection
        }
    );
  }
}