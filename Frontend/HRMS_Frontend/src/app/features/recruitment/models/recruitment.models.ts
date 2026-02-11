export interface Vacancy {
    vacancyId: number;
    jobTitle: string;
    departmentName: string;
    description: string;
    requirements: string;
    salaryRange: string;
    status: string; // 'Open', 'Closed', 'OnHold'
    postedDate: string;
    expiryDate: string;
    applicationCount: number;
}

export interface Candidate {
    candidateId: number;
    firstNameAr: string;
    lastNameAr: string;
    email: string;
    mobile: string;
    nationalityId: number;
}

export interface JobApplication {
    appId: number;
    vacancyId: number;
    candidateId: number;
    candidateName: string;
    status: string;
    applyDate: string;
}
