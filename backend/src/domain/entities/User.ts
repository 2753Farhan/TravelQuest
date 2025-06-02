export interface User {
    id : string,
    name: string,
    email: string,
    createdAt: Date,
    updatedAt: Date
}


export class UserEntity implements User {
    public readonly id : string;
    public readonly name : string;
    public readonly email : string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(props: Omit<User, 'id'| 'createdAt' | 'updatedAt'>,id?:string){
        this.id = id || Math.random().toString(36).substring(2,9);
        this.name = props.name;
        this.email = props.email;
        this.createdAt = new Date();
        this.updatedAt = new Date();
       }
}