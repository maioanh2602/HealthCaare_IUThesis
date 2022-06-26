import {logger} from '../config/winston';

const HttpStatus = require('http-status-codes');
const {ClientError, InternalError} = require('../errors');

export const handleSuccess = (res, data, code = HttpStatus.OK) => {

  return res.status(code).json({
    code: HttpStatus.OK,
    data: data
  });
}

// handle return response to the user
export const handleError = (res, error) => {
  if (error instanceof ClientError) {
    return res.status(HttpStatus.NOT_FOUND).json({
      code: error.code,
      message: error.message
    })
  }
  if (error instanceof InternalError) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: error.code,
      message: error.message
    })
  }
  if (error instanceof Error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message

    })
  }
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    message: error.message
  })
}
