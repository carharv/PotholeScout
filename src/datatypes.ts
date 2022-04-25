type Coordinate = {
  lat: string;
  lng: string;
};

type Pothole = {
  creatorUID: string;
  creatorName: string;
  deletorEmpID?: string;
  dateCreated: string;
  dateRemoved?: string;
  coordinates: Coordinate;
  filled: string;
  image: string;
};

type PotholeContainer = {
  pothole: Pothole;
  originalIndex: string;
};

type ReportContainer = {
  pothole: Pothole;
  type: string;
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

export {
  Coordinate,
  Pothole,
  PotholeContainer,
  user,
  geoPos,
  geoInfo,
  ReportContainer,
};
