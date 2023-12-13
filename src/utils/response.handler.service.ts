import {
  IResponseHandlerData,
  IResponseHandlerParams,
} from './interfaces/response.handler.interface';

export const ResponseHandlerService = (params: IResponseHandlerParams) => {
  const res: IResponseHandlerData = {
    timeRequested: new Date().toISOString(),
    callId: Date.now(),
    ...params,
  };

  return res;
};
