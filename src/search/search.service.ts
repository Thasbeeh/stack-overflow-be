import { Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';

@Injectable()
export class SearchService {
    constructor(private repo: SearchRepository){}

    async searchBytext(searchText: string) {
        return this.repo.questionFts(searchText);
    }
}
