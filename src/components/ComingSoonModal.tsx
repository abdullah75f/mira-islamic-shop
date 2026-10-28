"use client";

type ComingSoonModalProps = {
  open: boolean;
  channel: "Telegram" | "WhatsApp" | null;
  onClose: () => void;
};

export function ComingSoonModal({
  open,
  channel,
  onClose,
}: ComingSoonModalProps) {
  if (!open || !channel) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-sm animate-[fadeUp_0.35s_ease] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="coming-soon-title"
      >
        <div className="mx-auto mb-4 h-2 w-2 rotate-45 bg-[var(--mira-gold)]" />
        <h2
          id="coming-soon-title"
          className="text-center font-[family-name:var(--font-display)] text-2xl text-[var(--mira-green)]"
        >
          Coming soon
        </h2>
        <p className="mt-3 text-center text-sm leading-relaxed text-[var(--mira-ink)]/75">
          Order via {channel} will be available soon. For now, reach us at{" "}
          <a href="tel:+251956265832" className="text-[var(--mira-green)] underline">
            +251 956 265 832
          </a>{" "}
          or Telegram{" "}
          <a
            href="https://t.me/mirsassop1"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--mira-green)] underline"
          >
            @mirsassop1
          </a>
          .
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full bg-[var(--mira-green)] px-4 py-3 text-sm tracking-wide text-white transition hover:bg-[var(--mira-green-deep)]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
