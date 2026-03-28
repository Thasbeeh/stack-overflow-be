import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { DeleteQuestionAppService } from './orchestrators/delete-question-app.service';

describe('QuestionsController', () => {
  let controller: QuestionsController;
  let service: QuestionsService;
  let deleteQuestionService: DeleteQuestionAppService;

  const mockQuestionService = {
    createQuestion: jest.fn(),
    findUniqueById: jest.fn(),
    updateQuestion: jest.fn(),
    acceptAnswer: jest.fn(),
  };

  const mockDeleteQuestionAppService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        {
          provide: QuestionsService,
          useValue: mockQuestionService
        },
        {
          provide: DeleteQuestionAppService,
          useValue: mockDeleteQuestionAppService,
        }
      ]
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
    service = module.get<QuestionsService>(QuestionsService);
    deleteQuestionService = module.get<DeleteQuestionAppService>(DeleteQuestionAppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CreateQuestion', () => {
    it('should call service and return result', async () => {
      const dto = { title: 'title', content: 'content', tags: ['tag1', 'tag2'] };
      const user = { userId: 'user1', username: 'username', email: 'user@user.com', role: 'USER' };
      const expectedResult = { id: 'question1' };
      mockQuestionService.createQuestion.mockResolvedValue(expectedResult);
  
      const result = await controller.createQuestion(dto, user);
      expect(service.createQuestion).toHaveBeenCalledWith(dto.title, dto.content, user, dto.tags);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getQuestionById', () => {
    it('should return the question having Id', async () => {
      const id = 'question1';
      const expectedResult = { id: 'question1' };
      mockQuestionService.findUniqueById.mockResolvedValue(expectedResult);

      const result = await controller.getQuestionById(id);
      expect(service.findUniqueById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    })
  });

  describe('editQuestion', () => {
    it('should return edited question', async () => {
      const id = 'question1';
      const editDto = { content: 'content', tags: ['tag1', 'tag2'] };
      const user = { userId: 'user1', username: 'username', email: 'user@user.com', role: 'USER' };
      const expectedResult = { title: 'title', content: 'content', tags: ['tag1', 'tag2'] };
      mockQuestionService.updateQuestion.mockResolvedValue(expectedResult);

      const result = await controller.editQuestion(id, editDto, user);
      expect(service.updateQuestion).toHaveBeenCalledWith(id, editDto, user);
      expect(result).toBe(expectedResult);
    })
  });

  describe('deleteQuestion', () => {
    it('return question after deletion', async () => {
      const id = 'question1';
      const user = { userId: 'user1', username: 'username', email: 'user@user.com', role: 'USER' };
      const expectedResult = { id: 'question1' };
      mockDeleteQuestionAppService.execute.mockResolvedValue(expectedResult);

      const result = await controller.deleteQuestion(id, user);
      expect(deleteQuestionService.execute).toHaveBeenCalledWith(id, user);
      expect(result).toBe(expectedResult);
    })
  });

  describe('acceptAnswer', () => {
    test('should return question with accepted answer Id', async () => {
      const questionId = 'question1';
      const answerId = 'answer1'
      const user = { userId: 'user1', username: 'username', email: 'user@user.com', role: 'USER' };
      const expectedResult = { id: 'question1', acceptedAnswerId: 'answer1' };
      mockQuestionService.acceptAnswer.mockResolvedValue(expectedResult);

      const result = await controller.acceptAnswer(questionId, answerId, user);
      expect(result).toBe(expectedResult);
      expect(result).toMatchObject({ acceptedAnswerId: 'answer1' });
    })
  })
})
