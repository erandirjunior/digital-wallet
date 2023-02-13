
interface UserInformation {
    readonly account: string;

    readonly agency: string;
}

interface ExternalReference {
    externalId: string;
}

export interface OperationDto extends UserInformation {
    value: number;
}

export interface BuyDto extends OperationDto, ExternalReference {
    readonly cardNumber: string;
}

export interface CancellationDto extends UserInformation, ExternalReference {}

export interface ReversalDto extends CancellationDto {}

export interface OperationRegisteredDto extends ExternalReference {
    readonly id: number,
    readonly value: number,
}