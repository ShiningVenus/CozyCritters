import fs from "fs";
import path from "path";
import crypto from "crypto";

const [,, username, password] = process.argv;

if (!username || !password) {
  console.error("Usage: tsx scripts/add-cms-user.ts <username> <password>");
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.scryptSync(password, salt, 64).toString("hex");

const filePath = path.resolve("cms-users.json");
let users: Record<string, string> = {};
if (fs.existsSync(filePath)) {
  try {
    users = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    // ignore
  }
}

users[username] = `${salt}:${hash}`;

fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
console.log(`User ${username} added to cms-users.json`);
