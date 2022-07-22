export interface ClubPostPayloadType{
    method: ClubPostPayloadTypeMethodKeys,
    clubId?: number,
    name?: string
}

export enum ClubPostPayloadTypeMethodKeys{
    CREATE = 'create',
    JOIN = 'join'
}