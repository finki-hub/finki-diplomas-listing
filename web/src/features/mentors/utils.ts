import type { Diploma, MentorSummary } from '@/types';

import { STATUS_STAGES } from './constants';

export const aggregateByMentor = (diplomas: Diploma[]): MentorSummary[] => {
  const mentorMap = new Map<string, Diploma[]>();

  for (const diploma of diplomas) {
    const mentor = diploma.mentor.trim();
    if (!mentor) continue;

    const existing = mentorMap.get(mentor);
    if (existing) {
      existing.push(diploma);
    } else {
      mentorMap.set(mentor, [diploma]);
    }
  }

  return Array.from(mentorMap.entries())
    .map(([mentor, mentorDiplomas]) => ({
      diplomas: mentorDiplomas,
      mentor,
      totalDiplomas: mentorDiplomas.length,
    }))
    .sort((a, b) => b.totalDiplomas - a.totalDiplomas);
};

export const getStatusOpacity = (status: string): number => {
  const lower = status.toLowerCase();

  for (const [keyword, stage] of STATUS_STAGES) {
    if (lower.includes(keyword)) {
      return 0.3 + (stage / 9) * 0.7;
    }
  }

  return 0.3;
};

export const getStatusStage = (status: string): null | number => {
  const lower = status.toLowerCase();

  for (const [keyword, stage] of STATUS_STAGES) {
    if (lower.includes(keyword)) {
      return stage;
    }
  }

  return null;
};

export const getSubmissionYear = (value: string): null | string => {
  const parts = value.split('.').filter(Boolean);
  if (parts.length !== 3) return null;

  const year = parts[2]?.trim();
  if (!year || !/^\d{4}$/u.test(year)) return null;

  return year;
};
