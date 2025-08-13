import fs from "fs";
import path from "path";
import crypto from "crypto";

export type CmsRole = "admin" | "mod" | "editor";

export interface CmsUser {
  password: string;
  role: CmsRole;
}

const filePath = path.resolve("cms-users.json");

function loadUsers(): Record<string, CmsUser> {
  if (process.env.CMS_USERS) {
    try {
      return JSON.parse(process.env.CMS_USERS);
    } catch {
      // fall through to file
    }
  }
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return {};
}

async function saveUsers(users: Record<string, CmsUser>): Promise<void> {
  const tempPath = `${filePath}.tmp`;
  await fs.promises.writeFile(tempPath, JSON.stringify(users, null, 2));
  await fs.promises.rename(tempPath, filePath);
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
}

export function listUsers(): Array<{ username: string; role: CmsRole }> {
  const users = loadUsers();
  return Object.entries(users).map(([username, { role }]) => ({ username, role }));
}

export function getUser(username: string): CmsUser | undefined {
  const users = loadUsers();
  return users[username];
}

export async function createUser(
  username: string,
  password: string,
  role: CmsRole
): Promise<void> {
  const users = loadUsers();
  if (users[username]) {
    const err = new Error("User already exists");
    (err as any).status = 400;
    throw err;
  }
  users[username] = { password: hashPassword(password), role };
  await saveUsers(users);
}

export async function updateUser(
  username: string,
  updates: { password?: string; role?: CmsRole }
): Promise<void> {
  const users = loadUsers();
  const user = users[username];
  if (!user) {
    const err = new Error("User not found");
    (err as any).status = 404;
    throw err;
  }
  if (updates.password) {
    user.password = hashPassword(updates.password);
  }
  if (updates.role) {
    user.role = updates.role;
  }
  await saveUsers(users);
}

export async function deleteUser(username: string): Promise<void> {
  const users = loadUsers();
  if (!users[username]) {
    const err = new Error("User not found");
    (err as any).status = 404;
    throw err;
  }
  delete users[username];
  await saveUsers(users);
}

