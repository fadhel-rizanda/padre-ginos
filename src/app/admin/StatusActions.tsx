"use client";

import { useActionState } from "react";
import { updateOrderStatusAction, type StatusFormState } from "@/app/admin/actions";
import {nextStatuses, OrderStatus, STATUS_LABELS} from "@/lib/order";

export default function StatusActions({ orderId, status }: { orderId: number; status: OrderStatus }) {
    const [state, formAction, pending] = useActionState<StatusFormState, FormData>(
        updateOrderStatusAction,
        null,
    );

    const options = nextStatuses(status);
    if (options.length === 0) {
        return <p className="text-sm text-ink/60">Status final, tidak bisa diubah lagi.</p>;
    }

    return (
        <form action={formAction} className="space-y-3">
            <input type="hidden" name="orderId" value={orderId} />
            <div className="flex flex-wrap gap-2">
                {options.map((next) => (
                    <button
                        key={next}
                        type="submit"
                        name="status"
                        value={next}
                        disabled={pending}
                        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {pending ? "Menyimpan…" : `Ubah ke ${STATUS_LABELS[next]}`}
                    </button>
                ))}
            </div>
            {state?.error && (
                <p role="alert" className="text-sm font-medium text-red-700">
                    {state.error}
                </p>
            )}
        </form>
    );
}