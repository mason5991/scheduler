import dotenv from 'dotenv';
import path from 'path';
import { printDebug } from './utils/log';
import load from './load';

// Import environment settings
dotenv.config({ path: path.join(__dirname, '../.env') });

printDebug(`=====CURRENT NODE ENVIRONMENT===== ${process.env.NODE_ENV}`);

// Single thread
load();
