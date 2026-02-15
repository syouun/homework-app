import { getTasks, createTask, deleteTask, toggleTaskStatus } from "../actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Trash2, Settings } from "lucide-react";
import Link from "next/link";

import LogoutButton from "@/components/LogoutButton";
import ClientOnly from "@/components/ClientOnly";
import ActiveQuestList from "@/components/ActiveQuestList";

export default async function ParentDashboard() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "PARENT") {
        redirect("/");
    }

    const tasks = await getTasks();
    const activeTasks = tasks.filter(t => t.status === "TODO");
    const completedTasks = tasks.filter(t => t.status === "DONE");

    return (
        <ClientOnly>
            <div className="min-h-screen p-4 pb-20" suppressHydrationWarning>
                <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
                    <div>
                        <h1 className="text-2xl font-bold text-[#E60012]">保護者画面</h1>
                        <div className="text-sm font-bold">ログイン中: {session.user.username}</div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/parent/settings"
                            className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center border-2 border-black"
                            title="設定"
                        >
                            <Settings className="w-6 h-6" />
                        </Link>
                        <a
                            href="/api/export-csv"
                            download="tasks.csv"
                            className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center border-2 border-black"
                        >
                            CSV出力
                        </a>
                        <LogoutButton />
                    </div>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Add Quest Form */}
                    <div className="mario-card bg-[#E60012] text-white">
                        <h2 className="text-xl font-bold mb-4">新しいクエストを追加</h2>
                        <form action={createTask} className="space-y-4 text-black">
                            <input
                                name="title"
                                placeholder="クエスト名 (例: 数学ドリル)"
                                className="w-full p-3 border-4 border-black font-bold"
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="詳細 (任意)"
                                className="w-full p-3 border-4 border-black font-bold"
                            />
                            <div>
                                <label className="block text-black text-sm font-bold mb-1">期限 (任意)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        name="dueDate_date"
                                        className="w-full p-3 border-4 border-black font-bold"
                                    />
                                    <input
                                        type="time"
                                        name="dueDate_time"
                                        className="w-full p-3 border-4 border-black font-bold"
                                        defaultValue="18:00"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="mario-btn w-full bg-[#FBD000] text-black hover:bg-[#ffe066] shadow-[0_4px_0_#b39500]">
                                クエスト追加
                            </button>
                        </form>
                    </div>

                    <div className="space-y-8">
                        {/* Library Link */}
                        <Link href="/parent/books" className="block mario-card bg-[#40B133] text-white hover:scale-105 transition-transform group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">図書室管理</h2>
                                    <p className="text-sm opacity-90">読んだ本の記録</p>
                                </div>
                                <div className="text-4xl group-hover:rotate-12 transition-transform">📚</div>
                            </div>
                        </Link>

                        {/* Task List */}
                        <ActiveQuestList tasks={activeTasks} />


                        {/* Completed Task List */}
                        {completedTasks.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-xl font-bold mb-4 text-gray-600">完了したクエスト</h2>
                                <div className="space-y-4">
                                    {completedTasks.map((task) => (
                                        <div key={task.id} className="mario-card flex justify-between items-center group bg-gray-50 border-gray-300">
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-lg text-gray-500 line-through">{task.title}</h3>
                                                {task.completedAt && (
                                                    <div className="text-xs text-green-600 font-bold">
                                                        完了日: {new Date(task.completedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' })}
                                                    </div>
                                                )}
                                                <div className="mt-2 text-xs font-bold px-2 py-1 bg-green-100 text-green-700 inline-block rounded">
                                                    完了済み
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <form action={toggleTaskStatus.bind(null, task.id)}>
                                                    <button className="text-sm text-gray-400 underline hover:text-gray-600">
                                                        未完了に戻す
                                                    </button>
                                                </form>
                                                <form action={deleteTask.bind(null, task.id)}>
                                                    <button className="p-2 bg-gray-100 rounded-full hover:bg-red-100 transition-colors group/delete">
                                                        <Trash2 className="text-gray-400 group-hover/delete:text-red-500" />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </ClientOnly>
    );
}
