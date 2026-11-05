import Link from "next/link";
import Form from "next/form";
import { getOrders } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/order";

interface OrdersPageProps {
    searchParams: Promise<{
        page?: string;
        date?: string;
    }>;
}

function parsePage(pageStr?: string): number {
    const num = Number(pageStr);
    return Number.isInteger(num) && num >= 1 ? num : 1;
}

function parseDate(value: unknown): string | null {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }
    return null;
}

// Helper komponen untuk badge status pesanan
function StatusBadge({ status }: { status: string }) {
    const label = STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status;
    const style = STATUS_STYLES[status as keyof typeof STATUS_STYLES] ?? "bg-stone-100 text-stone-800";

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>
            {label}
        </span>
    );
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
    const sp = await searchParams;
    const page = parsePage(sp.page);
    const date = parseDate(sp.date);

    const { orders, totalPages } = await getOrders({ page, date });

    return (
        <section className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-black">Daftar Order</h1>
                    <p className="mt-1 text-ink/70">
                        {orders.length} order ditemukan
                    </p>
                </div>

                <Form action="/admin/orders" className="flex items-center gap-2">
                    <input
                        type="date"
                        name="date"
                        defaultValue={date ?? ""}
                        className="rounded-lg border border-stone-300 px-3 py-2 text-sm shadow-sm"
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
                    >
                        Filter
                    </button>
                </Form>
            </div>

            <table className="w-full overflow-hidden rounded-xl bg-white text-left text-sm shadow-sm">
                <thead className="bg-stone-50 text-xs uppercase text-ink/60">
                <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Item</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3" />
                </tr>
                </thead>
                <tbody>
                {orders.map((o) => (
                    <tr key={o.id} className="border-t border-black/5">
                        <td className="px-4 py-2 font-medium">
                            <Link
                                href={`/admin/orders/${o.id}`}
                                className="text-brand hover:underline"
                            >
                                #{o.id}
                            </Link>
                        </td>
                        <td className="px-4 py-2 text-ink/70">
                            {o.date} {o.time}
                        </td>
                        <td className="px-4 py-2">
                            <StatusBadge status={o.status} />
                        </td>
                        <td className="px-4 py-2 text-right">{o.items}</td>
                        <td className="px-4 py-2 text-right">{formatPrice(o.total)}</td>
                        <td className="px-4 py-2 text-right">
                            <Link href={`/admin/orders/${o.id}`} className="font-semibold text-brand hover:underline">
                                Detail
                            </Link>
                        </td>
                    </tr>
                ))}
                {orders.length === 0 && (
                    <tr>
                        <td colSpan={6} className="py-8 text-center text-ink/50">
                            Tidak ada order pada tanggal ini.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className="flex items-center justify-between pt-2">
                <Link
                    href={`/admin/orders?${new URLSearchParams({ page: String(Math.max(1, page - 1)), ...(date ? { date } : {}) })}`}
                    className={`rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium ${page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-stone-50"}`}
                >
                    ← Sebelumnya
                </Link>
                <span className="text-sm text-ink/70">Halaman {page} dari {totalPages || 1}</span>
                <Link
                    href={`/admin/orders?${new URLSearchParams({ page: String(page + 1), ...(date ? { date } : {}) })}`}
                    className={`rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium ${page >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-stone-50"}`}
                >
                    Berikutnya →
                </Link>
            </div>
        </section>
    );
}