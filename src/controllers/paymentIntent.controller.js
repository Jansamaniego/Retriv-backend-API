import { paymentIntentService } from '../services';
import catchAsync from '../utils/catchAsync';

export const createPaymentIntent = catchAsync(async (req, res) => {
  const { type, message, statusCode, clientSecret, paymentIntentId } =
    await paymentIntentService.generatePaymentIntent(req.body.totalPrice);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    clientSecret,
    paymentIntentId
  });
});

export const confirmPayment = catchAsync(async () => {
  const { type, message, statusCode, paymentIntent } =
    await paymentIntentService.confirmPaymentIntent();

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    paymentIntent
  });
});

export const getPaymentIntents = catchAsync(async (req, res) => {
  const { type, message, statusCode, paymentIntents } =
    await paymentIntentService.queryPaymentIntents();

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    paymentIntents
  });
});

export const getPaymentIntent = catchAsync(async (req, res) => {
  const { type, message, statusCode, paymentIntent } =
    await paymentIntentService.queryPaymentIntent(req.params.paymentIntentId);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    paymentIntent
  });
});

export const cancelPaymentIntents = catchAsync(async (req, res) => {
  const { type, message, statusCode, cancelledPaymentIntents } =
    await paymentIntentService.dropPaymentIntents();

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    cancelledPaymentIntents
  });
});

export const cancelPaymentIntent = catchAsync(async (req, res) => {
  const { type, message, statusCode, cancelledPaymentIntent } =
    await paymentIntentService.dropPaymentIntent(req.params.paymentIntentId);

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    cancelledPaymentIntent
  });
});
