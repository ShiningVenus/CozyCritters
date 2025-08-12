export interface Post { id: string; deleted?: boolean }
export interface Ban { id: string; target_id?: string; reason?: string; status: string }
export interface Flag { id: string }
export interface Thread { id: string; deleted?: boolean }

export const posts: Post[] = [];
export const bans: Ban[] = [];
export const flags: Flag[] = [];
export const threads: Thread[] = [];
