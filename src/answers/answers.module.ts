import { Module } from '@nestjs/common';
import { AnswersRepository } from './answers.repository';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';

@Module({
    controllers: [AnswersController],
    providers: [AnswersRepository, AnswersService],
    exports: [AnswersRepository],
})
export class AnswersModule {}
