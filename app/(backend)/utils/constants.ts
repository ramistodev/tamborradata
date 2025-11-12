import 'server-only';
import { supabasePublic } from '../db/supabasePublic';
import { log } from '../logic/helpers/log';

export const VALID_CATEGORIES = [
  'commonNameBySchool',
  'commonNameBySchoolByYear',
  'intro',
  'longestNames',
  'mostConstantSchools',
  'namesDiversity',
  'namesDiversityByYear',
  'newNamesByYear',
  'newSchoolsByYear',
  'outro',
  'schoolsEvolution',
  'surnamesDiversity',
  'surnamesDiversityByYear',
  'topNames',
  'topNamesByYear',
  'topSchools',
  'topSchoolsByYear',
  'topSurnames',
  'topSurnamesByYear',
  'totalParticipants',
  'totalParticipantsByYear',
];

export const VALID_YEARS = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabasePublic
      .from('available_years')
      .select('year')
      .order('year', { ascending: false });

    if (error) {
      log(`'Error fetching valid years:' ${error?.message}`, 'error');
      return [];
    }

    return data ? data.map((item) => item.year.toString()) : [];
  } catch (error) {
    log(`'Unexpected error fetching valid years:' ${JSON.stringify(error)}`, 'error');
    return [];
  }
};
