"use client";

import { toggleTaskStatus, deleteTask } from "@/app/actions";
import { type Task } from "@prisma/client";
import { Calendar, CheckCircle, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import EditTaskModal from "./EditTaskModal";

interface ActiveQuestListProps {
    tasks: Task[];
}

export default function ActiveQuestList({ tasks }: ActiveQuestListProps) {
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-black">現在のクエスト</h2>
            {tasks.length === 0 ? (
                <div className="mario-card bg-gray-100 text-center py-8">
                    <p className="text-gray-500 font-bold">クエストがありません。追加してください！</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map((task) => {
                        // Calculate remaining time logic copied from ParentDashboard
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
                            <div key={task.id} className="mario-card flex justify-between items-center group">
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg">{task.title}</h3>
                                    {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
                                    {task.dueDate && (
                                        <div className="flex flex-col gap-0.5 mt-1">
                                            <div className="flex items-center gap-1 text-sm text-gray-600 font-bold">
                                                <Calendar className="w-4 h-4" />
                                                しめきり: {new Date(task.dueDate).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className={`text-sm font-black ${isOverdue ? "text-red-600 animate-pulse" : "text-blue-600"}`}>
                                                {isOverdue ? "⚠️ 期限切れ！" : `⏰ ${remainingText}`}
                                            </div>
                                        </div>
                                    )}
                                    <div className="mt-2 text-xs font-bold px-2 py-1 bg-red-100 text-red-600 inline-block rounded">
                                        未完了
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <form action={toggleTaskStatus.bind(null, task.id)}>
                                        <button className="flex items-center gap-1 px-3 py-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors text-green-700 font-bold">
                                            <CheckCircle className="w-4 h-4" />
                                            完了
                                        </button>
                                    </form>
                                    <button
                                        onClick={() => setEditingTask(task)}
                                        className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                                    >
                                        <Edit className="w-4 h-4 text-blue-600" />
                                    </button>
                                    <form action={deleteTask.bind(null, task.id)}>
                                        <button className="p-2 bg-gray-100 rounded-full hover:bg-red-100 transition-colors group/delete">
                                            <Trash2 className="text-gray-400 group-hover/delete:text-red-500" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                />
            )}
        </div>
    );
}
