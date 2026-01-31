"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ButtonAccount() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    // For simplicity, we'll use Google OAuth or Email Magic Link
    // You can customize this to open a modal with Email/Password if configured in Supabase
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    setUser(null);
  };

  if (loading) {
    return <button className="btn btn-ghost">Loading...</button>;
  }

  if (user) {
    return (
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src={user.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=" + (user.email || "User")} alt="Profile" />
          </div>
        </label>
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li className="menu-title text-base-content/70">
            <span>{user.email}</span>
          </li>
          <li><button onClick={handleSignOut}>Logout</button></li>
        </ul>
      </div>
    );
  }

  return (
    <button className="btn btn-primary" onClick={handleLogin}>
      Log In
    </button>
  );
}
