import { getLatestDay, getStatusCounts, getTopPizzas } from "@/lib/admin-data";
import {formatPrice} from "@/lib/format";
import {STATUS_LABELS} from "@/lib/order";

export async function LatestDayWidget() {
    const day = await getLatestDay();
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Hari terakhir</h2>
            <p className="text-sm text-ink/60">{day.date}</p>
            <p className="mt-2 text-2xl font-black text-brand">{formatPrice(day.revenue)}</p>
            <p className="text-sm text-ink/60">{day.orders} order</p>
        </div>
    );
}

export async function StatusWidget() {
    const counts = await getStatusCounts();
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Status order hari ini</h2>
            <ul className="mt-2 space-y-1 text-sm">
                {Object.entries(counts).map(([status, n]) => (
                    <li key={status} className="flex justify-between">
                        <span>{STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status}</span>
                        <span className="font-semibold">{n}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export async function TopPizzasWidget() {
    const top = await getTopPizzas();
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Terlaris sepanjang masa</h2>
            <ol className="mt-2 space-y-1 text-sm">
                {top.map((p, i) => (
                    <li key={p.id} className="flex justify-between">
                        <span>{i + 1}. {p.name}</span>
                        <span className="font-semibold">{p.sold}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export function WidgetSkeleton({ title }: { title: string }) {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">{title}</h2>
            <div className="mt-3 h-16 animate-pulse rounded bg-stone-100" />
        </div>
    );
}