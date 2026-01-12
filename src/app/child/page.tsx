import { getTasks, toggleTaskStatus } from "../actions";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
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
                    {/* Mission List */}
                    <div>
                        <h2 className="text-3xl font-black text-black mb-6 text-center drop-shadow-none">
                            現在のクエスト
                        </h2>

                        {activeTasks.length === 0 ? (
                            <div className="bg-white/90 backdrop-blur border-8 border-[#40B133] rounded-3xl p-8 text-center animate-bounce">
                                <h3 className="text-2xl font-bold text-[#40B133] mb-2">クエストはありません！</h3>
                                <p className="font-bold opacity-70 text-black">遊びに行こう！</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeTasks.map((task) => {
                                    // Calculate remaining time
                                    let remainingText = "";
                                    let isOverdue = false;
                                    if (task.dueDate) {
                                        const now = new Date();
                                        const due = new Date(task.dueDate);
                                        const diff = due.getTime() - now.getTime();
                                        isOverdue = diff < 0;

                                        if (isOverdue) {
                                            remainingText = "期限切れ";
                                        } else {
                                            const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
                                            const diffHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                            const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                                            if (diffDays > 0) remainingText = `あと${diffDays}日${diffHours}時間`;
                                            else if (diffHours > 0) remainingText = `あと${diffHours}時間${diffMinutes}分`;
                                            else remainingText = `あと${diffMinutes}分`;
                                        }
                                    }

                                    return (
                                        <div key={task.id} className="group relative bg-white border-4 border-black rounded-xl p-4 shadow-[8px_8px_0_rgba(0,0,0,0.2)] hover:scale-105 transition-transform">
                                            <div className="absolute -left-3 -top-3 w-8 h-8 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center font-bold">
                                                !
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-bold text-xl mb-1 text-black">{task.title}</h3>
                                                    {task.description && <p className="text-sm text-black font-bold opacity-70 mb-1">{task.description}</p>}
                                                    {task.dueDate && (
                                                        <div className="flex flex-col gap-0.5">
                                                            <p className="text-sm text-gray-600 font-bold">
                                                                📅 しめきり: {new Date(task.dueDate).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                            <p className={`text-lg font-black ${isOverdue ? "text-red-500 animate-pulse" : "text-[#009BE5]"}`}>
                                                                {isOverdue ? "⚠️ 期限切れ！" : `⏰ ${remainingText}`}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <form action={toggleTaskStatus.bind(null, task.id)}>
                                                    <button className="font-black text-lg px-6 py-2 rounded-full border-2 border-black bg-[#FBD000] text-black hover:bg-[#ffe066] shadow-[0_4px_0_#b39500] active:translate-y-1 active:shadow-none transition-all">
                                                        できた！
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Completed Missions */}
                    {completedTasks.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-black text-white/80 mb-4 text-center">
                                完了したクエスト
                            </h2>
                            <div className="space-y-4 opacity-80">
                                {completedTasks.map((task) => (
                                    <div key={task.id} className="bg-gray-200 border-4 border-gray-400 rounded-xl p-4 grayscale group hover:grayscale-0 transition-all">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-xl mb-1 text-gray-700">{task.title}</h3>
                                            </div>
                                            <form action={toggleTaskStatus.bind(null, task.id)}>
                                                <button className="font-bold text-sm px-4 py-2 rounded-full border-2 border-gray-500 bg-white text-gray-500 hover:bg-gray-100 hover:text-red-500 hover:border-red-500 transition-colors">
                                                    戻す
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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
