export interface PrivateLessonDialogData {
    instructorId: number;
    instructorName: string;
}

export interface PrivateLessonRequest {
    instructorId: number;
    studentName: string;
    studentEmail: string;
    studentPhone?: string;
    requestedStart: string;
    requestedEnd: string;
    notes?: string;
}

export interface LessonTime {
    start: string;
    end: string;
}