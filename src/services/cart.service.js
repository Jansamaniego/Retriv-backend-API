import catchAsync from '../utils/catchAsync';

import { Cart, Product } from '../models';

export const addToCart = catchAsync(async (email, productId, quantity) => {
  const cart = await Cart.findOne({ email });
  const product = await Product.findById(productId);

  if (!product) {
    return {
      type: 'Error',
      message: 'Product is not found',
      statusCode: 404
    };
  }

  if (cart) {
    const indexFound = cart.items.findIndex(
      (cartItem) => cartItem.product === productId
    );

    if (indexFound !== -1 && quantity <= 0) {
      cart.items.splice(indexFound, 1);
    } else if (indexFound !== -1) {
      cart.items[indexFound].totalProductQuantity += quantity;
      cart.items[indexFound].totalProductPrice += product.price * quantity;
    } else if (quantity > 0) {
      cart.items.push({
        product: productId,
        totalProductQuantity: quantity,
        totalProductPrice: product.price * quantity,
        shop: product.shop,
        shopOwner: product.shopOwner,
        category: product.category
      });
      cart.totalQuantity += quantity;
      cart.totalPrice += product.price * quantity;
    } else {
      return {
        type: 'Error',
        message: 'Invalid request',
        statusCode: 400
      };
    }

    await cart.save();

    return {
      type: 'Success',
      message: 'Product is added to cart successfully',
      statusCode: 200,
      cart
    };
  }

  const cartObject = {
    email,
    items: [
      {
        product: productId,
        totalProductQuantity: Number(quantity),
        totalProductPrice: product.price * quantity,
        shop: product.shop,
        shopOwner: product.shopOwner,
        category: product.category
      }
    ],
    totalQuantity: quantity,
    totalPrice: product.price * quantity
  };

  const createdCart = await Cart.create(cartObject);

  return {
    type: 'Success',
    message: 'Product is added to a newly created cart successfully',
    statusCode: 200,
    cart: createdCart
  };
});

export const incrementProductQuantity = catchAsync(async (email, productId) => {
  const cart = await Cart.findOne({ email });
  const product = await Product.findById(productId);

  if (!product) {
    return {
      type: 'Error',
      message: 'Product is not found',
      statusCode: 404
    };
  }

  if (!cart) {
    return {
      type: 'Error',
      message: 'Cart is not found for this user',
      statusCode: 404
    };
  }

  const indexesFound = cart.items.reduce((a, e, i) => {
    if (e.product.toString() === productId.toString()) a.push(i);
    return a;
  }, []);

  if (indexesFound.length === 0 || indexesFound === -1) {
    return {
      type: 'Error',
      message: 'Product is not found in the cart',
      statusCode: 404
    };
  }
  for (const indexFound of indexesFound) {
    const updatedProductQuantity =
      cart.items[indexFound].totalProductQuantity + 1;
    const updatedProductPrice =
      cart.items[indexFound].totalProductPrice + product.price;
    const updatedTotalQuantity = cart.totalQuantity + 1;
    const updatedTotalPrice = cart.totalPrice + product.price;

    if (updatedProductPrice <= 0 || updatedProductQuantity <= 0) {
      cart.items.splice(indexFound, 1);
    } else {
      cart.items[indexFound].totalProductQuantity = updatedProductQuantity;
      cart.items[indexFound].totalProductPrice = updatedProductPrice;
      cart.totalQuantity = updatedTotalQuantity;
      cart.totalPrice = updatedTotalPrice;
    }
  }

  await cart.save();

  const updatedCart = await Cart.findById(cart._id);

  return {
    type: 'Success',
    message: 'Product is incremented successfully',
    statusCode: 200,
    cart: updatedCart
  };
});

export const decrementProductQuantity = catchAsync(async (email, productId) => {
  const cart = await Cart.findOne({ email });
  const product = await Product.findById(productId);

  if (!product) {
    return {
      type: 'Error',
      message: 'Product is not found',
      statusCode: 404
    };
  }

  if (!cart) {
    return {
      type: 'Error',
      message: 'Cart is not found for this user',
      statusCode: 404
    };
  }

  const indexesFound = cart.items.reduce((a, e, i) => {
    if (e.product.toString() === productId.toString()) a.push(i);
    return a;
  }, []);

  if (indexesFound.length === 0 || indexesFound === -1) {
    return {
      type: 'Error',
      message: 'Product is not found in the cart',
      statusCode: 404
    };
  }

  for (const indexFound of indexesFound) {
    if (cart.items[indexFound].totalProductQuantity === 1) {
      cart.items.splice(indexFound, 1);
      cart.totalQuantity--;
      cart.totalPrice -= product.price;
    } else {
      cart.items[indexFound].totalProductQuantity -= 1;
      cart.items[indexFound].totalProductPrice -= product.price;
      cart.totalQuantity -= 1;
      cart.totalPrice -= product.price;
    }
  }

  await cart.save();

  const updatedCart = await Cart.findById(cart._id);

  return {
    type: 'Success',
    message: 'Product is decremented successfully',
    statusCode: 200,
    cart: updatedCart
  };
});

export const queryCart = catchAsync(async (email) => {
  const cart = await Cart.findOne({ email });

  if (!cart) {
    return {
      type: 'Success',
      message: 'User has no cart',
      statusCode: 200
    };
  }

  return {
    type: 'Success',
    message: 'Cart is found successfully',
    statusCode: 200,
    cart
  };
});

export const removeItemFromCart = catchAsync(
  async (email, productId, cartItemIndex) => {
    const cart = await Cart.findOne({ email });

    if (!cart) {
      return {
        type: 'Error',
        message: 'Cart is not found for this user',
        statusCode: 404
      };
    }

    const product = await Product.findById(productId);

    if (!product) {
      return {
        type: 'Error',
        message: 'Product is not found',
        statusCode: 404
      };
    }

    if (
      !productId.toString() === cart.items[cartItemIndex].product.toString()
    ) {
      return {
        type: 'Error',
        message: `id of cart item with index: ${cartItemIndex} does not match product id: ${productId}`,
        statusCode: 400
      };
    }
    
    cart.totalQuantity -= cart.items[cartItemIndex].totalProductQuantity;

    cart.totalPrice -= cart.items[cartItemIndex].totalProductPrice;

    cart.items.splice(cartItemIndex, 1);

    await cart.save();

    const updatedCart = await Cart.findOne({ email });

    return {
      type: 'success',
      message: 'Product is deleted from cart successfully',
      statusCode: 200,
      cart: updatedCart
    };
  }
);

export const deleteCart = catchAsync(async (email) => {
  const cart = await Cart.findOne({ email });

  if (!cart) {
    return {
      type: 'Error',
      message: 'Cart is not found for user',
      statusCode: 404
    };
  }

  const deletedCart = await Cart.findOneAndDelete({ email });

  return {
    type: 'Success',
    message: 'Cart is deleted successfully',
    statusCode: 200,
    cart: deletedCart
  };
});
