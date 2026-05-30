import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AccountType = "teen" | "parent";

export interface User {
  id: string;
  name: string;
  email: string;
  accountType: AccountType;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

async function fetchProfile(id: string, fallbackEmail: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, account_type")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) {
    return { id, name: fallbackEmail.split("@")[0], email: fallbackEmail, accountType: "teen" };
  }
  return { id: data.id, name: data.name, email: data.email, accountType: data.account_type as AccountType };
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session?.user) {
        setState({ user: null, loading: false });
      } else {
        setState((s) => ({ ...s, loading: true }));
        // Defer profile fetch to avoid deadlock inside the listener
        setTimeout(() => {
          fetchProfile(session.user.id, session.user.email ?? "").then((user) => {
            if (mounted) setState({ user, loading: false });
          });
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (!session?.user) {
        setState({ user: null, loading: false });
      } else {
        fetchProfile(session.user.id, session.user.email ?? "").then((user) => {
          if (mounted) setState({ user, loading: false });
        });
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  return state;
}

export async function signUpWithEmail(params: { email: string; password: string; name: string; accountType: AccountType }) {
  const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/` : undefined;
  const { error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      emailRedirectTo: redirectUrl,
      data: { name: params.name, account_type: params.accountType },
    },
  });
  if (error) throw error;
}

export async function signInWithEmail(params: { email: string; password: string }) {
  const { error } = await supabase.auth.signInWithPassword(params);
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}
