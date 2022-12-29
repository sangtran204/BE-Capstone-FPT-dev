import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorators/user.decorator';
import { AccountEntity } from '../accounts/entities/account.entity';
import { CreateFeedbackDTO } from './dto/create_feedback.dto';
import { FeedBackEntity } from './entities/feedback.entity';
import { FeedBackService } from './feedback.service';

@ApiBearerAuth()
@ApiTags('feedback')
@Controller('feedback')
export class FeedBackController {
  constructor(private readonly feedbackService: FeedBackService) {}

  // @Post()
  // @ApiResponse({
  //   status: 200,
  //   description: 'CREATE FEEDBACK',
  //   type: String,
  // })
  // async createFeedback(
  //   @Body() feedback: CreateFeedbackDTO,
  //   @GetUser() user: AccountEntity,
  // ): Promise<string> {
  //   return await this.feedbackService.createFeedBack(feedback, user);
  // }

  // @Get('/byPackage/:id')
  // @ApiResponse({
  //   status: 200,
  //   description: 'GET FEEDBACK BY PACKAGE',
  //   type: FeedBackEntity,
  // })
  // async getFeedbackByPackage(
  //   @Param('id') packageId: string,
  // ): Promise<FeedBackEntity[]> {
  //   return await this.feedbackService.getFeedbackByPackage(packageId);
  // }

  // @Get()
  // @ApiResponse({
  //   status: 200,
  //   description: 'GET ALL FEEDBACK',
  //   type: FeedBackEntity,
  // })
  // async getAllFeedback(): Promise<FeedBackEntity[]> {
  //   return await this.feedbackService.getAllFeedback();
  // }
}
