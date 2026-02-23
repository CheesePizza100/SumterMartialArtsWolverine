import axiosInstance from '../../../core/config/axiosConfig';
import type { Instructor, InstructorProfile, InstructorStudent } from '../models/instructor.model';

const API_BASE = '/instructors';

export const instructorsService = {
    // Get all instructors
    getInstructors: async (): Promise<Instructor[]> => {
        const response = await axiosInstance.get<Instructor[]>(API_BASE);
        return response.data;
    },

    // Get single instructor by ID
    getInstructorById: async (id: number): Promise<Instructor> => {
        const response = await axiosInstance.get<Instructor>(`${API_BASE}/${id}`);
        return response.data;
    },

    // Get instructor profile (for instructor portal)
    getInstructorProfile: async (id: number): Promise<InstructorProfile> => {
        const response = await axiosInstance.get<InstructorProfile>(`${API_BASE}/${id}/profile`);
        return response.data;
    },

    // Get my profile (current logged-in instructor)
    getMyProfile: async (): Promise<InstructorProfile> => {
        const response = await axiosInstance.get<InstructorProfile>(`${API_BASE}/instructors/me`);
        return response.data;
    },

    // Get instructor's students
    getInstructorStudents: async (instructorId: number): Promise<InstructorStudent[]> => {
        const response = await axiosInstance.get<InstructorStudent[]>(`${API_BASE}/${instructorId}/students`);
        return response.data;
    },

    // Get my students (current logged-in instructor)
    getMyStudents: async (): Promise<InstructorStudent[]> => {
        const response = await axiosInstance.get<InstructorStudent[]>(`${API_BASE}/my-students`);
        return response.data;
    },

    getStudentDetail: async (studentId: number): Promise<InstructorStudent> => {
        const response = await axiosInstance.get<InstructorStudent>(`${API_BASE}/students/${studentId}`);
        return response.data;
    },

    // Record test result
    recordTestResult: async (studentId: number, testData: any): Promise<any> => {
        const response = await axiosInstance.post(`${API_BASE}/students/${studentId}/test-results`, testData);
        return response.data;
    },

    // Record attendance
    recordAttendance: async (studentId: number, data: { programId: number; classesAttended: number }): Promise<any> => {
        const response = await axiosInstance.post(`${API_BASE}/students/${studentId}/attendance`, data);
        return response.data;
    },

    updateProgramNotes: async (studentId: number, programId: number, notes: string): Promise<any> => {
        const response = await axiosInstance.put(
            `${API_BASE}/students/${studentId}/programs/${programId}/notes`,
            { notes }
        );
        return response.data;
    },

    // Create instructor (admin only)
    createInstructor: async (instructor: Partial<Instructor>): Promise<Instructor> => {
        const response = await axiosInstance.post<Instructor>(API_BASE, instructor);
        return response.data;
    },

    // Update instructor (admin only)
    updateInstructor: async (id: number, instructor: Partial<Instructor>): Promise<Instructor> => {
        const response = await axiosInstance.put<Instructor>(`${API_BASE}/${id}`, instructor);
        return response.data;
    },

    // Delete instructor (admin only)
    deleteInstructor: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${API_BASE}/${id}`);
    }
};