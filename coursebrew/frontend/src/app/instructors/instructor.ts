export class Instructor {
     constructor(
     public name?: string,
     public net_id?: string,
     public preps?: string,
     public current_wl_credits_spr?: number,
     public current_wl_credits_fal?: number,
     public wl_credits?: string,
     public wl_courses?: string,
     public available_courses?: string[],
     public preferred_courses?: string[],
     public year?: string,
     public created_at?: Date,
     public updated_at?: Date,
     public last_updated_by?: string,
     public owner?: string,
     public token?: string,
  ) {}
}
