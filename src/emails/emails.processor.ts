import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue, UnrecoverableError } from 'bullmq';
import { EmailsRepository } from './emails.repository';

@Processor('email-queue')
export class EmailsProcessor extends WorkerHost {
    constructor(
        @InjectQueue('dead-email') private readonly deadLetterQueue: Queue,
        private repo: EmailsRepository,
    ) {
        super();
    }

    async process(job: Job<any>) {
        const { userId } = job.data;
        if(!userId) throw new UnrecoverableError('Missing userId');

        const alreadySent = await this.repo.alreadySent(userId);
        if(!alreadySent) return;

        try {
            console.log('Sending email to user:', job.data);
        } catch (err) {
            throw err;
        }
    }

    @OnWorkerEvent('active')
    onActive(job: Job){
        console.log('🚀 Job started:', job.id);
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        console.log('✅ Job completed:', job.id);
    }

    @OnWorkerEvent('failed')
    async onFailed(job: Job, err: Error){
        console.error('❌ Job failed:', {
            jobId: job.id,
            name: job.name,
            data: job.data,
            attemptsMade: job.attemptsMade,
            maxAttempts: job.opts.attempts,
            error: err.message,
            stack: err.stack
        });

        const maxAttempts = job.opts.attempts ?? 1;
        if (job.attemptsMade >= maxAttempts) {
            await this.deadLetterQueue.add('dead-email', {
                originalJobId: job.id,
                data: job.data,
                error: err.message,
            },
            {
                jobId: `dead-${job.id}`
            });
        }
    }
}