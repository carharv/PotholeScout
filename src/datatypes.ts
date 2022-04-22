type Coordinate = {
  lat: string;
  lng: string;
};

type Pothole = {
  creatorUID: string;
  deletorUID?: string;
  dateCreated?: string;
  dateRemoved?: Date;
  coordinates: Coordinate;
  filled: string;
};

export { Coordinate, Pothole };
