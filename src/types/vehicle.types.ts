export interface Vehicle {
  id: number;
  name: string;
  plate_number: string;
  category: string;
  daily_rate: number;
  photo_path: string | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface VehicleCreateRequest {
  name: string;
  plate_number: string;
  category: string;
  daily_rate: number;
  photo?: Express.Multer.File;
}

export interface VehicleUpdateRequest {
  name?: string;
  plate_number?: string;
  category?: string;
  daily_rate?: number;
  photo?: Express.Multer.File;
}

export interface VehicleQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
