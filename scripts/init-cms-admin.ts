import crypto from "crypto";
import { createUser, listUsers } from "../server/admin-users";

const [,, username = "admin"] = process.argv;

if (listUsers().length > 0) {
  console.error("cms-users.json already has users. This script only initializes the first admin account.");
  process.exit(1);
}

const password = crypto.randomBytes(18).toString("base64url");
await createUser(username, password, "admin");

console.log(`Initial admin account created.\nUsername: ${username}\nPassword: ${password}`);

