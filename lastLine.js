import fs from 'fs';
import xlsx from 'xlsx';

// Função para contar o número de linhas na planilha que contêm valores
function countRowsInExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assumindo que estamos lendo a primeira planilha
  const worksheet = workbook.Sheets[sheetName];
  const range = xlsx.utils.decode_range(worksheet['!ref']);

  let rowCount = 0;

  // Iterar sobre cada linha e verificar se contém algum valor
  for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    let rowHasValues = false;

    // Iterar sobre cada célula da linha e verificar se contém algum valor
    for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
      const cellAddress = xlsx.utils.encode_cell({ r: rowNum, c: colNum });
      const cell = worksheet[cellAddress];

      if (cell && cell.v !== undefined && cell.v !== null && cell.v !== '') {
        rowHasValues = true;
        break; // Se encontrar um valor em qualquer célula da linha, podemos parar de verificar
      }
    }

    if (rowHasValues) {
      rowCount++;
      }
    }

    return rowCount;
  }

// Caminho para o arquivo Excel
const excelFilePath = './nobre/base/abril.xlsx';

// Contar o número de linhas no arquivo Excel que contêm valores
//const totalRows = countRowsInExcel(excelFilePath);
//console.log('Número total de linhas com valores:', totalRows);

export {
  countRowsInExcel
}
