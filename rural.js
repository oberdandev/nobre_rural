import fs from 'node:fs';
import xlsx from 'xlsx';
import pkg from 'pg';
import { countRowsInExcel } from './lastLine.js';

const { Client } = pkg;

const tableColumn = `nome_prof, cpf_prof, cargo`

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
  host: '10.50.1.200',
  database: 'disarural',
  password: 'portalrural@Xyz.321',
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
      text: `INSERT INTO disa-rural."rural" (${tableColumn}) VALUES ($1, $2, $3)`,
      values: data,
    }
    
    await client.query(query);
    console.log(`dados inseridos com sucesso! na linha ${rowIndex}`)

  }catch(err){
    console.log(`Error ao tentar inserir dados no banco de dados: ${err}`);
  }
}

const readExcelAndInsertData = async (filePath) => {
  try {
    
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
      ];
  
      await insertIntoDatabase(data, client, i);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const path = './PROFISSIONAIS.xlsx';

const main = async () => {
  const client = new Client(dbConfig);
  await client.connect();
  await client.query('DROP TABLE IF EXISTS "TAB_NOBRE_SEMSA"');
  await client.query(tabNobreCreate);
  console.log('Tabela criada com sucesso!');
};

//await main();
//readExcelAndInsertData(path);


async function teste() {
  try {
    const client = new Client(dbConfig);
    await client.connect().then(console.log('conectado com sucesso!'))
    await client.query(tabNobreCreate);
    
  } catch (error) {
    console.log(error.message)  
  }
}

teste();