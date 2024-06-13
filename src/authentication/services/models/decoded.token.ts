export interface DecodedToken {
  data: {
    sub: string;
    email: string;
    password: string;
  };
}
