import { Injectable } from '@nestjs/common';
import { TagsRepository } from './tags.repository';

@Injectable()
export class TagsService {
    constructor(private repo: TagsRepository) {}

    findAllTags(){
        this.repo.findAll()
    }

    createTag(name: string){
        return this.repo.create(name);
    }

    normalizeTags(tags: string[]){
        const normalizedTags = new Set(
            tags.map(t =>t.toLowerCase().trim())
        );

        return [...normalizedTags];
    }
}
