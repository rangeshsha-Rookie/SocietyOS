import { api } from './api';
import {
  CreateComplaintInput,
  ComplaintAnalysisResponse,
  HomeComplaintsResponse,
  Resident,
} from '../types/complaint';

export const complaintService = {
  async getHomeComplaints(): Promise<HomeComplaintsResponse> {
    const response = await api.get<HomeComplaintsResponse>('/complaints');
    return response.data;
  },

  async getDefaultResident(): Promise<{ resident: Resident }> {
    const response = await api.get<{ resident: Resident }>('/residents/default');
    return response.data;
  },

  async createAndAnalyzeComplaint(
    input: CreateComplaintInput
  ): Promise<ComplaintAnalysisResponse> {
    const response = await api.post<ComplaintAnalysisResponse>('/complaints', {
      description: input.description,
      wing: input.wing,
      flatNumber: input.flatNumber,
      residentId: input.residentId,
    });
    return response.data;
  },

  async sendToCommittee(
    complaintId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(
      `/complaints/${complaintId}/committee`
    );
    return response.data;
  },
};
