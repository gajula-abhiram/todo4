export const metadata = {
  title: "Abhiram’s To‑Do",
  description: "A tiny Next.js App Router to‑do app that runs on Vercel (no server setup).",
  authors: [{ name: "Abhiram" }]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Abhiram’s To‑Do</h1>
          <span className="badge">Next.js App Router</span>
        </header>
        <main>{children}</main>
        <footer>
          <span>Built by Abhiram · Local-only storage (per browser)</span>
          <span>Tip: press <span className="kbd">Enter</span> to add</span>
        </footer>
      </body>
    </html>
  );
}
