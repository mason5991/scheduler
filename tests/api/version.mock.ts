import { rest } from 'msw';

export const mockGetVersionSuccessResponse = {
  success: true,
  message: 'Success.',
  result: {
    refVersion: 'test.1',
    packageVersion: '1.0.0',
  },
};

export const mockGetVersion = rest.get(
  `${process.env.API_ENDPOINT || ''}/version`,
  (req, res, ctx) => res(ctx.json(mockGetVersionSuccessResponse)),
);

export default {
  mockGetVersionSuccessResponse,
  mockGetVersion,
};
