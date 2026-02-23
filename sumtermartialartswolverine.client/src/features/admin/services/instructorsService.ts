import axiosInstance from '../../../core/config/axiosConfig';
import type { Instructor } from '../../instructors/models/instructor.model';

const API_BASE = '/instructors';

interface CreateLoginRequest {
    username: string;
    password?: string | null;
}

interface CreateLoginResponse {
    success: boolean;
    message: string;
    username: string;
    temporaryPassword: string;
    userId: string;
}

export const adminInstructorsService = {
    // Get all instructors
    getAllInstructors: async (): Promise<Instructor[]> => {
        const response = await axiosInstance.get<Instructor[]>(API_BASE);
        return response.data;
    },

    // Create instructor login
    createInstructorLogin: async (instructorId: number, request: CreateLoginRequest): Promise<CreateLoginResponse> => {
        const response = await axiosInstance.post<CreateLoginResponse>(
            `${API_BASE}/${instructorId}/create-login`,
            request
        );
        return response.data;
    }
};