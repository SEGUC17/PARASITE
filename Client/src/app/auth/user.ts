export interface User {
    username: string;
    password?: string;
    confirmPassword?: string;
    address?: string;
    birthdate?: Date;
    children?: string[];
    email?: string;
    firstName?: string;
    lastName?: string;
    isAdmin?: boolean;
    isChild?: boolean;
    isParent?: boolean;
    isTeacher?: boolean;
    phone?: string;
    schedule?: any;
    studyPlans?: any;
    verified?: boolean;
    avatar?: String;
}
