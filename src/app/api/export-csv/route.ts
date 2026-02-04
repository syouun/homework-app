import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "PARENT") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const tasks = await prisma.task.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true }
    });

    const books = await prisma.book.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true }
    });

    // BOM for Excel compatibility with UTF-8
    const BOM = "\uFEFF";
    const csvHeader = "ID,タイプ,タイトル,詳細/作者,ステータス/評価,期限/参照,完了日/作成日,担当\n";

    const taskRows = tasks.map(task => {
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleString('ja-JP') : "";
        const completedAt = task.completedAt ? new Date(task.completedAt).toLocaleString('ja-JP') : "";

        // Escape quotes
        const title = `"${task.title.replace(/"/g, '""')}"`;
        const description = task.description ? `"${task.description.replace(/"/g, '""')}"` : "";

        return `${task.id},クエスト,${title},${description},${task.status},${dueDate},${completedAt},${task.user.username}`;
    });

    const bookRows = books.map(book => {
        const createdAt = new Date(book.createdAt).toLocaleString('ja-JP');

        // Escape quotes
        const title = `"${book.title.replace(/"/g, '""')}"`;
        const author = book.author ? `"${book.author.replace(/"/g, '""')}"` : "";
        const url = book.url ? `"${book.url.replace(/"/g, '""')}"` : "";

        return `${book.id},読書記録,${title},${author},★${book.rating},${url},${createdAt},${book.user.username}`;
    });

    const csvRows = [...taskRows, ...bookRows].join("\n");

    return new NextResponse(BOM + csvHeader + csvRows, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": "attachment; filename=tasks.csv"
        }
    });
}
