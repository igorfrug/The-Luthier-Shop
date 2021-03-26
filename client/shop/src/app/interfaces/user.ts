export default interface UserInterface {
    id?: number,
    name?: string,
    surname?: string,
    email?: string,
    password?: string,
    city?: string,
    street?: string,
    role: string,
    signedIn: boolean
}  
