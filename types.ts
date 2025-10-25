export interface Member {
  memName: string;
  relation: string;
}

export interface AadhaarDetails {
  address: string;
  homeDistName: string;
  homeStateName: string;
  schemeName: string;
  allowed_onorc: string;
  members: Member[];
}

export interface NumberDetails {
  mobile: string;
  name: string;
  father: string;
  address: string;
  altMobile: string;
  circleIsp: string;
  aadhar: string;
  email: string;
}
