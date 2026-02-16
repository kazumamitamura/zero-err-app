-- 混同防止: 旧来の public.profiles 用トリガーを外し、新規登録は ze_profiles のみに流す
-- ※ 既存の public.profiles テーブルがある場合は、必要に応じて手動で ze_profiles にデータ移行の上、
--    drop table public.profiles してください。

drop trigger if exists on_auth_user_created on auth.users;

-- 旧 handle_new_user（profiles に挿入する関数）は残してもよいが、呼ばれなくなる
-- 完全に削除する場合: drop function if exists public.handle_new_user();
