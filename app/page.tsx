const CWS_URL =
  "https://chromewebstore.google.com/detail/clipboard-history/PLACEHOLDER_CWS_ID";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-black dark:bg-black dark:text-white">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white text-sm font-bold">
              CH
            </div>
            <span className="text-lg font-semibold">Clipboard History</span>
          </div>
          <a
            href={CWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            Add to Chrome
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Copy once, find it anytime
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Save and search your clipboard history in Chrome. Never lose copied
            text again with instant search, pinned favorites, and keyboard
            shortcuts.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={CWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-emerald-600 px-8 py-3 text-lg font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              Add to Chrome — Free
            </a>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="mb-12 text-center text-2xl font-bold">
            Everything you need to manage your clipboard
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 text-3xl">&#128203;</div>
              <h3 className="mb-2 text-lg font-semibold">Clipboard History</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Automatically saves everything you copy. Scroll back through
                your last 25 items instantly from the popup.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 text-3xl">&#128269;</div>
              <h3 className="mb-2 text-lg font-semibold">Instant Search</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Find any previously copied text in seconds. Type to filter your
                history — no more copying the same thing twice.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 text-3xl">&#9000;</div>
              <h3 className="mb-2 text-lg font-semibold">Keyboard Shortcut</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Open your clipboard history with Ctrl+Shift+V (Cmd+Shift+V on
                Mac). Pin up to 5 favorites for quick access.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="mb-4 text-center text-2xl font-bold">
            Free to use. Pro when you need more.
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-zinc-600 dark:text-zinc-400">
            The free tier covers everyday clipboard management. Pro unlocks
            unlimited history, categories, and sync.
          </p>
          <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
            {/* Free */}
            <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-2 text-sm font-medium text-zinc-500">Free</div>
              <div className="mb-4 text-3xl font-bold">$0</div>
              <ul className="mb-8 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex gap-2">
                  <span className="text-green-600">&#10003;</span> Last 25
                  clipboard items
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">&#10003;</span> Basic search
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">&#10003;</span> Pin 5
                  favorites
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">&#10003;</span> Keyboard
                  shortcut
                </li>
              </ul>
              <a
                href={CWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg bg-zinc-100 px-6 py-3 text-center font-medium text-zinc-900 hover:bg-zinc-200 transition-colors dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              >
                Install Free
              </a>
            </div>
            {/* Pro */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 dark:border-emerald-900 dark:bg-emerald-950/30">
              <div className="mb-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Pro
              </div>
              <div className="mb-1 text-3xl font-bold">
                $2.49
                <span className="text-lg font-normal text-zinc-500">/mo</span>
              </div>
              <div className="mb-4 text-xs text-zinc-500">
                or $24/yr — cancel anytime
              </div>
              <ul className="mb-8 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex gap-2">
                  <span className="text-green-600">&#10003;</span> Everything in
                  Free
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">&#10003;</span> Unlimited
                  history
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">&#10003;</span> Categories
                  and folders
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">&#10003;</span> Text
                  templates
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">&#10003;</span> Chrome sync
                  backup
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">&#10003;</span> Advanced
                  search with regex
                </li>
              </ul>
              <div className="rounded-lg bg-emerald-600 px-6 py-3 text-center font-medium text-white opacity-50 cursor-not-allowed">
                Coming Soon
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Stop losing your clipboard
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-zinc-600 dark:text-zinc-400">
            Install the free Chrome extension and never lose copied text again.
          </p>
          <a
            href={CWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-emerald-600 px-8 py-3 text-lg font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            Add to Chrome — Free
          </a>
          <p className="mt-4 text-xs text-zinc-500">
            Available on the Chrome Web Store
          </p>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-zinc-500">
          <p>
            Clipboard History is built by{" "}
            <a
              href="https://moltcorporation.com"
              className="text-zinc-600 hover:text-black transition-colors dark:text-zinc-400 dark:hover:text-white"
              target="_blank"
            >
              Moltcorp
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
