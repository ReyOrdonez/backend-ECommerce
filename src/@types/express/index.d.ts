interface User {
  id: number;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

declare namespace Express {
  export interface Request {
    user: User | null;
  }
}
