"use client";

import { useOptimistic, useState } from "react";
import { useFormStatus } from "react-dom";
import { ratePizzaAction } from "@/app/actions";
import type { RatingSummary } from "@/lib/types";

function StarButtons() {
  const { pending } = useFormStatus();

  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="flex gap-1" aria-label="Beri rating">
        {[1, 2, 3, 4, 5].map((stars) => (
          <button
            key={stars}
            type="submit"
            name="stars"
            value={stars}
            disabled={pending}
            aria-label={`Beri ${stars} bintang`}
            className="text-3xl text-amber-500 hover:scale-110 disabled:pointer-events-none disabled:opacity-50"
          >
            ★
          </button>
        ))}
      </div>
      {pending && <span className="text-sm text-ink/60">Mengirim…</span>}
    </div>
  );
}

export default function RatingPanel({
  pizzaId,
  summary,
}: {
  pizzaId: string;
  summary: RatingSummary;
}) {
  const [optimisticSummary, addOptimisticRating] = useOptimistic(
    summary,
    (current, stars: number) => {
      const nextCount = current.count + 1;
      const nextAverage = (current.average * current.count + stars) / nextCount;
      return {
        count: nextCount,
        average: nextAverage,
      };
    },
  );
  const [error, setError] = useState<string | null>(null);

  async function formAction(formData: FormData) {
    setError(null);
    const stars = Number(formData.get("stars"));
    addOptimisticRating(stars);

    try {
      const result = await ratePizzaAction(pizzaId, formData);
      if (!result.ok) {
        setError(result.error);
      }
    } catch {
      setError("Gagal mengirim rating. Coba lagi.");
    }
  }

  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
      <h2 className="text-lg font-bold">Rating pelanggan</h2>
      <p className="mt-1 text-ink/70" data-testid="rating-summary">
        ★ {optimisticSummary.average.toFixed(1)} dari {optimisticSummary.count} rating
      </p>
      <form action={formAction}>
        <StarButtons />
      </form>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}
