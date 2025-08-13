import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface CmsUser {
  username: string;
  role: string;
}

interface Props {
  user: CmsUser;
  onChanged: () => void;
}

export function UserRow({ user, onChanged }: Props) {
  const [editing, setEditing] = useState(false);
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const save = async () => {
    setError(null);
    setSuccess(null);
    const res = await fetch(`/api/admin/users/${user.username}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        ...(password ? { password } : {}),
      }),
    });
    if (res.ok) {
      setSuccess("Saved");
      setEditing(false);
      setPassword("");
      onChanged();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Failed to update user");
    }
  };

  const remove = async () => {
    setError(null);
    if (!window.confirm(`Delete ${user.username}?`)) return;
    const res = await fetch(`/api/admin/users/${user.username}`, {
      method: "DELETE",
    });
    if (res.ok) {
      onChanged();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Failed to delete user");
    }
  };

  if (editing) {
    return (
      <TableRow>
        <TableCell className="font-mono">{user.username}</TableCell>
        <TableCell>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="admin">admin</option>
            <option value="mod">mod</option>
            <option value="editor">editor</option>
          </select>
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2"
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          {success && <p className="text-green-600 text-sm mt-1">{success}</p>}
        </TableCell>
        <TableCell className="flex gap-2">
          <Button type="button" onClick={save}>
            Save
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setEditing(false);
              setRole(user.role);
              setPassword("");
              setError(null);
              setSuccess(null);
            }}
          >
            Cancel
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="font-mono">{user.username}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell className="flex gap-2">
        <Button type="button" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <Button type="button" variant="destructive" onClick={remove}>
          Delete
        </Button>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </TableCell>
    </TableRow>
  );
}
