type Coordinate = {
  lat: string;
  lng: string;
};

type Pothole = {
  creatorUID: string;
  deletorUID?: string;
  dateCreated: string;
  dateRemoved?: string;
  coordinates: Coordinate;
  status?: string;
};

type user = {
  fname: string;
  lname: string;
  dotEmployee: boolean;
  dotID: string;
  email: string;
  phone: string;
  zipcode: string;
  lat: string;
  long: string;
  locality: string;
};

type geoPos = {
  data: Array<geoInfo>;
};

type geoInfo = {
  latitude: string;
  longitude: string;
  locality: string;
};

export { Coordinate, Pothole, user, geoPos, geoInfo };
