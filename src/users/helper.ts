import bcrypt from "bcrypt";
import service from "./service";

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const decodePassword = async (password: string, hash: string) => { 
  return await bcrypt.compare(password, hash);
 }

const isValidUser = async (user_id: string) => {
  const checkUser = await service.findOne({ user_id });
  
  return checkUser ? true : false;
};

export { hashPassword,decodePassword, isValidUser };
