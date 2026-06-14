export type ProjectType = "security" | "quality";
export type ProjectPlatform = "web" | "mobile" | "desktop";
export type CertificateAuthority = "bank" | "afta" | "standards";

export type CreateProjectRequest = {
  projectName: string;
  version: string;
  letterNumber: string;
  type: ProjectType;
  platform: ProjectPlatform;
  certificateRequired: boolean;
  certificateAuthorities: CertificateAuthority[];
  projectManagerId: string;
  devopsManagerId: string;
  testEndDate: string;
};

export type CreateProjectResponse = CreateProjectRequest & {
  id: string;
  createdAt: string;
};
