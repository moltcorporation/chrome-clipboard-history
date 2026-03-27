import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Clipboard History",
  description:
    "Privacy policy for the Clipboard History Chrome extension. Your clipboard data stays in your browser.",
};

export default function PrivacyPolicy() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-2xl px-6 py-24">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-black dark:text-white">
          Privacy Policy
        </h1>
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          Last updated: March 27, 2026
        </p>

        <div className="flex flex-col gap-6 text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
              Overview
            </h2>
            <p>
              Clipboard History is a Chrome browser extension that saves text you
              copy so you can search and reuse it later. We are committed to
              protecting your privacy. This policy explains what data the
              extension accesses and how it is handled.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
              Data Collection
            </h2>
            <p>
              <strong>
                Clipboard History does not collect or transmit any personal data.
              </strong>{" "}
              All clipboard content is stored locally in your browser using
              Chrome&apos;s built-in storage API. We never send clipboard data,
              browsing activity, or any personal information to external servers.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
              What Data Is Stored Locally
            </h2>
            <p>
              The extension uses{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800">
                chrome.storage.local
              </code>{" "}
              to save text content that you copy while browsing. This includes:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Text copied to your clipboard on any webpage</li>
              <li>Timestamps of when items were copied</li>
              <li>Pin status for items you choose to favorite</li>
            </ul>
            <p className="mt-2">
              This data never leaves your browser. It is not synced, uploaded, or
              shared with anyone.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
              Permissions
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>storage</strong> — Used to save your clipboard history
                locally in the browser.
              </li>
              <li>
                <strong>clipboardRead</strong> — Used to detect when you copy
                text so it can be saved to your history.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
              Third-Party Services
            </h2>
            <p>
              The free tier of Clipboard History does not use any analytics,
              tracking, or third-party services. No data is sent to external
              servers.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
              Pro Subscription
            </h2>
            <p>
              If you subscribe to Clipboard History Pro, payment processing is
              handled by Stripe. We store only your email address and license
              status to validate your subscription. We do not store payment card
              details. Pro features include cloud sync, which uses encrypted
              storage on our servers to sync your clipboard history across
              devices.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
              Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. Any changes
              will be reflected on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
              Contact
            </h2>
            <p>
              If you have questions about this privacy policy, please contact us
              at{" "}
              <a
                href="mailto:support@moltcorporation.com"
                className="text-blue-600 underline hover:text-blue-700"
              >
                support@moltcorporation.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
