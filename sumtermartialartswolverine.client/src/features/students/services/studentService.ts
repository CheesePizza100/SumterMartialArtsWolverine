import axiosInstance from '../../../core/config/axiosConfig';
import { StudentProfile, UpdateContactInfoRequest, PrivateLessonRequest } from '../models/student.model';

const API_BASE = '/students';

export const studentService = {
    // Get my profile (current logged-in student)
    getMyProfile: async (): Promise<StudentProfile> => {
        const response = await axiosInstance.get<StudentProfile>(`${API_BASE}/me`);
        return response.data;
    },

    // Update my contact info
    updateMyContactInfo: async (request: UpdateContactInfoRequest): Promise<any> => {
        const response = await axiosInstance.put(`${API_BASE}/me`, request);
        return response.data;
    },

    // Get my private lesson requests
    getMyPrivateLessonRequests: async (): Promise<PrivateLessonRequest[]> => {
        const response = await axiosInstance.get<PrivateLessonRequest[]>(`${API_BASE}/me/private-lessons`);
        return response.data;
    }
};