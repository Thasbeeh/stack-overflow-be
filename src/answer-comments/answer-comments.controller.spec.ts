import { Test, TestingModule } from '@nestjs/testing';
import { AnswerCommentsController } from './answer-comments.controller';

describe('AnswerCommentsController', () => {
  let controller: AnswerCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerCommentsController],
    }).compile();

    controller = module.get<AnswerCommentsController>(AnswerCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
