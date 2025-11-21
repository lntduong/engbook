import AudioButton from './AudioButton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface VocabItem {
    id: string;
    word: string;
    ipa: string;
    meaning: string;
    level: string;
    type?: string;
    lesson?: string;
    example?: string;
    dateAdded: number;
}

interface VocabTableProps {
    data: VocabItem[];
    startIndex: number;
}

export default function VocabTable({ data, startIndex }: VocabTableProps) {
    return (
        <Card className="overflow-hidden border-slate-100 shadow-lg bg-white/90 backdrop-blur-sm">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="w-16 text-slate-400 font-semibold">#</TableHead>
                        <TableHead className="text-slate-600 font-semibold">Word</TableHead>
                        <TableHead className="text-slate-600 font-semibold">IPA</TableHead>
                        <TableHead className="text-slate-600 font-semibold">Meaning</TableHead>
                        <TableHead className="text-slate-600 font-semibold">Level</TableHead>
                        <TableHead className="text-slate-600 font-semibold">Lesson</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <TableRow key={item.id} className="hover:bg-blue-50/50 transition-colors border-slate-100 group">
                                <TableCell className="font-medium text-slate-400">
                                    {startIndex + index + 1}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{item.word}</span>
                                        {item.type && <span className="text-xs text-slate-400 italic font-medium">({item.type})</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-slate-500 text-sm">
                                    <div className="flex items-center gap-2 bg-slate-50 w-fit px-2 py-1 rounded-md border border-slate-100">
                                        <span>{item.ipa}</span>
                                        <AudioButton text={item.word} />
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-700 font-medium">
                                    <div className="flex flex-col gap-1">
                                        <span>{item.meaning}</span>
                                        {item.example && (
                                            <span className="text-xs text-slate-500 italic border-l-2 border-blue-200 pl-2">
                                                {item.example}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={`
                      font-bold shadow-sm border-0
                      ${item.level === 'A1' || item.level === 'A2' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                                                item.level === 'B1' || item.level === 'B2' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                                                    'bg-rose-100 text-rose-700 hover:bg-rose-200'}
                    `}
                                    >
                                        {item.level}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-600 text-sm">
                                    {item.lesson || <span className="text-slate-300">—</span>}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <p className="text-lg font-medium text-slate-600">No vocabulary found</p>
                                    <p className="text-sm">Try adjusting your search or add a new word.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}
