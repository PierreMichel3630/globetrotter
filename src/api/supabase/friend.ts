import { FRIENDSTATUS, FriendInsert, FriendUpdate } from "src/models/Friend";
import { supabase } from "../supabase";

export const SUPABASE_FRIEND_TABLE = "friend";

export const insertFriend = (value: FriendInsert) =>
  supabase.from(SUPABASE_FRIEND_TABLE).insert(value);

export const selectFriend = (status?: FRIENDSTATUS) =>
  status !== undefined
    ? supabase
        .from(SUPABASE_FRIEND_TABLE)
        .select("*, user1!inner(*), user2!inner(*)")
        .eq("status", status.toString())
    : supabase
        .from(SUPABASE_FRIEND_TABLE)
        .select("*, user1!inner(*), user2!inner(*)");

export const deleteFriend = (id: string) =>
  supabase.from(SUPABASE_FRIEND_TABLE).delete().eq("id", id);

export const updateFriend = (value: FriendUpdate) =>
  supabase.from(SUPABASE_FRIEND_TABLE).update(value).eq("id", value.id);

export const selectFriendById = (id: number) =>
  supabase
    .from(SUPABASE_FRIEND_TABLE)
    .select("*, user1!inner(*), user2!inner(*)")
    .eq("id", id)
    .maybeSingle();

export const selectFriendByProfileId = (id: string) =>
  supabase
    .from(SUPABASE_FRIEND_TABLE)
    .select("*")
    .or(`user1.eq.${id},user2.eq.${id}`)
    .maybeSingle();
