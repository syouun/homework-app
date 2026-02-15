import { updateChildGrade } from "@/app/actions";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsForm } from "./SettingsForm";



export default async function SettingsPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "PARENT") {
        redirect("/");
    }

    // Find the child (assuming single child for MVP)
    const child = await prisma.user.findFirst({ where: { role: "CHILD" } });
    const currentGrade = child?.grade || "ELEMENTARY_1";

    return (
        <div className="min-h-screen bg-sky-100 p-4 md:p-8 font-sans">
            <div className="max-w-2xl mx-auto space-y-6">
                <header className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-sky-200">
                    <Link href="/parent" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-sky-600" />
                    </Link>
                    <h1 className="text-2xl font-black text-sky-600 tracking-tight">設定</h1>
                </header>

                <main className="space-y-6">
                    <section className="bg-white rounded-3xl shadow-xl overflow-hidden border border-sky-100">
                        <div className="bg-sky-500 p-6 text-white text-center">
                            <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                                <span>AI先生の設定</span>
                            </h2>
                        </div>
                        <div className="p-6 md:p-8 space-y-6">
                            <p className="text-gray-600 text-sm">
                                お子様の学年に合わせて、AI先生（チャットボット）の言葉遣いや教え方が変わります。
                            </p>

                            <SettingsForm initialGrade={currentGrade} />
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
