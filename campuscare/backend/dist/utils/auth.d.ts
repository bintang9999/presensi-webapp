import { JwtPayload } from '../models/types';
export declare function generateToken(payload: JwtPayload): string;
export declare function verifyToken(token: string): JwtPayload;
export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(password: string, hash: string): Promise<boolean>;
export declare function generateReportCode(): string;
//# sourceMappingURL=auth.d.ts.map