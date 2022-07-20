export interface AddCurrencyPayload {
    method: AddCurrencyPayloadMethodKeys,
    currency_type: AddCurrencyPayloadCurrencyTypeKeys,
    value: number,
    userId: number
}

export  enum AddCurrencyPayloadMethodKeys{
    ADD = 'add',
    REMOVE = 'remove'
}

export enum AddCurrencyPayloadCurrencyTypeKeys{
    SOFT = 'soft',
    HARD = 'hard'
}