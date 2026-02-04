import { getTask, updateTask } from "@/app/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "PARENT") {
        redirect("/");
    }

    const { id } = await params;
    const task = await getTask(id);

    if (!task) {
        return <div>Task not found</div>;
    }



    return (
        <div className="min-h-screen p-4 bg-gray-50">
            <header className="flex items-center gap-4 mb-8">
                <Link href="/parent" className="p-2 bg-white rounded-full border border-gray-300 hover:bg-gray-100">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">クエスト編集</h1>
            </header>

            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <form action={updateTask.bind(null, task.id)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">クエスト名</label>
                        <input
                            name="title"
                            defaultValue={task.title}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">詳細 (任意)</label>
                        <textarea
                            name="description"
                            defaultValue={task.description || ""}
                            className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-black mb-2">期限 (任意)</label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                name="dueDate_date"
                                defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            />
                            <input
                                type="time"
                                name="dueDate_time"
                                defaultValue={task.dueDate ? new Date(task.dueDate).toTimeString().slice(0, 5) : "18:00"}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        保存する
                    </button>
                    <Link
                        href="/parent"
                        className="w-full bg-gray-500 text-white font-bold py-4 rounded-xl hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                        キャンセル
                    </Link>
                </form>
            </div>
        </div>
    );
}
