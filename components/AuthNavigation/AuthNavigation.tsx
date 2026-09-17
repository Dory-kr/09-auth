"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./AuthNavigation.module.css";

const AuthNavigation = () => {
  const router = useRouter();
  const { user, isAuthenticated, clearIsAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      router.push("/sign-in");
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/sign-in" className={css.navigationLink}>Sign in</Link>
        </li>
        <li className={css.navigationItem}>
          <Link href="/sign-up" className={css.navigationLink}>Sign up</Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" className={css.navigationLink}>Profile</Link>
      </li>
      {user && (
        <li>
          <span className={css.userEmail}>{user.email}</span>
        </li>
      )}
      <li className={css.navigationItem}>
        <button type="button" onClick={handleLogout} className={css.logoutButton}>
          Logout
        </button>
      </li>
    </>
  );
};

export default AuthNavigation;
