import Link from "next/link";
import { Suspense } from "react";
import WidgetErrorBoundary from "@/app/admin/WidgetErrorBoundary";
import {LatestDayWidget, StatusWidget, TopPizzasWidget, WidgetSkeleton} from "@/app/admin/OverviewWidgets";

export default function AdminHome() {
    return (
        <section>
            <h1 className="text-3xl font-black">Overview</h1>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Suspense fallback={<WidgetSkeleton title="Hari terakhir" />}>
                    <LatestDayWidget />
                </Suspense>

                <WidgetErrorBoundary title="Status order hari ini">
                    <Suspense fallback={<WidgetSkeleton title="Status order hari ini" />}>
                        <StatusWidget />
                    </Suspense>
                </WidgetErrorBoundary>

                <Suspense fallback={<WidgetSkeleton title="Terlaris sepanjang masa" />}>
                    <TopPizzasWidget />
                </Suspense>
            </div>

            <div className="mt-6 flex gap-4">
                <Link href="/admin/products" className="rounded-xl bg-white px-5 py-4 font-semibold shadow-sm">
                    Kelola produk →
                </Link>
                <Link href="/admin/orders" className="rounded-xl bg-white px-5 py-4 font-semibold shadow-sm">
                    Lihat order →
                </Link>
            </div>
        </section>
    );
}