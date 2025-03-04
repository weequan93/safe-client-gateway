import { EligibilityRequestSchema } from '@/domain/community/entities/eligibility-request.entity';
import { PaginationDataDecorator } from '@/routes/common/decorators/pagination.data.decorator';
import { RouteUrlDecorator } from '@/routes/common/decorators/route.url.decorator';
import { PaginationData } from '@/routes/common/pagination/pagination.data';
import { CommunityService } from '@/routes/community/community.service';
import { CampaignActivityPage } from '@/routes/community/entities/campaign-activity.page.entity';
import { CampaignRank } from '@/routes/community/entities/campaign-rank.entity';
import { CampaignRankPage } from '@/routes/community/entities/campaign-rank.page.entity';
import { Campaign } from '@/routes/community/entities/campaign.entity';
import { CampaignPage } from '@/routes/community/entities/campaign.page.entity';
import { EligibilityRequest } from '@/routes/community/entities/eligibility-request.entity';
import { Eligibility } from '@/routes/community/entities/eligibility.entity';
import { LockingEventPage } from '@/routes/community/entities/locking-event.page.entity';
import { LockingRank } from '@/routes/community/entities/locking-rank.entity';
import { LockingRankPage } from '@/routes/community/entities/locking-rank.page.entity';
import { AddressSchema } from '@/validation/entities/schemas/address.schema';
import { ValidationPipe } from '@/validation/pipes/validation.pipe';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('community')
@Controller({
  path: 'community',
  version: '1',
})
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @ApiOkResponse({ type: CampaignPage })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
  })
  @Get('/campaigns')
  async getCampaigns(
    @RouteUrlDecorator() routeUrl: URL,
    @PaginationDataDecorator() paginationData: PaginationData,
  ): Promise<CampaignPage> {
    return this.communityService.getCampaigns({ routeUrl, paginationData });
  }

  @ApiOkResponse({ type: Campaign })
  @Get('/campaigns/:resourceId')
  async getCampaignById(
    @Param('resourceId') resourceId: string,
  ): Promise<Campaign> {
    return this.communityService.getCampaignById(resourceId);
  }

  @Get('/campaigns/:resourceId/activities')
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'holder', required: false, type: String })
  async getCampaignActivities(
    @Param('resourceId') resourceId: string,
    @RouteUrlDecorator() routeUrl: URL,
    @PaginationDataDecorator() paginationData: PaginationData,
    @Query('holder', new ValidationPipe(AddressSchema.optional()))
    holder?: `0x${string}`,
  ): Promise<CampaignActivityPage> {
    return this.communityService.getCampaignActivities({
      resourceId,
      holder,
      routeUrl,
      paginationData,
    });
  }

  @ApiOkResponse({ type: CampaignRankPage })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
  })
  @Get('/campaigns/:resourceId/leaderboard')
  async getCampaignLeaderboard(
    @Param('resourceId') resourceId: string,
    @RouteUrlDecorator() routeUrl: URL,
    @PaginationDataDecorator() paginationData: PaginationData,
  ): Promise<CampaignRankPage> {
    return this.communityService.getCampaignLeaderboard({
      resourceId,
      routeUrl,
      paginationData,
    });
  }

  @ApiOkResponse({ type: CampaignRank })
  @Get('/campaigns/:resourceId/leaderboard/:safeAddress')
  async getCampaignRank(
    @Param('resourceId') resourceId: string,
    @Param('safeAddress', new ValidationPipe(AddressSchema))
    safeAddress: `0x${string}`,
  ): Promise<CampaignRank> {
    return this.communityService.getCampaignRank({ resourceId, safeAddress });
  }

  @ApiOkResponse({ type: Eligibility })
  @HttpCode(200)
  @Post('/eligibility')
  async checkEligibility(
    @Body(new ValidationPipe(EligibilityRequestSchema))
    eligibilityRequest: EligibilityRequest,
  ): Promise<Eligibility> {
    return this.communityService.checkEligibility(eligibilityRequest);
  }

  @ApiOkResponse({ type: LockingRankPage })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
  })
  @Get('/locking/leaderboard')
  async getLeaderboard(
    @RouteUrlDecorator() routeUrl: URL,
    @PaginationDataDecorator() paginationData: PaginationData,
  ): Promise<LockingRankPage> {
    return this.communityService.getLockingLeaderboard({
      routeUrl,
      paginationData,
    });
  }

  @ApiOkResponse({ type: LockingRank })
  @Get('/locking/:safeAddress/rank')
  async getLockingRank(
    @Param('safeAddress', new ValidationPipe(AddressSchema))
    safeAddress: `0x${string}`,
  ): Promise<LockingRank> {
    return this.communityService.getLockingRank(safeAddress);
  }

  @ApiOkResponse({ type: LockingEventPage })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
  })
  @Get('/locking/:safeAddress/history')
  async getLockingHistory(
    @Param('safeAddress', new ValidationPipe(AddressSchema))
    safeAddress: `0x${string}`,
    @RouteUrlDecorator() routeUrl: URL,
    @PaginationDataDecorator() paginationData: PaginationData,
  ): Promise<LockingEventPage> {
    return this.communityService.getLockingHistory({
      safeAddress,
      routeUrl,
      paginationData,
    });
  }
}
