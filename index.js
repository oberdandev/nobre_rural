import fs from 'node:fs';
import xlsx from 'xlsx';
import pkg from 'pg';
import { countRowsInExcel } from './lastLine.js';

const { Client } = pkg;

const tableColumn = `nome, cpf, cargo`

const tabNobreCreate = `CREATE TABLE IF NOT EXISTS "TAB_NOBRE_SEMSA" (
  ano int2,
  mes int2,
  cnes varchar(7),
  ine varchar(7),
  cns varchar(15),
  profissional varchar(255),
  cbo varchar(6),
  cbo_descricao varchar(255),
  procedimento varchar(255),
  meta int2
)`

const dbConfig = {
  user: 'postgres',
  host: '10.50.0.175',
  database: 'esus',
  password: 'admin',
  port: 5432,
};

const isEmptyOrContainsOnlyEmptyStrings = (arr) => {
  // Check if the array is empty
  if (arr.length === 0) {
    return true;
  }
  
  // Check if all elements in the array are empty strings
  return arr.every(item => item === '');
};

const insertIntoDatabase = async (data, client, rowIndex) => {
  try {

    const query = {
      text: `INSERT INTO "TAB_NOBRE_SEMSA" (${tableColumn}) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      values: data,
    }
    
    await client.query(query);
    console.log(`dados inseridos com sucesso! na linha ${rowIndex}`)

  }catch(err){
    console.log(`Error ao tentar inserir dados no banco de dados: ${err}`);
  }
}

const readExcelAndInsertData = async (filePath) => {
  const client = new Client(dbConfig);
  await client.connect();

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assumindo que estamos lendo a primeira planilha
  const worksheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (isEmptyOrContainsOnlyEmptyStrings(row)) {
        console.log(`sem dados a adicionar na linha ${i+1}`);
        continue; // Ignora linhas em branco ou com dados inválidos
    }

    const data = [
      row[0], 
      row[1], 
      row[2],
      row[3],
      row[4], 
      row[5],
      row[6],
      row[7],
      row[8],
      row[9],
    ];

    

    await insertIntoDatabase(data, client, i);
  }
};

const path = './nobre/base/abril.xlsx';

const arrPaths = fs.readdirSync('./nobre/base');
console.log(arrPaths); 

const paths = arrPaths.map(path => {
  return `./nobre/base/${path}`; 
})

for(let path of paths){
  console.log(`path: ${path}, total de linhas: ${countRowsInExcel(path)}`)
}

console.log(paths)


const main = async () => {
  const client = new Client(dbConfig);
  await client.connect();
  await client.query('DROP TABLE IF EXISTS "TAB_NOBRE_SEMSA"');
  await client.query(tabNobreCreate);
  console.log('Tabela criada com sucesso!');
};

//await main();
//readExcelAndInsertData(path);