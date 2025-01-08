function validatePayment(paymentData) {
    // Validar que existan los campos necesarios
    if (!paymentData) return false;
    
    const requiredFields = ['leadId', 'status', 'amount'];
    const hasAllFields = requiredFields.every(field => 
        paymentData.hasOwnProperty(field) && paymentData[field] !== null && paymentData[field] !== undefined
    );

    if (!hasAllFields) return false;

    // Validar que el monto sea un número positivo
    if (typeof paymentData.amount !== 'number' || paymentData.amount <= 0) return false;

    // Validar que el estado sea válido
    const validStatuses = ['pending', 'completed', 'failed', 'cancelled'];
    if (!validStatuses.includes(paymentData.status)) return false;

    return true;
}

module.exports = {
    validatePayment
}; 
