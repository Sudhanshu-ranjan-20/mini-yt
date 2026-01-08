import bcrypt from "bcryptjs";

export async function hashPassword(
  password: string,
  salts: number = 10
): Promise<string> {
  return await bcrypt.hash(password, salts);
}
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
