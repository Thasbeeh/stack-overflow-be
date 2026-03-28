import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class EmailsRepository {
    constructor(private prisma: PrismaService){}

    alreadySent(jobId: string){
        return this.prisma.welcomeEmailJob.findUnique({
            where: { jobId },
        });
    }
}