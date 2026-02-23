import axiosInstance from '../../../core/config/axiosConfig';
import type { Student, Attendance } from '../models/student.model';

const API_BASE = '/admin/students';

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

interface SuccessResponse {
    success: boolean;
    message: string;
}

export const adminStudentsService = {
    // Get all students
    getAllStudents: async (): Promise<Student[]> => {
        const response = await axiosInstance.get<Student[]>(API_BASE);
        return response.data;
    },

    // Get student by ID
    getStudentById: async (id: number): Promise<Student> => {
        const response = await axiosInstance.get<Student>(`${API_BASE}/${id}`);
        return response.data;
    },

    // Search students
    searchStudents: async (searchTerm: string): Promise<Student[]> => {
        const response = await axiosInstance.get<Student[]>(`${API_BASE}/search`, {
            params: { q: searchTerm }
        });
        return response.data;
    },

    // Update student
    updateStudent: async (id: number, student: {
        name?: string;
        email?: string;
        phone?: string;
    }): Promise<Student> => {
        const response = await axiosInstance.put<Student>(`${API_BASE}/${id}`, student);
        return response.data;
    },

    // Add test result
    addTestResult: async (studentId: number, testData: {
        programId: number;
        programName: string;
        rank: string;
        result: string;
        notes: string;
        testDate: string;
    }): Promise<SuccessResponse> => {
        const response = await axiosInstance.post<SuccessResponse>(
            `${API_BASE}/${studentId}/test-results`,
            testData
        );
        return response.data;
    },

    // Get attendance details
    getAttendanceDetails: async (studentId: number): Promise<Attendance> => {
        const response = await axiosInstance.get<Attendance>(`${API_BASE}/${studentId}/attendance`);
        return response.data;
    },

    // Create student
    createStudent: async (student: {
        name: string;
        email: string;
        phone: string;
    }): Promise<Student> => {
        const response = await axiosInstance.post<Student>(API_BASE, student);
        return response.data;
    },

    // Create student login
    createStudentLogin: async (studentId: number, request: CreateLoginRequest): Promise<CreateLoginResponse> => {
        const response = await axiosInstance.post<CreateLoginResponse>(
            `${API_BASE}/${studentId}/create-login`,
            request
        );
        return response.data;
    },

    // Enroll in program
    enrollInProgram: async (studentId: number, enrollment: {
        programId: number;
        programName: string;
        initialRank: string;
    }): Promise<SuccessResponse> => {
        const response = await axiosInstance.post<SuccessResponse>(
            `${API_BASE}/${studentId}/enroll`,
            enrollment
        );
        return response.data;
    },

    // Record attendance
    recordAttendance: async (
        studentId: number,
        programId: number,
        classesAttended: number
    ): Promise<SuccessResponse> => {
        const response = await axiosInstance.post<SuccessResponse>(
            `${API_BASE}/${studentId}/attendance`,
            { programId, classesAttended }
        );
        return response.data;
    },

    // Deactivate student
    deactivateStudent: async (studentId: number): Promise<SuccessResponse> => {
        const response = await axiosInstance.delete<SuccessResponse>(
            `${API_BASE}/${studentId}`
        );
        return response.data;
    }
};