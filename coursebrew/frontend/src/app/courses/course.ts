export interface Course {
  name?: string,
  course_id?: string,
  semesters?: string[],
  level?: string,
  owner?: string,
  freq_spr?: string,
  freq_sum1?: string,
  freq_sum2?: string,
  freq_fal?: string,
  freq_spr_l?: string,
  freq_sum1_l?: string,
  freq_sum2_l?: string,
  freq_fal_l?: string, 
  year?: string,
  status?: string,
  token?: string,
  current_assign?: number,
  max_assign?: number
}
