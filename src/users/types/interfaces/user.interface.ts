interface IdpsInterface {
  _id?: string;
  provider?: string;
  userId?: string;
}

export interface MeInterface {
  _id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  idps?: IdpsInterface[];
  avatar: string;
  createdAt: string;
  updatedAt: string;
}
