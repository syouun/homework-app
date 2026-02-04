import { getBooks, addBook, deleteBook } from "../../actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Trash2, ArrowLeft, Edit } from "lucide-react";
import ClientOnly from "../../../components/ClientOnly";

export default async function ParentBooksPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "PARENT") {
        redirect("/");
    }

    const books = await getBooks();

    return (
        <ClientOnly>
            <div className="min-h-screen p-4 pb-20" suppressHydrationWarning>
                <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
                    <div className="flex items-center gap-4">
                        <Link href="/parent" className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full">
                            <ArrowLeft />
                        </Link>
                        <h1 className="text-2xl font-bold text-[#E60012]">図書室管理</h1>
                    </div>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="mario-card bg-[#40B133] text-white">
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
                                <label className="font-bold text-white">評価 (1-5)</label>
                                <input
                                    name="rating"
                                    type="number"
                                    min="1"
                                    max="5"
                                    defaultValue="3"
                                    className="w-full p-3 border-4 border-black font-bold"
                                />
                            </div>
                            <button type="submit" className="mario-btn w-full bg-[#FBD000] text-black hover:bg-[#ffe066] shadow-[0_4px_0_#b39500]">
                                図書室に追加
                            </button>
                        </form>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-black">読書記録</h2>
                        {books.map((book) => (
                            <div key={book.id} className="mario-card relative">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg">{book.title}</h3>
                                        <p className="text-sm opacity-70">{book.author}</p>
                                        <div className="text-[#FBD000] text-lg">
                                            {"★".repeat(book.rating)}
                                        </div>
                                    </div>
                                    <div className="flex items-center"> {/* Added a div to group buttons */}
                                        <form action={deleteBook.bind(null, book.id)}>
                                            <button className="p-2 bg-red-100 rounded-full hover:bg-red-200">
                                                <Trash2 className="text-red-600" />
                                            </button>
                                        </form>
                                        <Link href={`/parent/books/${book.id}/edit`} className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 ml-2">
                                            <Edit className="text-blue-600" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Link Preview Card */}
                                {book.url && (
                                    <a href={book.url} target="_blank" rel="noopener noreferrer" className="block mt-4 border-2 border-gray-200 rounded-lg overflow-hidden bg-white hover:bg-gray-50 transition-colors">
                                        <div className="flex h-32">
                                            <div className="w-32 flex-shrink-0 bg-gray-100 relative flex items-center justify-center border-r border-gray-100">
                                                {book.ogImage ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={book.ogImage}
                                                        alt={book.ogTitle || "Preview"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-4xl">🔗</span>
                                                )}
                                            </div>
                                            <div className="p-4 flex flex-col justify-center flex-grow min-w-0">
                                                <h4 className="font-bold text-sm line-clamp-2 mb-1 text-black">{book.ogTitle || book.title}</h4>
                                                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{book.ogDescription || "No description available"}</p>
                                                <p className="text-[10px] text-gray-400 truncate">{new URL(book.url).hostname}</p>
                                            </div>
                                        </div>
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ClientOnly>
    );
}
