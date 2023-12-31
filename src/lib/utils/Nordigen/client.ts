import { NORDIGEN_SECRET_ID, NORDIGEN_SECRET_KEY } from '$env/static/private';
import { NDG_Client } from './utils/nordigen-client';

export const nordigen = new NDG_Client(NORDIGEN_SECRET_ID, NORDIGEN_SECRET_KEY);
