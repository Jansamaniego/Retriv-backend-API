import mongoose from 'mongoose';
import crypto from 'crypto';
import validator from 'validator';
import { hash, verify } from 'argon2';
import findOrCreatePlugin from 'mongoose-findorcreate';

import toJSON from './plugins';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please enter your first name']
    },
    lastName: {
      type: String,
      required: [true, 'Please enter you last name']
    },
    username: {
      type: String,
      minlength: 6,
      required: [true, 'Please enter your username']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      }
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-z]/)) {
          throw new Error(
            'Password must contain at least one letter and one number.'
          );
        }
      },
      select: false
    },
    passwordConfirmation: {
      type: String,
      validate: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'seller'],
      default: 'user'
    },
    shops: { type: [mongoose.Types.ObjectId], ref: 'Shop', default: [] },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    passwordChangedAt: Date,
    dateJoined: Date,
    address: String,
    phone: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other', 'undisclosed'] },
    profileImage: {
      type: String,
      required: true
    },
    profileImageId: {
      type: String
    },
    avgShopRating: {
      type: Number,
      default: 2.5
    },
    defaultShop: {
      type: mongoose.Types.ObjectId,
      ref: 'Shop'
    },
    preferredCategories: {
      type: [mongoose.Types.ObjectId],
      ref: 'Category',
      default: []
    },
    isGoogleAccount: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.plugin(toJSON);

userSchema.plugin(findOrCreatePlugin);

userSchema.index({ name: 1, email: 1 }, { unique: true });

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  return await verify(this.password, password);
};

userSchema.methods.passwordsChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.pre('save', async function (next) {
  if (!this.isGoogleAccount && this.password) {
    if (!this.passwordConfirmation) {
      throw new Error('Please provide a password confirmation');
    }

    if (!this.isModified('password')) return next();

    const salt = crypto.randomBytes(32);

    this.password = await hash(this.password, { salt });

    this.passwordConfirmation = undefined;

    this.passwordChangedAt = Date.now() - 1000;
  }
  this.dateJoined = Date.now();

  next();
});

const User = mongoose.model('User', userSchema);

export default User;
