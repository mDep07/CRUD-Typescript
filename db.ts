import { join } from 'path';
import { Low, JSONFile } from 'lowdb';

const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)
