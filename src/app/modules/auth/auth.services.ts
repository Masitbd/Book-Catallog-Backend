import { User } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import { IAuth } from './auth.interface';

const signUp = async (user: User) => {
  const data = await prisma.user.create({
    data: user,
  });
  return data;
};

const signIn = async (signInData: IAuth) => {
  const userExist = await prisma.user.findFirst({
    where: {
      email: signInData.email,
    },
  });

  if (!userExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Icorrext credentials!');
  }

  const { email, role, password } = userExist;

  // check password

  if (signInData.password != password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exists');
  }

  // Generate Token

  const token = jwtHelpers.createToken(
    { email, role },
    process.env.JWT_SECRET as string,
    process.env.JWT_EXPIRES_IN as string
  );
  return { token };
};

export const AuthService = {
  signUp,
  signIn,
};
