import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintService } from '../services/complaintService';
import { CreateComplaintInput } from '../types/complaint';

export function useHomeComplaints() {
  return useQuery({
    queryKey: ['home-complaints'],
    queryFn: () => complaintService.getHomeComplaints(),
    staleTime: 30000,
  });
}

export function useDefaultResident() {
  return useQuery({
    queryKey: ['default-resident'],
    queryFn: () => complaintService.getDefaultResident(),
    staleTime: 60000,
  });
}

export function useAnalyzeComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateComplaintInput) =>
      complaintService.createAndAnalyzeComplaint(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-complaints'] });
    },
  });
}

export function useSendToCommittee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (complaintId: string) =>
      complaintService.sendToCommittee(complaintId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-complaints'] });
    },
  });
}
