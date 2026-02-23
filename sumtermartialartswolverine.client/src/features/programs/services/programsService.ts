import axiosInstance from '../../../core/config/axiosConfig';
import type { Program } from '../models/program.model';

const API_BASE = '/programs';

export const programsService = {
    // Get all programs
    getPrograms: async (): Promise<Program[]> => {
        const response = await axiosInstance.get<Program[]>(API_BASE);
        return response.data;
    },

    // Get single program by ID
    getProgramById: async (id: number): Promise<Program> => {
        const response = await axiosInstance.get<Program>(`${API_BASE}/${id}`);
        return response.data;
    }
};