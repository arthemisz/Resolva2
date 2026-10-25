import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDirectory = fileURLToPath(new URL('../../', import.meta.url));

dotenv.config({ path: path.join(serverDirectory, '.env') });
