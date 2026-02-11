export type Diploma = {
  dateOfSubmission: string;
  description: string;
  fileUrl: null | string;
  member1: string;
  member2: string;
  mentor: string;
  status: string;
  student: string;
  title: string;
};

export type MentorSummary = {
  mentor: string;
  totalDiplomas: number;
  diplomas: Diploma[];
};
