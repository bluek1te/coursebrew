import json
from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort
from sqlitedb.db import get_db
from flask_cors import CORS, cross_origin

from . import classes
from . import admin 

def create_sections(db, data_j, token):
   section_number = "001"
   for i in range(int(data_j["freq_fal"])):
      db.execute(
      'INSERT INTO sections (course_id, section_number, sem, course_name, is_lab, year, owner, token)'
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      (data_j["course_id"], section_number, "Fal", data_j["name"], "False", data_j["year"], data_j["owner"], token)
      )
      db.commit()
      section_number = ('{:03d}'.format(int(section_number)+1))
      
   section_number = "251"
   for i in range(int(data_j["freq_spr"])):
      db.execute(
      'INSERT INTO sections (course_id, section_number, sem, course_name, is_lab, year, owner, token)'
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      (data_j["course_id"], section_number, "Spr", data_j["name"], "False", data_j["year"], data_j["owner"], token)
      )
      db.commit()
      section_number = ('{:03d}'.format(int(section_number)+1))
      
   section_number = "501"
   for i in range(int(data_j["freq_sum1"])):
      db.execute(
      'INSERT INTO sections (course_id, section_number, sem, course_name, is_lab, year, owner, token)'
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      (data_j["course_id"], section_number, "Sum1", data_j["name"], "False", data_j["year"], data_j["owner"], token)
      )
      db.commit()
      section_number = ('{:03d}'.format(int(section_number)+1))
      
   section_number = "751"
   for i in range(int(data_j["freq_sum2"])):
      db.execute(
      'INSERT INTO sections (course_id, section_number, sem, course_name, is_lab, year, owner, token)'
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      (data_j["course_id"], section_number, "Sum2", data_j["name"], "False", data_j["year"], data_j["owner"], token)
      )
      db.commit()
      section_number = ('{:03d}'.format(int(section_number)+1))
      
   section_number = "L01"
   for i in range(int(data_j["freq_fal_l"])):
      db.execute(
      'INSERT INTO sections (course_id, section_number, sem, course_name, is_lab, year, owner, token)'
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      (data_j["course_id"], section_number, "Fal", data_j["name"], "True", data_j["year"], data_j["owner"], token)
      )
      db.commit()
      section_number = "L" + ('{:02d}'.format(int(section_number[-2:])+1))
     
   section_number = "L01"
   for i in range(int(data_j["freq_spr_l"])):
      db.execute(
      'INSERT INTO sections (course_id, section_number, sem, course_name, is_lab, year, owner, token)'
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      (data_j["course_id"], section_number, "Spr", data_j["name"], "True", data_j["year"], data_j["owner"], token)
      )
      db.commit()
      section_number = "L" + ('{:02d}'.format(int(section_number[-2:])+1))
      
   section_number = "L01"
   for i in range(int(data_j["freq_sum1_l"])):
      db.execute(
      'INSERT INTO sections (course_id, section_number, sem, course_name, is_lab, year, owner, token)'
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      (data_j["course_id"], section_number, "Sum1", data_j["name"], "True", data_j["year"], data_j["owner"], token)
      )
      db.commit()
      section_number = "L" + ('{:02d}'.format(int(section_number[-2:])+1))
   
   section_number = "L51"
   for i in range(int(data_j["freq_sum2_l"])):
      db.execute(
      'INSERT INTO sections (course_id, section_number, sem, course_name, is_lab, year, owner, token)'
      ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      (data_j["course_id"], section_number, "Sum2", data_j["name"], "True", data_j["year"], data_j["owner"], token)
      )
      db.commit()
      section_number = "L" + ('{:02d}'.format(int(section_number[-2:])+1))
   


def get_sections_spr():
   data_j = json.loads(request.data)
   course_id = data_j["course_id"]
   year = data_j['year']
   db = get_db()
   db_sections = db.execute(
      'SELECT id, course_id, section_number, instructor_id, instructor_name, sem, year, course_name, token'
      ' FROM sections'
      ' WHERE course_id = ' + '"' + course_id + '"'
      ' AND sem = "Spr" AND year = "' + year + '"'
   )
   desc = db_sections.description
   column_names = [col[0] for col in desc]
   data = [dict(zip(column_names, row))
      for row in db_sections.fetchall()]
   return json.dumps(data)

def get_sections_sum1():
   data_j = json.loads(request.data)
   course_id = data_j["course_id"]
   year = data_j['year']
   db = get_db()
   db_sections = db.execute(
      'SELECT id, course_id, section_number, instructor_id, instructor_name, sem, year, course_name, token'
      ' FROM sections'
      ' WHERE course_id = ' + '"' + course_id + '"'
      ' AND sem = "Sum1" AND year = "' + year + '"'
   )
   desc = db_sections.description
   column_names = [col[0] for col in desc]
   data = [dict(zip(column_names, row))
      for row in db_sections.fetchall()]
   return json.dumps(data)

def get_sections_sum2():
   data_j = json.loads(request.data)
   course_id = data_j["course_id"]
   year = data_j['year']
   db = get_db()
   db_sections = db.execute(
      'SELECT id, course_id, section_number, instructor_id, instructor_name, sem, year, course_name, token'
      ' FROM sections'
      ' WHERE course_id = ' + '"' + course_id + '"'
      ' AND sem = "Sum2" AND year = "' + year + '"'
   )
   desc = db_sections.description
   column_names = [col[0] for col in desc]
   data = [dict(zip(column_names, row))
      for row in db_sections.fetchall()]
   return json.dumps(data)
   
def get_sections_fal():
   data_j = json.loads(request.data)
   course_id = data_j["course_id"]
   year = data_j['year']
   db = get_db()
   db_sections = db.execute(
      'SELECT id, course_id, section_number, instructor_id, instructor_name, sem, year, course_name, token'
      ' FROM sections'
      ' WHERE course_id = ' + '"' + course_id + '"'
      ' AND sem = "Fal" AND year = "' + year + '"'
   )
   desc = db_sections.description
   column_names = [col[0] for col in desc]
   data = [dict(zip(column_names, row))
      for row in db_sections.fetchall()]
   return json.dumps(data)

def get_all_sections():
   data_j = json.loads(request.data)
   year = data_j['year']
   token = data_j['token']
   db = get_db()
   if(admin.check_admin(token) == False):
      db_sections = db.execute(
         'SELECT id, course_id, section_number, instructor_id, instructor_name, sem, year, course_name, is_lab, token'
         ' FROM sections WHERE year = "' + year + '"' + ' AND token=' +'"'+ token + '"'
      )
   else:
      db_sections = db.execute(
         'SELECT id, course_id, section_number, instructor_id, instructor_name, sem, year, course_name, is_lab, token'
         ' FROM sections WHERE year = "' + year + '"')
   desc = db_sections.description
   column_names = [col[0] for col in desc]
   data = [dict(zip(column_names, row))
      for row in db_sections.fetchall()]
   return json.dumps(data)

def assign_course():
   try:
      data_j = json.loads(request.data)
      sem = data_j["sem"]
      course_id = data_j["course_id"]
      instructor_id = data_j["instructor_id"]
      section_number = data_j["section_number"]
      instructor_name = data_j["instructor_name"]
      year = data_j["year"]
      course_name = data_j["course_name"]
      id = data_j["id"]
      token = data_j["token"]
      db = get_db()
      if instructor_name is None or instructor_name == "choose instructor" or instructor_id == "unassign":
         instructor_name = "Unassigned"
         instructor_id = "Unassigned"
      db.execute(
        'UPDATE sections SET instructor_id = ' + '"' + instructor_id + '"' + ', instructor_name = ' + '"' + instructor_name + '"' + ', section_number = ' + '"' + section_number + '"' + ' WHERE (id = ' + str(id)
         + ' AND year = "' + year + '")')
      if instructor_name != "Unassigned":
        admin.create_log(request, "assigned " + instructor_name + " to " + course_name + ": " + section_number) 
      db.commit()
      return jsonify({"message": "instructors assigned!"}), 200
   except:   
        admin.create_log(request, "Error caught in assign_course() located in sections.py")
        return jsonify({"message": "failure"}), 200

def turn_sections_to_objects(year, token):
   section_objects = {}
   db = get_db()
   db_sections = db.execute(
        'SELECT id, course_id, section_number, instructor_id, sem, year, course_name'
        ' FROM sections WHERE year = "' + year + '" AND token = "' + token + '"'
   )
   desc = db_sections.description
   column_names = [col[0] for col in desc]
   sections = [dict(zip(column_names, row))
      for row in db_sections.fetchall()]
   print(len(sections))
   for s in sections:
      section_objects[s["id"]] = classes.Section(s['id'], s['section_number'], s["course_id"], s["instructor_id"], s["sem"], s["year"], s["course_name"])
   return section_objects.values()



