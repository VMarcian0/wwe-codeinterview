export interface BasicDocumentType{
    /**
     * optionals due its creation by the database,
     * if some action is taken before it is registered the field will not exist
     */
    id?:number,
    createdAt?:string,
    updatedAt?:string
}