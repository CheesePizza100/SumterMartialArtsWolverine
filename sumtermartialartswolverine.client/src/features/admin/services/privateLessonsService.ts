import axiosInstance from '../../../core/config/axiosConfig';
import type { PrivateLessonRequest, UpdateStatus } from '../models/privateLessonRequest.model';

const API_BASE = '/private-lessons';

export const adminPrivateLessonsService = {
    // Get all private lesson requests with filter
    getAllRequests: async (filter: string = 'Pending'): Promise<PrivateLessonRequest[]> => {
        const response = await axiosInstance.get<PrivateLessonRequest[]>(
            `${API_BASE}?filter=${filter}`
        );
        return response.data;
    },

    // Update request status
    updateStatus: async (requestId: number, status: string, rejectionReason?: string): Promise<UpdateStatus> => {
        const response = await axiosInstance.patch<UpdateStatus>(
            `${API_BASE}/${requestId}/status`,
            { status, rejectionReason }
        );
        return response.data;
    }
};