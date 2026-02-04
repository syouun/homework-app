import { getBook, updateBook } from "../../../../actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditBookPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "PARENT") {
        redirect("/");
    }

    const { id } = await params;
    const book = await getBook(id);

    if (!book) {
        redirect("/parent/books");
    }

    const updateBookWithId = updateBook.bind(null, id);

    return (
        <div className="min-h-screen p-4 pb-20 bg-gray-50">
            <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-4">
                    <Link href="/parent/books" className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full">
                        <ArrowLeft />
                    </Link>
                    <h1 className="text-2xl font-bold text-[#E60012]">本を編集</h1>
                </div>
            </header>

            <div className="max-w-xl mx-auto">
                <div className="mario-card bg-white text-black border-4 border-[#009CDA] shadow-[8px_8px_0_rgba(0,0,0,0.2)]">
                    <form action={async (formData) => {
                        "use server";
                        await updateBookWithId(formData);
                        redirect("/parent/books");
                    }} className="space-y-6">
                        <div>
                            <label className="font-bold block mb-2">本のタイトル</label>
                            <input
                                name="title"
                                defaultValue={book.title}
                                placeholder="本のタイトル"
                                className="w-full p-3 border-4 border-black font-bold rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="font-bold block mb-2">著者</label>
                            <input
                                name="author"
                                defaultValue={book.author || ""}
                                placeholder="著者"
                                className="w-full p-3 border-4 border-black font-bold rounded"
                            />
                        </div>

                        <div>
                            <label className="font-bold block mb-2">参考URL (任意)</label>
                            <input
                                name="url"
                                defaultValue={book.url || ""}
                                placeholder="https://..."
                                className="w-full p-3 border-4 border-black font-bold rounded"
                            />
                            <p className="text-xs text-gray-500 mt-1">※URLを入力すると、自動的にプレビュー画像が更新されます。</p>
                        </div>

                        <div>
                            <label className="font-bold block mb-2">評価 (1-5)</label>
                            <input
                                name="rating"
                                type="number"
                                min="1"
                                max="5"
                                defaultValue={book.rating}
                                className="w-full p-3 border-4 border-black font-bold rounded"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Link href="/parent/books" className="flex-1 text-center font-bold p-3 bg-gray-200 hover:bg-gray-300 rounded border-2 border-gray-400">
                                キャンセル
                            </Link>
                            <button type="submit" className="flex-1 mario-btn bg-[#FBD000] text-black hover:bg-[#ffe066] shadow-[0_4px_0_#b39500]">
                                保存する
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
