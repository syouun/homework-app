"use client";

import { updateTask } from "@/app/actions";
import { X, Save } from "lucide-react";
import { type Task } from "@prisma/client";
import { useState } from "react";

interface EditTaskModalProps {
    task: Task;
    onClose: () => void;
}

export default function EditTaskModal({ task, onClose }: EditTaskModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            await updateTask(task.id, formData);
            onClose();
        } catch (error) {
            console.error("Failed to update task", error);
            alert("更新に失敗しました。");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">クエスト編集</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        type="button"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </header>

                <div className="p-6">
                    <form action={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">クエスト名</label>
                            <input
                                name="title"
                                defaultValue={task.title}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-bold"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">詳細 (任意)</label>
                            <textarea
                                name="description"
                                defaultValue={task.description || ""}
                                className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">教科</label>
                            <select
                                name="subject"
                                defaultValue={task.subject || "OTHER"}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-medium"
                            >
                                <option value="MATH">算数・数学</option>
                                <option value="JAPANESE">国語</option>
                                <option value="ENGLISH">英語</option>
                                <option value="SCIENCE">理科</option>
                                <option value="SOCIAL">社会</option>
                                <option value="OTHER">その他</option>
                            </select>
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

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-500 text-white font-bold py-3 rounded-xl hover:bg-gray-600 transition-colors"
                                disabled={isSubmitting}
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                disabled={isSubmitting}
                            >
                                <Save className="w-5 h-5" />
                                {isSubmitting ? "保存中..." : "保存する"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
