import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getOrder } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";
import {OrderStatus, STATUS_LABELS, STATUS_STYLES} from "@/lib/order";
import StatusActions from "@/app/admin/StatusActions";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
    const { id } = await params;

    const orderId = Number(id);
    if (!Number.isInteger(orderId) || orderId <= 0) {
        notFound();
    }

    const order = await getOrder(orderId);
    if (!order) {
        notFound();
    }

    return (
        <section className="max-w-3xl space-y-6">
            <div>
                <Link href="/admin/orders" className="text-sm text-brand hover:underline">
                    ← Semua order
                </Link>
                <div className="mt-2 flex items-center justify-between">
                    <h1 className="text-3xl font-black">Order #{order.id}</h1>
                    <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            STATUS_STYLES[order.status as keyof typeof STATUS_STYLES] ?? "bg-stone-100 text-stone-800"
                        }`}
                    >
                        {STATUS_LABELS[order.status as keyof typeof STATUS_LABELS] ?? order.status}
                    </span>
                </div>
                <p className="mt-1 text-ink/60">
                    Waktu pesanan: {order.date} {order.time}
                </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Daftar Pizza</h2>
                <ul className="divide-y divide-black/5">
                    {order.lines.map((line, index) => (
                        <li key={index} className="py-3 flex items-center justify-between">
                            <div>
                                <Link
                                    href={`/admin/products/${line.pizzaId}`}
                                    className="font-semibold text-brand hover:underline"
                                >
                                    {line.name}
                                </Link>
                                <p className="text-xs text-ink/60">Ukuran: {line.size} · Jumlah: {line.quantity}</p>
                            </div>
                            <span className="font-medium">{formatPrice(line.price * line.quantity)}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-6 border-t border-black/10 pt-4 flex items-center justify-between text-base font-bold">
                    <span>Total Pembayaran</span>
                    <span className="text-lg text-brand">{formatPrice(order.total)}</span>
                </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-lg font-bold">Ubah Status</h2>
                <StatusActions orderId={order.id} status={order.status as OrderStatus} />
            </div>
        </section>
    );
}