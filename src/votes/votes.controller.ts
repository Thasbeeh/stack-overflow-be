import { Body, Controller, Param, Post } from '@nestjs/common';
import { VoteInfoDto } from './dtos/vote-info-dto';
import { VotesService } from './votes.service';
import type { CurrentUser as CurrentUserType } from 'src/auth/interfaces/current-user.interface';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('votes')
export class VotesController {
    constructor(private readonly votesService: VotesService) {}

    @Post()
    castVote(
        @Param('entityId') entityId: string,
        @Body() body: VoteInfoDto,
        @CurrentUser() currentUser: CurrentUserType,
    ){  
        return this.votesService.castVote(body.entityId, body.entityType, body.value, currentUser)
    }
}
