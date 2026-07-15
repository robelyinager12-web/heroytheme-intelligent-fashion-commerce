export interface BrandNode {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  isActive: boolean;
}

export interface CreateBrandInput {
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
}

export interface UpdateBrandInput {
  name?: string;
  slug?: string;
  logoUrl?: string;
  description?: string;
  isActive?: boolean;
}