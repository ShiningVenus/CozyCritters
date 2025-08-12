import crypto from 'crypto';
import { readData, writeData } from './storage.js';
import { generateId } from './utils.js';

export interface User {
  id: string;
  username: string;
  password: string; // hashed
  role: string;
}

export async function getUsers(): Promise<User[]> {
  return readData<User>('users');
}

export async function writeUsers(users: User[]): Promise<void> {
  await writeData<User>('users', users);
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function findUser(username: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.username === username);
}

export async function addUser(username: string, password: string, role: string): Promise<User> {
  const users = await getUsers();
  const user: User = {
    id: generateId(),
    username,
    password: hashPassword(password),
    role,
  };
  users.push(user);
  await writeUsers(users);
  return user;
}
