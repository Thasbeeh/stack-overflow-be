import { Test, TestingModule } from "@nestjs/testing";
import { DeleteQuestionAppService } from "./delete-question-app.service";
import { QuestionsRepository } from "../questions.repository";
import { AnswersRepository } from "src/answers/answers.repository";
import { AnswerCommentsRepository } from "src/answer-comments/answer-comments.repository";
import { PrismaService } from "src/prisma/prisma.service";
import { CurrentUser } from "src/auth/interfaces/current-user.interface";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { AnswerVotesRepository } from "src/votes/repositories/answer-votes.repository";

describe('DeleteQuestionAppService', () => {
    let service: DeleteQuestionAppService;

    const mockQuestionsRepo = {
        softDeleteQuestionCommentsVotes: jest.fn(),
        getQuestionAndAnswerIdsForDelete: jest.fn()
    }

    const mockAnswersRepo = {
        softDeleteByQuestionId: jest.fn(),
    }

    const mockAnswerCommentsRepo = {
        softDeleteAllAnswerComments: jest.fn(),
    }

    const mockAnswerVotesRepo = {
        deleteAll: jest.fn(),
    }

    const mockPrismaService = {
        $transaction: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DeleteQuestionAppService,
                {
                    provide: QuestionsRepository,
                    useValue: mockQuestionsRepo
                },
                {
                    provide: AnswersRepository,
                    useValue: mockAnswersRepo,
                },
                {
                    provide: AnswerCommentsRepository,
                    useValue: mockAnswerCommentsRepo,
                },
                {
                    provide: AnswerVotesRepository,
                    useValue: mockAnswerVotesRepo
                },
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ]
        }).compile();

        service = module.get<DeleteQuestionAppService>(DeleteQuestionAppService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('execute', () => {
        let mockTx: any;
        let user: CurrentUser;

        beforeEach(() => {
            jest.resetAllMocks();
            mockTx = {};
            mockPrismaService.$transaction.mockImplementation(callback => callback(mockTx));
        })

        it('return deleted question having no answers', async () => {
            const question = { id: 'q1', answers: [] };
            user = { 
                userId: 'user1',
                username: 'username',
                email: 'user@user.com',
                role: 'ADMIN'
            };
            const expectedResult = { id: 'q1', answers: [] };
            mockQuestionsRepo.getQuestionAndAnswerIdsForDelete.mockResolvedValue(question);
            mockQuestionsRepo.softDeleteQuestionCommentsVotes.mockResolvedValue(question);
            
            await expect(
                service.execute('q1', user)
            ).resolves.toEqual(expectedResult);
            expect(mockAnswersRepo.softDeleteByQuestionId).not.toHaveBeenCalled();
            expect(mockAnswerCommentsRepo.softDeleteAllAnswerComments).not.toHaveBeenCalled();
            expect(mockAnswerVotesRepo.deleteAll).not.toHaveBeenCalled();

            expect(mockQuestionsRepo.getQuestionAndAnswerIdsForDelete).toHaveBeenCalledWith('q1', mockTx);
            expect(mockQuestionsRepo.softDeleteQuestionCommentsVotes).toHaveBeenCalledWith('q1', user.userId, mockTx);
            expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
        })

        it('return deleted question having answers', async () => {
            const question = {
                id: 'q1',
                answers: [
                    { id: 'a1' }
                ]
            };
            user = { 
                userId: 'user1',
                username: 'username',
                email: 'user@user.com',
                role: 'ADMIN'
            };
            const expectedResult = {
                id: 'q1',
                answers: [
                    { id: 'a1' }
                ]
            };
            mockQuestionsRepo.getQuestionAndAnswerIdsForDelete.mockResolvedValue(question);
            mockAnswersRepo.softDeleteByQuestionId.mockResolvedValue({ count: 1 });
            mockAnswerCommentsRepo.softDeleteAllAnswerComments.mockResolvedValue({ count: 0 });
            mockAnswerVotesRepo.deleteAll.mockResolvedValue(null);
            mockQuestionsRepo.softDeleteQuestionCommentsVotes.mockResolvedValue(question);
            
            await expect(
                service.execute('q1', user)
            ).resolves.toEqual(expectedResult);
            expect(mockQuestionsRepo.getQuestionAndAnswerIdsForDelete).toHaveBeenCalledWith('q1', mockTx);
            expect(mockAnswersRepo.softDeleteByQuestionId).toHaveBeenCalledWith(
                'q1',
                user.userId,
                mockTx
            );
            expect(mockAnswerCommentsRepo.softDeleteAllAnswerComments).toHaveBeenCalledWith(
                ['a1'],
                user.userId,
                mockTx
            );
            expect(mockAnswerVotesRepo.deleteAll).toHaveBeenCalledWith(['a1'], mockTx);
            expect(mockQuestionsRepo.softDeleteQuestionCommentsVotes).toHaveBeenCalledWith(
                'q1',
                user.userId,
                mockTx
            );
            expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
        });

        it('return deleted question without accepted answer if done by author', async () => {
            const question = {
                id: 'q1',
                authorId: 'user1',
                acceptedAnswerId: null,
                answers: []
            };

            user = { 
                userId: 'user1',
                username: 'username',
                email: 'user@user.com',
                role: 'USER'
            };

            const expectedResult = {
                id: 'q1',
                authorId: 'user1',
                acceptedAnswerId: null,
                answers: []
            };

            mockQuestionsRepo.getQuestionAndAnswerIdsForDelete.mockResolvedValue(question);
            mockQuestionsRepo.softDeleteQuestionCommentsVotes.mockResolvedValue(question);
            
            await expect(
                service.execute('q1', user)
            ).resolves.toEqual(expectedResult);
            expect(mockQuestionsRepo.getQuestionAndAnswerIdsForDelete).toHaveBeenCalledWith('q1', mockTx);
            expect(mockQuestionsRepo.softDeleteQuestionCommentsVotes).toHaveBeenCalledWith('q1', user.userId, mockTx);
            expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
        });

        it('throw unauthorized action', async () => {
            const question = {
                id: 'q1',
                authorId: 'user1',
                acceptedAnswerId: null,
                answers: []
            };

            user = { 
                userId: 'user2',
                username: 'username',
                email: 'user@user.com',
                role: 'USER'
            };

            mockQuestionsRepo.getQuestionAndAnswerIdsForDelete.mockResolvedValue(question);
            
            await expect(
                service.execute('q1', user)
            ).rejects.toThrow(ForbiddenException);
            expect(mockQuestionsRepo.getQuestionAndAnswerIdsForDelete).toHaveBeenCalledWith('q1', mockTx);
            expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
        });

        it('throw if question not found', async () => {
            user = {
                userId: 'user2',
                username: 'username',
                email: 'user@user.com',
                role: 'USER'
            };
            mockQuestionsRepo.getQuestionAndAnswerIdsForDelete.mockResolvedValue(null);

            await expect(
                service.execute('q1', user)
            ).rejects.toThrow(NotFoundException);
            expect(mockQuestionsRepo.getQuestionAndAnswerIdsForDelete).toHaveBeenCalledWith('q1', mockTx);
            expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
        });
    })
})