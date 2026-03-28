import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailsProcessor } from './emails.processor';
import { EmailsService } from './emails.service';
import { EmailsRepository } from './emails.repository';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'email-queue',
      },
      {
        name: 'dead-email',
      }
    ),
  ],
  providers: [EmailsProcessor, EmailsService, EmailsRepository],
  exports: [EmailsService]
})
export class EmailsModule {}