"use client";

import { useSearchParams } from "next/navigation";

export default function LoginForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const params = useSearchParams();
  const errorMsg = params.get("error");

  return (
    <form
      action={action}
      className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5"
    >
      {errorMsg ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMsg}
        </div>
      ) : null}
      <label className="block space-y-1">
        <span className="block text-sm font-medium text-zinc-800">Correo</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
        />
      </label>
      <label className="block space-y-1">
        <span className="block text-sm font-medium text-zinc-800">Contraseña</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 active:bg-zinc-950"
      >
        Iniciar sesión
      </button>
    </form>
  );
}