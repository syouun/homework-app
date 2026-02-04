import { getTasks } from "../actions";
import ChildTaskList from "../../components/ChildTaskList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../../components/LogoutButton";
import ClientOnly from "../../components/ClientOnly";

export default async function ChildDashboard() {
    const session = await getServerSession(authOptions);
    if (!session) { // Allow accessing if just viewing? No, strict auth.
        redirect("/");
    }

    const tasks = await getTasks();
    const activeTasks = tasks.filter(t => t.status === "TODO");
    const completedTasks = tasks.filter(t => t.status === "DONE");

    return (
        <ClientOnly>
            <div className="min-h-screen p-4 pb-20 bg-[url('/bg-pattern.png')] md:bg-none" suppressHydrationWarning>
                {/* Fake Header/Status Bar */}
                <div className="flex justify-between items-center mb-6 text-white font-bold text-xl drop-shadow-[2px_2px_0_#000]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full border-4 border-white flex items-center justify-center text-3xl shadow-lg">
                            🙂
                        </div>
                        <div>
                            <div>PLAYER: {session.user.username === "shoma" ? "匠真" : session.user.username}</div>
                            <div className="text-sm opacity-90">LEVEL 1</div>
                        </div>
                    </div>
                    <LogoutButton />
                </div>

                <div className="max-w-2xl mx-auto space-y-8">
                    <ChildTaskList activeTasks={activeTasks} completedTasks={completedTasks} />

                    {/* Library Button */}
                    <div className="text-center">
                        <Link href="/child/books" className="inline-block bg-[#009BE5] text-white font-black text-2xl py-4 px-12 rounded-full border-4 border-white shadow-[0_8px_0_#006494] active:translate-y-2 active:shadow-none transition-all hover:brightness-110">
                            図書室へワープ
                        </Link>
                    </div>
                </div>
            </div>
        </ClientOnly>
    );
}
