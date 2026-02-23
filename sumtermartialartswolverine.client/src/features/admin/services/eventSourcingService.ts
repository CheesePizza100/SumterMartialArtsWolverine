import axiosInstance from '../../../core/config/axiosConfig';
import type { ProgressionAnalytics, StudentEvent, StudentRankAtDate } from '../models/eventSourcing.model';

const API_BASE = '/admin';

export const eventSourcingService = {
    // Get progression analytics
    getProgressionAnalytics: async (programId?: number): Promise<ProgressionAnalytics> => {
        const url = programId
            ? `${API_BASE}/students/analytics/progression?programId=${programId}`
            : `${API_BASE}/students/analytics/progression`;

        const response = await axiosInstance.get<ProgressionAnalytics>(url);
        return response.data;
    },

    // Get student event stream
    getStudentEventStream: async (studentId: number, programId: number): Promise<StudentEvent[]> => {
        const response = await axiosInstance.get<StudentEvent[]>(
            `${API_BASE}/students/${studentId}/programs/${programId}/events`
        );
        return response.data;
    },

    // Get student rank at specific date
    getStudentRankAtDate: async (
        studentId: number,
        programId: number,
        asOfDate: string
    ): Promise<StudentRankAtDate> => {
        const response = await axiosInstance.get<StudentRankAtDate>(
            `${API_BASE}/students/${studentId}/programs/${programId}/rank-at-date`,
            { params: { asOfDate } }
        );
        return response.data;
    }
};