"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./SignInPage.module.css";

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const user = await login({ email, password });
      setUser(user);
      router.push("/profile");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.form}>
        <h1 className={css.formTitle}>Sign in</h1>

        <form onSubmit={handleSubmit}>
          <label className={css.formGroup}>
            Email
            <input
              className={css.input}
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className={css.formGroup}>
            Password
            <input
              className={css.input}
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button className={css.submitButton} type="submit">
              Log in
            </button>
          </div>
        </form>

        <p>
          Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
