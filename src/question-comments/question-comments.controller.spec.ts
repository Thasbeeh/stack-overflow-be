import { Test, TestingModule } from '@nestjs/testing';
import { QuestionCommentsController } from './question-comments.controller';

describe('QuestionCommentsController', () => {
  let controller: QuestionCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionCommentsController],
    }).compile();

    controller = module.get<QuestionCommentsController>(QuestionCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
