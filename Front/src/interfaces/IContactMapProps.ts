export interface IContactMapBranch {
  id: string | number;
  city: string;
  address: string;
  phone: string;
  workingHours: string;
  mapUrl?: string;
}

export interface IContactMapProps {
  branches: IContactMapBranch[];
  className?: string;
}
