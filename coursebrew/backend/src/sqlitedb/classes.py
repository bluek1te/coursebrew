class Instructor:
  def __init__(self, net_id, name, year, rank, preps, wl_credits, wl_courses, summer, preferred_courses, available_courses):
    self.net_id = net_id
    self.name = name
    self.year = year
    self.rank = rank
    self.preps = preps
    self.wl_credits = wl_credits
    self.wl_courses = wl_courses
    self.summer = summer
    self.available_courses = "test"
    self.preferred_courses = "test"
    if not(preferred_courses is None):
      self.preferred_courses = preferred_courses
    if not(available_courses is None):
      self.available_courses = available_courses

class Course:
  def __init__(self,  course_id, name, owner, year, freq_spr, freq_sum1, freq_sum2, freq_fal, freq_spr_l, freq_sum1_l, freq_sum2_l, freq_fal_l):
    self.course_id = course_id
    self.name = name
    self.owner = owner
    self.year = year
    self.freq_spr = freq_spr
    self.freq_sum1 = freq_sum1
    self.freq_sum2 = freq_sum2
    self.freq_fal = freq_fal
    self.freq_spr_l = freq_spr_l
    self.freq_sum1_l = freq_sum1_l
    self.freq_sum2_l = freq_sum2_l
    self.freq_fal_l = freq_fal_l

class Section:
  def __init__(self, id, section_number, course_id, instructor_id, sem, year, course_name):
    self.id = id
    self.section_number = section_number
    self.course_id = course_id
    self.instructor_id = instructor_id
    self.instructor_name = ""
    self.sem = sem
    self.year = year
    self.course_name = course_name
    if(not section_number == None):
      if(section_number[0] == 'L'):
        self.is_lab = True
      else:
        self.is_lab = False
    
class Warnings:
   def __init__(self):
      self.warningLog = []
      self.instr_status = {}
      self.course_status = {}
   
   def clear(self):
      self.warningLog = []
      self.instr_status = {}
      self.course_status = {}
	  
   def generate(self, source, message, code):
      if(source.__class__.__name__ == "Instructor"):
        if source.net_id in self.instr_status:
          self.instr_status[source.net_id] = max(code,self.instr_status[source.net_id])
          self.warningLog.append({"title": source.net_id, "message" : message, "status" : code})
        else:
          self.instr_status[source.net_id] = code
          self.warningLog.append({"title": source.net_id, "message" : message, "status" : code})
        
      elif(source.__class__.__name__ == "Course"):
        if source.course_id in self.course_status:
          self.course_status[source.course_id] = min(code,self.course_status[source.course_id])
          self.warningLog.append({"title": source.course_id, "message" : message, "status" : code})
        else:
          self.course_status[source.course_id] = code
          self.warningLog.append({"title": source.course_id, "message" : message, "status" : code})
