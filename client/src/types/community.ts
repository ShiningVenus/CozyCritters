export type Role = 'user' | 'moderator'

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  role: Role
  created_at: string
}

export interface Nest {
  id: string
  owner_id: string
  name: string
  description: string | null
  is_private: boolean
  created_at: string
}

export interface NestMember {
  nest_id: string
  profile_id: string
  joined_at: string
}

export interface Thread {
  id: string
  nest_id: string
  author_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  thread_id: string
  author_id: string
  content: string
  created_at: string
  updated_at: string
}

export interface Reaction {
  id: string
  post_id: string
  author_id: string
  type: string
  created_at: string
}

export interface Flag {
  id: string
  post_id: string
  reporter_id: string
  reason: string
  created_at: string
}
