"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.ok) {
            router.push("/");
            router.refresh();
        } else {
            alert("Login failed!");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4" suppressHydrationWarning>
            <div className="text-center mb-8 animate-bounce">
                <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-[4px_4px_0_#000]">
                    宿題<br />アドベンチャー
                </h1>
            </div>

            <div className="mario-card w-full max-w-md bg-[#FBD000]">
                <h2 className="text-2xl font-bold text-center mb-6 text-[#E60012]">ゲームスタート</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-bold mb-1">プレイヤー名</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border-4 border-black font-bold text-lg"
                            placeholder="username"
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">パスワード</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border-4 border-black font-bold text-lg pr-12"
                                placeholder="******"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 opacity-70 hover:opacity-100"
                                onMouseDown={() => setShowPassword(true)}
                                onMouseUp={() => setShowPassword(false)}
                                onMouseLeave={() => setShowPassword(false)}
                                onTouchStart={() => setShowPassword(true)}
                                onTouchEnd={() => setShowPassword(false)}
                            >
                                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full mario-btn mt-4 text-xl"
                    >
                        スタート！
                    </button>
                </form>

                <div className="mt-4 text-center text-sm font-bold opacity-70">
                    <p>ヒント: parent / password123</p>
                    <p>ヒント: shoma / shoma123</p>
                </div>
            </div>
        </div>
    );
}
