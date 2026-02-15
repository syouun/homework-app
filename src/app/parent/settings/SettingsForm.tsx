"use client";

import { updateChildGrade } from "@/app/actions";
import { useState } from "react";
import { Save } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            disabled={pending}
        >
            <Save className="w-6 h-6" />
            {pending ? "保存中..." : "設定を保存する"}
        </button>
    );
}

interface SettingsFormProps {
    initialGrade: string;
}

export function SettingsForm({ initialGrade }: SettingsFormProps) {
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        try {
            const grade = formData.get("grade") as string;
            await updateChildGrade(grade);
            setMessage("設定を保存しました！");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error(error);
            setMessage("保存に失敗しました。");
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-lg font-bold text-gray-700 mb-3">
                    お子様の学年
                </label>
                <div className="relative">
                    <select
                        name="grade"
                        className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 bg-gray-50 text-gray-800 font-bold appearance-none cursor-pointer"
                        defaultValue={initialGrade}
                    >
                        <optgroup label="小学生 (低学年)">
                            <option value="ELEMENTARY_1">小学1年生 (やさしい・ひらがな)</option>
                            <option value="ELEMENTARY_2">小学2年生</option>
                            <option value="ELEMENTARY_3">小学3年生</option>
                        </optgroup>
                        <optgroup label="小学生 (高学年)">
                            <option value="ELEMENTARY_4">小学4年生 (ていねい)</option>
                            <option value="ELEMENTARY_5">小学5年生</option>
                            <option value="ELEMENTARY_6">小学6年生</option>
                        </optgroup>
                        <optgroup label="中学生">
                            <option value="JUNIOR_HIGH_1">中学1年生 (論理的)</option>
                            <option value="JUNIOR_HIGH_2">中学2年生</option>
                            <option value="JUNIOR_HIGH_3">中学3年生</option>
                        </optgroup>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        ▼
                    </div>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl text-center font-bold ${message.includes("失敗") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                    {message}
                </div>
            )}

            <SubmitButton />
        </form>
    );
}
