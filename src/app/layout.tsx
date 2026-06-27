import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Buscador de personas — Emergencia sísmica 24 de junio de 2026",
  description:
    "Buscador público para que las familias encuentren a sus seres queridos ingresados en hospitales y centros de triaje tras el terremoto del 24 de junio de 2026 en Venezuela.",
  applicationName: "Buscador de personas",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        {/* Skip link para usuarios de teclado y screen readers */}
        <a
          href="#contenido-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Saltar al contenido principal
        </a>

        <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 min-w-0"
              aria-label="Inicio - Buscador de personas"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icon.svg"
                alt=""
                className="h-7 w-7 shrink-0"
                width={28}
                height={28}
              />
              <span className="flex flex-col leading-tight min-w-0">
                <span className="text-[11px] uppercase tracking-wide text-zinc-500 font-medium">
                  Emergencia sísmica
                </span>
                <span className="text-base font-semibold text-zinc-900 truncate">
                  Buscador de personas
                </span>
              </span>
            </Link>
            <Link
              href="/admin"
              className="touch-target shrink-0 inline-flex items-center px-3 text-sm font-medium text-zinc-700 hover:text-zinc-900 underline underline-offset-2"
            >
              Personal de salud
            </Link>
          </div>
        </header>

        <main id="contenido-principal" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-zinc-200 bg-white mt-12">
          <div className="mx-auto max-w-5xl px-4 py-8 space-y-3">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-zinc-800 flex items-center gap-1">
                Aviso de privacidad
                <span
                  aria-hidden="true"
                  className="text-zinc-400 group-open:rotate-180 transition-transform"
                >
                  ▾
                </span>
              </summary>
              <div className="mt-3 text-xs text-zinc-600 space-y-2 leading-relaxed">
                <p>
                  Este buscador existe para ayudar a las familias a localizar
                  a sus seres queridos tras el terremoto del 24 de junio de
                  2026. La información proviene de personal de salud de los
                  centros participantes. Mostramos solo los datos necesarios
                  para la identificación.
                </p>
                <p>
                  Si usted es familiar o representante de una persona listada
                  y desea que su registro se retire o corrija, use el botón
                  &ldquo;Marcar como encontrado&rdquo; en la tarjeta
                  correspondiente, o contáctenos y lo atenderemos a la
                  brevedad.
                </p>
                <p>
                  Los datos se conservarán únicamente durante la emergencia y
                  se retirarán cuando dejen de ser necesarios.
                </p>
              </div>
            </details>
            <p className="text-xs text-zinc-500">
              Proyecto{" "}
              <span className="font-medium">open source</span> · código
              abierto para que otros medios y comunidades puedan desplegarlo.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}