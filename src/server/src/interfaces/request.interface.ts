import {Request} from 'express';

interface CustomRequest<B> extends Request {
  body: B,
}

export {
  CustomRequest,
};
