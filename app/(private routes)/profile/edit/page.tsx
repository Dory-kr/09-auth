"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [username, setUsername] = useState(user?.username ?? "");
  const [error, setError] = useState("");

  if (!user) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      router.push("/profile");
    } catch {
      setError("Failed to update profile");
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit profile</h1>

        <form onSubmit={handleSubmit}>
          <Image
            className={css.avatar}
            src={user.avatar}
            alt="User avatar"
            width={120}
            height={120}
          />

          <div className={css.profileInfo}>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>

          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              className={css.input}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          {error && <p>{error}</p>}

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
