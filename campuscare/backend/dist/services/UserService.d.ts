export declare class UserService {
    getAllUsers(): Promise<any[]>;
    getUserById(userId: number): Promise<any>;
    updateUser(userId: number, updates: any): Promise<boolean>;
    deleteUser(userId: number, adminId: number): Promise<boolean>;
    countUsers(): Promise<number>;
}
//# sourceMappingURL=UserService.d.ts.map