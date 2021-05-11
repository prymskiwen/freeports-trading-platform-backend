import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Interface designed to assign default parameters to pagination
 */
export interface DefaultPagination {
  defaultSkip?: number;
  defaultPage?: number;
  defaultLimit?: number;
  defaultOrder?: any;
  defaultOrderDirection?: string;
  maxAllowedSize?: number;
}

/**
 * Decorator intended for building a PaginationRequest object based on the query string parameters
 */
export const PaginationParams = createParamDecorator(
  (
    data: DefaultPagination = {
      defaultSkip: 0,
      defaultPage: 0,
      defaultLimit: 20,
      defaultOrder: {},
      defaultOrderDirection: 'ASC',
      maxAllowedSize: 100,
    },
    ctx: ExecutionContext,
  ) => {
    let {
      // eslint-disable-next-line prefer-const
      query: { skip, page, limit, orderBy, orderDirection, ...params },
    } = ctx.switchToHttp().getRequest();

    const {
      defaultSkip,
      defaultPage,
      defaultLimit,
      defaultOrder,
      defaultOrderDirection,
      maxAllowedSize,
    } = data;

    const order = orderBy
      ? {
          // eslint-disable-next-line prettier/prettier
          [orderBy]: orderDirection ? (orderDirection === 'ASC' ? 1 : -1) : (defaultOrderDirection === 'ASC' ? 1 : -1),
        }
      : defaultOrder;

    limit = limit && limit > 0 ? +limit : defaultLimit;

    if (!skip) {
      if (page) {
        skip = (+page - 1) * +limit;
        skip = skip >= 0 ? skip : 0;
      } else {
        page = defaultPage;
        skip = defaultSkip;
      }
    } else {
      page = Math.floor(+skip / limit);
    }

    limit = +limit < +maxAllowedSize ? limit : maxAllowedSize;

    return Object.assign(data ? data : {}, {
      skip,
      page,
      limit,
      order,
      params,
    });
  },
);
