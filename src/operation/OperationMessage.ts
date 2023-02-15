enum OperationMessage {
    DUPLICATED_BUY = 'Duplicate buy operation',
    INSUFFICIENT_BALANCE = 'Insufficient balance to buy',

    OPERATION_SUCCESSFULLY = 'operation performed successfully',

    CANCELLATION_CANCELLED = 'External reference not found or already cancelled',

    REVERSAL_CANCELLED = 'External reference not found or already cancelled'
}

export default OperationMessage;