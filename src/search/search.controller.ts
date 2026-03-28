import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private searchService: SearchService){}

    @Get('questions/')
    searchBytext(
        @Query('q') q: string,
    ) {
        return this.searchService.searchBytext(q);
    }
}