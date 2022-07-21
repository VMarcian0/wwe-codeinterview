export interface ClubPostPayladType{
    method: ClubPostPayladTypeMethodKeys,
    clubId?: number,
    name?: string
}

export enum ClubPostPayladTypeMethodKeys{
    CREATE = 'create',
    JOIN = 'join'
}