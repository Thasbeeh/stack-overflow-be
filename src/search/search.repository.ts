import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SearchRepository{
    constructor(private prisma: PrismaService){}

    questionFts(searchText: string) {
        return this.prisma.$queryRaw`
            SELECT
                id,
                title,
                content,
                "authorId",
                "voteCount",
                "acceptedAnswerId",
                "createdAt",
                "updatedAt"
            FROM "Question"
            WHERE search_vector @@ plainto_tsquery('english', ${searchText}) AND id='1'
            ORDER BY ts_rank(search_vector, plainto_tsquery('english', ${searchText})) DESC;`;
    }
}