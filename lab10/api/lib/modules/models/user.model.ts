export interface IUser {
   _id: string;
   email: string;
   name: string;
   role: 'user' | 'admin';
   active?: boolean;
   isAdmin?: boolean;
}
