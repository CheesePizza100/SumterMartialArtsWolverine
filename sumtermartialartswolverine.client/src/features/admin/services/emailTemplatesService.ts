import axiosInstance from '../../../core/config/axiosConfig';
import type { EmailTemplate, EmailTemplateDetail, UpdateEmailTemplateRequest } from '../models/emailTemplate.model';

const API_BASE = '/admin/email-templates';

export const emailTemplatesService = {
    // Get all email templates
    getAllTemplates: async (): Promise<EmailTemplate[]> => {
        const response = await axiosInstance.get<EmailTemplate[]>(API_BASE);
        return response.data;
    },

    // Get template by ID
    getTemplateById: async (id: number): Promise<EmailTemplateDetail> => {
        const response = await axiosInstance.get<EmailTemplateDetail>(`${API_BASE}/${id}`);
        return response.data;
    },

    // Update template
    updateTemplate: async (id: number, request: UpdateEmailTemplateRequest): Promise<any> => {
        const response = await axiosInstance.put(`${API_BASE}/${id}`, request);
        return response.data;
    }
};