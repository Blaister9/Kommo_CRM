 // src/services/excel/excel.service.js
const ExcelJS = require('exceljs');
const path = require('path');

class ExcelService {
    constructor() {
        this.workbookPath = path.join(__dirname, '../../../data/transactions.xlsx');
        this.workbook = new ExcelJS.Workbook();
    }

    async updateTransaction(paymentData) {
        try {
            await this.workbook.xlsx.readFile(this.workbookPath);
            const worksheet = this.workbook.getWorksheet('Transacciones');

            // Agregar nueva fila con la transacción
            const newRow = worksheet.addRow({
                fecha: new Date(),
                monto: paymentData.amount,
                estado: paymentData.status,
                referencia: paymentData.reference,
                cliente: paymentData.customerName
            });

            // Aplicar estilos básicos
            newRow.eachCell((cell) => {
                cell.border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                };
            });

            await this.workbook.xlsx.writeFile(this.workbookPath);
            return true;
        } catch (error) {
            console.error('Error updating Excel:', error);
            throw new Error('Failed to update Excel file');
        }
    }

    async getTransactionHistory(filters = {}) {
        try {
            await this.workbook.xlsx.readFile(this.workbookPath);
            const worksheet = this.workbook.getWorksheet('Transacciones');
            
            const transactions = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) { // Skip header
                    transactions.push({
                        fecha: row.getCell(1).value,
                        monto: row.getCell(2).value,
                        estado: row.getCell(3).value,
                        referencia: row.getCell(4).value,
                        cliente: row.getCell(5).value
                    });
                }
            });

            return transactions;
        } catch (error) {
            console.error('Error reading Excel:', error);
            throw new Error('Failed to read Excel file');
        }
    }
}

module.exports = ExcelService;
