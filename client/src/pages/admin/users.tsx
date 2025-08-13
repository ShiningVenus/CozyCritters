import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRow, CmsUser } from "@/components/admin/user-row";

export default function AdminUsers() {
  const [users, setUsers] = useState<CmsUser[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("editor");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadUsers = () => {
    fetch("/api/admin/users", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setUsers)
      .catch(() => setError("Failed to load users"));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });
    if (res.ok) {
      setMessage("User added");
      setUsername("");
      setPassword("");
      setRole("editor");
      loadUsers();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Failed to add user");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">CMS Users</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow key={user.username} user={user} onChanged={loadUsers} />
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No users
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <h2 className="text-xl font-semibold mt-6 mb-2">Add User</h2>
      <form onSubmit={handleAdd} className="grid gap-2 max-w-md">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded w-full h-10 px-3"
          >
            <option value="admin">admin</option>
            <option value="mod">mod</option>
            <option value="editor">editor</option>
          </select>
        </div>
        <Button type="submit" className="mt-2">
          Add
        </Button>
      </form>
    </div>
  );
}
