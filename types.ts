
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
