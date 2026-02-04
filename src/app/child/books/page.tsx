import { getBooks, addBook } from "../../actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ClientOnly from "../../../components/ClientOnly";
import LogoutButton from "../../../components/LogoutButton";

export default async function ChildBooksPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");

    const books = await getBooks();

    return (
        <ClientOnly>
            <div className="min-h-screen p-4 bg-[url('/bg-pattern.png')] md:bg-none" suppressHydrationWarning>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/child" className="p-3 bg-white border-4 border-black rounded-full shadow-[4px_4px_0_#000] hover:scale-105 active:scale-95 transition-transform text-black">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="text-3xl font-black text-white drop-shadow-[4px_4px_0_#000]">僕の図書室</h1>
                    </div>
                    <LogoutButton />
                </div>

                {/* Add Book Form (Simple) */}
                {/* Add Book Form (Mario Style) */}
                <div className="mario-card bg-[#40B133] text-white p-6 rounded-2xl shadow-[4px_4px_0_rgba(0,0,0,0.1)] mb-8">
                    <h2 className="text-xl font-bold mb-4">本の記録を追加</h2>
                    <form action={addBook} className="space-y-4 text-black">
                        <input
                            name="title"
                            placeholder="本のタイトル"
                            className="w-full p-3 border-4 border-black font-bold"
                            required
                        />
                        <input
                            name="author"
                            placeholder="著者"
                            className="w-full p-3 border-4 border-black font-bold"
                        />
                        <input
                            name="url"
                            placeholder="参考URL (任意)"
                            className="w-full p-3 border-4 border-black font-bold"
                        />
                        <div>
                            <label className="font-bold text-white block mb-1">評価 (1-5)</label>
                            <input
                                name="rating"
                                type="number"
                                min="1"
                                max="5"
                                defaultValue="3"
                                className="w-full p-3 border-4 border-black font-bold"
                            />
                        </div>
                        <button type="submit" className="mario-btn w-full bg-[#FBD000] text-black hover:bg-[#ffe066] shadow-[0_4px_0_#b39500] p-3 font-bold">
                            図書室に追加
                        </button>
                    </form>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {books.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white/90 rounded-3xl border-4 border-black">
                            <p className="text-2xl font-bold text-gray-500">本を読もう！</p>
                        </div>
                    ) : (
                        books.map((book) => (
                            <div key={book.id} className="relative bg-white border-4 border-black rounded-xl p-4 shadow-[8px_8px_0_#000] hover:scale-[1.02] transition-transform">
                                {book.url ? (
                                    <a href={book.url} target="_blank" rel="noopener noreferrer" className="block">
                                        <div className="flex gap-4">
                                            {book.ogImage ? (
                                                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={book.ogImage}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-24 h-24 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center text-4xl border-2 border-blue-200">
                                                    🔗
                                                </div>
                                            )}
                                            <div className="flex-grow min-w-0">
                                                <h3 className="font-bold text-xl mb-1 truncate">{book.title}</h3>
                                                <p className="text-sm font-bold opacity-70 mb-2 truncate">{book.author}</p>
                                                <div className="text-yellow-400 text-lg">
                                                    {"★".repeat(book.rating)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs text-blue-500 font-bold truncate">
                                            🔗 {new URL(book.url).hostname} を見る
                                        </div>
                                    </a>
                                ) : (
                                    <div className="flex gap-4">
                                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center text-4xl border-2 border-gray-200">
                                            📖
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl mb-1">{book.title}</h3>
                                            <p className="text-sm font-bold opacity-70 mb-2">{book.author}</p>
                                            <div className="text-yellow-400 text-lg">
                                                {"★".repeat(book.rating)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div >
        </ClientOnly>
    );
}
