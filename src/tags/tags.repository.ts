import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientLike } from "src/types/prisma-client.type";

@Injectable()
export class TagsRepository{
    constructor(private prisma: PrismaService){}

    findAll(){
        return this.prisma.tag.findFirst()
    }

    findMany(names: string[], db: PrismaClientLike = this.prisma){
        return db.tag.findMany({
            where: {
                name: { in: names }
            }
        });
    }

    create(name: string){
        return this.prisma.tag.upsert({
            where: { name },
            create: { name },
            update: {}
        })
    }

    createMany(names: string[], db: PrismaClientLike = this.prisma){
        return db.tag.createMany({
            data: names.map(name => ({ name })),
            skipDuplicates: true,
        });
    }
}