import fs from 'node:fs';
import xlsx from 'xlsx';
import pkg from 'pg';

const { Pool } = pkg;

const dbConfig = {
  user: 'postgres',
  host: '100.102.213.28',
  database: 'esus',
  password: 'admin',
  port: 5432,
};

async function main(){
  try{
    const client = new Pool(dbConfig);
    await client.connect();
    console.log(`connectado com sucesso!`)
  }catch(err){
    console.log(`erro ao conectar!`)
    console.log(err)
  }
}

main();