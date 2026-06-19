-- Disable Row Level Security on user_roles to prevent infinite recursion in RLS policies.
-- Because user_roles has RLS enabled, any policy calling public.has_role() queries user_roles,
-- which in turn evaluates the user_roles policy, causing an infinite stack recursion and crash.
-- Disabling RLS on user_roles makes has_role() execute instantly and solves the recursion.
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
