import { Search, Filter, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    levelFilter: string;
    onLevelFilterChange: (value: string) => void;
    lessonFilter: string;
    onLessonFilterChange: (value: string) => void;
    lessonOptions: string[];
    pageSize: number;
    onPageSizeChange: (value: number) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function FilterBar({
    searchTerm,
    onSearchChange,
    levelFilter,
    onLevelFilterChange,
    lessonFilter,
    onLessonFilterChange,
    lessonOptions,
    pageSize,
    onPageSizeChange,
    currentPage,
    totalPages,
    onPageChange,
}: FilterBarProps) {
    const [levelOptions, setLevelOptions] = useState<string[]>([]);

    useEffect(() => {
        // Fetch level options from API
        fetch('/api/vocab/options')
            .then(res => res.json())
            .then(data => {
                if (data.levels) {
                    setLevelOptions(data.levels);
                }
            })
            .catch(err => console.error('Failed to fetch options:', err));
    }, []);

    return (
        <Card className="p-3 sm:p-4 mb-4 sm:mb-6 shadow-lg border-slate-100 bg-white/95 backdrop-blur-sm sticky top-16 z-40">
            <div className="flex flex-col gap-3">
                {/* Search + Filters Row */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    {/* Search */}
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search vocabulary..."
                            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>

                    {/* Level Filter */}
                    <div className="w-full sm:w-auto sm:min-w-[140px]">
                        <Select value={levelFilter} onValueChange={onLevelFilterChange}>
                            <SelectTrigger className="bg-slate-50 border-slate-200 w-full">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-slate-500 flex-shrink-0" />
                                    <SelectValue placeholder="Level" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Levels</SelectItem>
                                {levelOptions.map(level => (
                                    <SelectItem key={level} value={level}>
                                        {level}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Lesson Filter */}
                    <div className="w-full sm:w-auto sm:min-w-[140px]">
                        <Select value={lessonFilter} onValueChange={onLessonFilterChange}>
                            <SelectTrigger className="bg-slate-50 border-slate-200 w-full">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-slate-500 flex-shrink-0" />
                                    <SelectValue placeholder="Lesson" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Lessons</SelectItem>
                                {lessonOptions.map(lesson => (
                                    <SelectItem key={lesson} value={lesson}>
                                        {lesson}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Pagination Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 font-medium">Show:</span>
                        <Select value={pageSize.toString()} onValueChange={(val) => onPageSizeChange(Number(val))}>
                            <SelectTrigger className="w-[70px] h-9 bg-slate-50 border-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200 justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="h-8 px-2 sm:px-3 hover:bg-white hover:shadow-sm text-xs sm:text-sm"
                        >
                            Previous
                        </Button>
                        <span className="text-xs sm:text-sm font-medium text-slate-600 min-w-[3rem] text-center">
                            {currentPage} / {totalPages || 1}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="h-8 px-2 sm:px-3 hover:bg-white hover:shadow-sm text-xs sm:text-sm"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
