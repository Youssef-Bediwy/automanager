"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Connexion refusée. Vérifie tes identifiants.");
        return;
      }

      window.location.assign("/");
    } catch {
      setError("Connexion impossible. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-2xl font-bold">Connexion admin</h1>

        <label className="block">
          Identifiant
          <input
            required
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-2 w-full rounded-xl border p-3"
          />
        </label>

        <label className="block">
          Mot de passe
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border p-3"
          />
        </label>

        {error && <p role="alert" className="text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <a href="/" className="block text-center text-blue-600">
          Retour aux véhicules
        </a>
      </form>
    </main>
  );
}