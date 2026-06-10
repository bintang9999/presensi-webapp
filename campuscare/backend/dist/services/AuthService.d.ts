import { BaseUser } from '../models/BaseUser';
export declare class AuthService {
    register(nama: string, email: string, password: string, role?: 'pelapor' | 'admin'): Promise<any>;
    login(email: string, password: string): Promise<any>;
    getUserById(userId: number): Promise<BaseUser>;
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
    private generateToken;
    verifyToken(token: string): any;
}
//# sourceMappingURL=AuthService.d.ts.map