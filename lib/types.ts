// User and authentication types
export type UserRole = 'super_admin' | 'artist_manager' | 'artist';

export interface UserProfile {
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    dob?: string;
    gender?: 'm' | 'f' | 'o';
    address?: string;
    phone?: string;
    confirmPassword?: string;
    first_release_year?: number;
    no_of_albums_released?: number;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    profile?: UserProfile;
}

export interface Artist {
    id: string;
    email: string;
    name?: string;
    displayName: string;
    first_release_year?: number;
    no_of_albums_released?: number;
    status: 'active' | 'pending' | 'inactive';
    createdAt: string;
    managerId?: string;
    managerName?: string;
}

export interface MusicTrack {
    id: string;
    title: string;
    album_name: string;
    genre: 'rnb' | 'country' | 'classic' | 'rock' | 'jazz';
    createdAt: string;
    artist_id: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
    rows: T[];
    pagination: Pagination;
}

export interface AuthContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<UserRole>;
    logout: () => void;
    register: (data: UserProfile) => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    getUserRole: () => UserRole | null;
}
