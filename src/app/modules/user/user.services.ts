import prisma from '../../../shared/prisma';

const getAllUsers = async () => {
  const data = await prisma.user.findMany();
  return data;
};

export const UserServices = {
  getAllUsers,
};
