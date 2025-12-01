import 'server-only';
import { fetchCompanies } from '../repositories/companies.repo';
import { FetchCompaniesType } from '../types';

export async function getCompanies(): Promise<FetchCompaniesType> {
  return await fetchCompanies();
}
