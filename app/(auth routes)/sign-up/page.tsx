"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const user = await register({ email, password });
      setUser(user);
      router.push("/profile");
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.form}>
        <h1 className={css.formTitle}>Sign up</h1>

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
              Register
            </button>
          </div>
        </form>

        <p>
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
