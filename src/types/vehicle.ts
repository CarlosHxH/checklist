export interface VehicleKey {
    id: string
    userId: string
    vehicleId: string
    createdAt: Date
    updatedAt: Date
    parentId?: string
    user:{
      name: string;
    };
    vehicle: {
      model: string;
      plate: string;
    }
  }