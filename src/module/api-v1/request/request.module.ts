import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationModule } from '../organization/organization.module';
import { DeskModule } from '../desk/desk.module';
import { UserModule } from '../user/user.module';
import { RequestTradeController } from './controller/trade/request-trade.controller';
import { RequestService } from './request.service';
import { Request, RequestSchema } from 'src/schema/request/request.schema';
import {
  RequestTrade,
  RequestTradeSchema,
} from 'src/schema/request/request-trade.schema';
import {
  RequestFund,
  RequestFundSchema,
} from 'src/schema/request/request-fund.schema';
import {
  RequestRefund,
  RequestRefundSchema,
} from 'src/schema/request/request-refund.schema';
import {
  RequestMove,
  RequestMoveSchema,
} from 'src/schema/request/request-move.schema';
import { InvestorModule } from '../investor/investor.module';
import {
  RequestTradeRfq,
  RequestTradeRfqSchema,
} from 'src/schema/request/embedded/request-trade-rfq.embedded';
import { RequestTradeRfqController } from './controller/trade/request-trade-rfq.controller';
import { RequestTradeMyController } from './controller/trade/request-trade-my.controller';
import { RequestFundController } from './controller/request-fund.controller';
import { RequestRefundController } from './controller/request-refund.controller';
import { RequestMoveController } from './controller/request-move.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Request.name,
        schema: RequestSchema,
        discriminators: [
          { name: RequestTrade.name, schema: RequestTradeSchema },
          {
            name: RequestFund.name,
            schema: RequestFundSchema,
          },
          {
            name: RequestRefund.name,
            schema: RequestRefundSchema,
          },
          { name: RequestMove.name, schema: RequestMoveSchema },
        ],
      },
      { name: RequestTradeRfq.name, schema: RequestTradeRfqSchema },
    ]),
    DeskModule,
    InvestorModule,
    OrganizationModule,
    UserModule,
  ],
  controllers: [
    RequestTradeMyController,
    RequestTradeController,
    RequestTradeRfqController,
    RequestFundController,
    RequestRefundController,
    RequestMoveController,
  ],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
