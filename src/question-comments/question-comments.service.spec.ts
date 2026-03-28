import { Test, TestingModule } from '@nestjs/testing';
import { QuestionCommentsService } from './question-comments.service';

describe('QuestionCommentsService', () => {
  let service: QuestionCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionCommentsService],
    }).compile();

    service = module.get<QuestionCommentsService>(QuestionCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
