
export interface UserInformation {
    readonly account: string;

    readonly agency: string;
}

export interface SimpleOperationDto extends UserInformation {
    value: number;
}

export interface UserRegisteredDto extends SimpleOperationDto {
    id: number;
}

interface ExternalReference {
    externalId?: string;
}

export interface BuyDto extends SimpleOperationDto, ExternalReference {
    cardNumber: string;
}

export interface CancellationDto extends UserInformation, ExternalReference {}

export interface OperationDTO extends ExternalReference {
    userId: number,

    value: number;
}

export interface ReversalDto extends UserInformation, ExternalReference {}