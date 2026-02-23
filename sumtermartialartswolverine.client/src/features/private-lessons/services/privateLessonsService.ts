import axiosInstance from '../../../core/config/axiosConfig';
import type { LessonTime, PrivateLessonRequest } from '../models/private-lesson.model';

const API_BASE = '/private-lessons';

export const privateLessonsService = {
    // Get instructor availability for next N days
    getInstructorAvailability: async (instructorId: number, days: number): Promise<LessonTime[]> => {
        const response = await axiosInstance.get<LessonTime[]>(
            `${API_BASE}/instructors/${instructorId}/availability`,
            { params: { days } }
        );
        return response.data;
    },

    // Submit private lesson request
    submitLessonRequest: async (request: PrivateLessonRequest): Promise<any> => {
        const response = await axiosInstance.post(`${API_BASE}/requests`, request);
        return response.data;
    }
};