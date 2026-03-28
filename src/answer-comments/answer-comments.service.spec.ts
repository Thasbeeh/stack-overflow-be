import { Test, TestingModule } from '@nestjs/testing';
import { AnswerCommentsService } from './answer-comments.service';

describe('AnswerCommentsService', () => {
  let service: AnswerCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnswerCommentsService],
    }).compile();

    service = module.get<AnswerCommentsService>(AnswerCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
