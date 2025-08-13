import { createUser, CmsRole } from "../server/admin-users";

const [,, username, password, role = "admin"] = process.argv;

if (!username || !password) {
  console.error(
    "Usage: tsx scripts/add-cms-user.ts <username> <password> [role]"
  );
  process.exit(1);
}

await createUser(username, password, role as CmsRole);
console.log(`User ${username} added to cms-users.json with role ${role}`);
