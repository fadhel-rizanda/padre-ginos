"use client";

import { catchError } from "next/error";

export default catchError(
    ({ title, children }: { title: string; children: React.ReactNode }, { error, retry }) => {
        if (!error) return <>{children}</>;
        return (
            <div role="alert" className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="mt-2 text-sm text-red-700">Gagal memuat data ini.</p>
                <button
                    type="button"
                    onClick={() => retry()}
                    className="mt-3 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
                >
                    Coba lagi
                </button>
            </div>
        );
    },
);