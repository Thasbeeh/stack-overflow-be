import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { QuestionsRepository } from './questions.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrentUser } from 'src/auth/interfaces/current-user.interface';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateQuestionDto } from './dtos/update-question-dto';

describe.skip('QuestionsService', () => {
  let service: QuestionsService;
  let repo: QuestionsRepository;

  const mockRepo = {
    createQuestionWithTags: jest.fn(),
    getQuestionById: jest.fn(),
    acceptAnswer: jest.fn(),
    getQuestionByIdForEdit: jest.fn(),
    updateQuestionWithTags: jest.fn(),
    updateQuestionWithoutTags: jest.fn(),
  }

  const mockPrismaService = {
    $transaction: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: QuestionsRepository,
          useValue: mockRepo,
        }
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    repo = module.get<QuestionsRepository>(QuestionsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createQuestion', () => {
    it('should return question after insertion', async () => {
      const dto = { title: 'title', content: 'content', tags: ['tag1', 'tag2'] };
      const user = { userId: 'user1', username: 'username', email: 'user@user.com', role: 'USER' };
      const expectedResult = { id: 'question1', title: 'title', content: 'content', tags: ['tag1', 'tag2'] };
      mockRepo.createQuestionWithTags.mockResolvedValue(expectedResult);

      const result = await service.createQuestion(dto.title, dto.content, user, dto.tags);
      expect(result).toBe(expectedResult);
      expect(repo.createQuestionWithTags).toHaveBeenCalledWith(
        dto.title, dto.content, user.userId, dto.tags,
      );
    });
  });

  describe('findUniqueById', () => {
    it('should return question if found', async () => {
      const question = { id: 'q1' };
      mockRepo.getQuestionById.mockResolvedValue(question);
      await expect(
        service.findUniqueById('q1')
      ).resolves.toEqual({ id: 'q1' });
      expect(mockRepo.getQuestionById).toHaveBeenCalledWith('q1');
    })

    it('should return question if not found', async () => {
      mockRepo.getQuestionById.mockResolvedValue(null);
      await expect(
        service.findUniqueById('q1')
      ).rejects.toThrow(NotFoundException);
      expect(mockRepo.getQuestionById).toHaveBeenCalledWith('q1');
    })
  })

  describe('acceptAnswer', () => {
    let questionId: string;
    let answerId: string;
    let user: CurrentUser;

    beforeEach(() => {
      jest.clearAllMocks();
      questionId = 'question1';
      answerId = 'answer1';
      user = { userId: 'user1', username: 'username', email: 'user@user.com', role: 'USER' };
    })

    it('should return question with accepted answer Id', async () => {
      const expectedResult = Array({ id: 'question1', acceptedAnswerId: 'answer1' });
      mockRepo.acceptAnswer.mockResolvedValue(expectedResult);
      await expect(
        service.acceptAnswer(questionId, answerId, user)
      ).resolves.toBe(expectedResult);
    });

    test('throw if no answer accepted', async () => {
      mockRepo.acceptAnswer.mockResolvedValue([]);
      await expect(
        service.acceptAnswer(questionId, answerId, user)
      ).rejects.toThrow(ForbiddenException);
    })
  });

  describe('updateQuestion', () => {
    let mockTx: any;
    let attrs: Partial<UpdateQuestionDto>

    const user: CurrentUser = {
      userId: 'user1',
      username: 'username',
      email: 'user@user.com',
      role: 'USER',
    };

    beforeEach(() => {
      jest.clearAllMocks();
      mockTx = {};
      mockPrismaService.$transaction.mockImplementation(cb => cb(mockTx));
    });

    it('should update question with tags', async () => {
      const question = { id: 'question1', authorId: 'user1' };
      mockRepo.getQuestionByIdForEdit.mockResolvedValue(question);
      attrs = { content: 'content', tags: ['tag1', 'tag2'] };
      const expected = {
        id: 'question1',
        content: 'content',
        tags: ['tag1', 'tag2'],
      };
      mockRepo.updateQuestionWithTags.mockResolvedValue(expected);

      const result = await service.updateQuestion('question1', attrs, user);
      expect(mockRepo.updateQuestionWithTags).toHaveBeenCalledWith(
        'question1',
        { content: 'content' },
        ['tag1', 'tag2'],
        mockTx
      );
      expect(result).toEqual(expected);
      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should update question without tags', async () => {
      const question = { id: 'question1', authorId: 'user1' };
      mockRepo.getQuestionByIdForEdit.mockResolvedValue(question);
      attrs = { content: 'content2' };
      const expected = {
        id: 'question1',
        content: 'content2',
      };
      mockRepo.updateQuestionWithoutTags.mockResolvedValue(expected);

      const result = await service.updateQuestion('question1', attrs, user);
      expect(mockRepo.updateQuestionWithoutTags).toHaveBeenCalledWith(
        'question1',
        { content: 'content2' },
        mockTx
      );
      expect(result).toEqual(expected);
      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should throw if question not found', async () => {
      mockRepo.getQuestionByIdForEdit.mockResolvedValue(null);

      await expect(
        service.updateQuestion('q1', { content: 'x' }, user)
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should throw if user is not owner', async () => {
      mockRepo.getQuestionByIdForEdit.mockResolvedValue({
        id: 'q1',
        authorId: 'someone-else',
      });

      await expect(
        service.updateQuestion('q1', { content: 'x' }, user)
      ).rejects.toThrow(ForbiddenException);
      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should throw if no fields provided', async () => {
      mockRepo.getQuestionByIdForEdit.mockResolvedValue({
        id: 'q1',
        authorId: 'user1',
      });

      await expect(
        service.updateQuestion('q1', {}, user)
      ).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
    });
  });
});
