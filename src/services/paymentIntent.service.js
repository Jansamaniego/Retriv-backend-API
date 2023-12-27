import catchAsync from '../utils/catchAsync';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const generatePaymentIntent = catchAsync(async (totalPrice) => {
  const paymentIntent = await stripe.paymentIntents.create({
    currency: 'PHP',
    amount: totalPrice * 100,
    payment_method_types: ['card']
  });

  if (!paymentIntent) {
    return {
      type: 'Error',
      message: 'Intention to pay process failed',
      statusCode: 400
    };
  }

  return {
    type: 'Success',
    message: 'Intention to pay is successfully processed',
    statusCode: 200,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  };
});

export const confirmPaymentIntent = catchAsync(async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

  if (!paymentIntent) {
    return {
      type: 'Error',
      message: 'Payment intents are not found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'Payment intent is successfully confirmed',
    statusCode: 201,
    paymentIntent
  };
});

export const queryPaymentIntents = catchAsync(async () => {
  const paymentIntents = await stripe.paymentIntents.list();

  if (!paymentIntents) {
    return {
      type: 'Error',
      message: 'Payment intents are not found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'Payment intents are successfully found',
    statusCode: 201,
    paymentIntents
  };
});

export const queryPaymentIntent = catchAsync(async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (!paymentIntent) {
    return {
      type: 'Error',
      message: 'Payment intent is not found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'Payment intent is successfully found',
    statusCode: 201,
    paymentIntent
  };
});

export const dropPaymentIntents = catchAsync(async () => {
  const paymentIntents = await stripe.paymentIntents.list();

  const cancelledPaymentIntents = paymentIntents.map(async (paymentIntent) => {
    await stripe.paymentIntents.cancel(paymentIntent.id);
  });

  if (!cancelledPaymentIntents) {
    return {
      type: 'Error',
      message: 'Attempt to cancel payment intents failed',
      statusCode: 400
    };
  }

  return {
    type: 'Success',
    message: 'Payment intents are cancelled successfully',
    statusCode: 200,
    cancelledPaymentIntents
  };
});

export const dropPaymentIntent = catchAsync(async (paymentItentId) => {
  const cancelledPaymentIntent = await stripe.paymentIntents.cancel(
    paymentItentId
  );

  if (!cancelledPaymentIntent) {
    return {
      type: 'Error',
      message: 'Attempt to cancel payment intent failed',
      statusCode: '400',
      cancelledPaymentIntent
    };
  }
  return {
    type: 'Success',
    message: 'Payment intent is cancelled successfully',
    statusCode: 200,
    cancelledPaymentIntent
  };
});
