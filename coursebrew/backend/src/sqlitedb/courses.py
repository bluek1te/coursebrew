import json
import pandas as pd
from . import instructors
from . import courses
from . import classes
import sys
from . import admin
from . import sections

from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort
from sqlitedb.db import get_db
from flask_cors import CORS, cross_origin

def add_course():
   try:
      data_j = json.loads(request.data)
      course_id = data_j['course_id']
      name = data_j['name']
      owner = data_j['owner']
      year = data_j['year']
      freq_spr = data_j['freq_spr']
      freq_sum1 = data_j['freq_sum1']
      freq_sum2 = data_j['freq_sum2']
      freq_fal = data_j['freq_fal']
      freq_spr_l = data_j['freq_spr_l']
      freq_sum1_l = data_j['freq_sum1_l']
      freq_sum2_l = data_j['freq_sum2_l']
      freq_fal_l = data_j['freq_fal_l']
      token = data_j['token']
      db = get_db()
      db_courses = db.execute(
         'SELECT course_id'
         ' FROM courses'
      )
      desc = db_courses.description
      column_names = [col[0] for col in desc]
      data= [dict(zip(column_names, row))
         for row in db_courses.fetchall()]
      for i in data:
         if(course_id == i['course_id']):
            db.close()
            return jsonify({'message': 'duplicate course, course not added'}), 200    
      db.execute(
         'INSERT INTO courses (course_id, name, owner, year, freq_spr, freq_sum1, freq_sum2, freq_fal, freq_spr_l, freq_sum1_l, freq_sum2_l, freq_fal_l, owner, token)'
         ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
         (course_id, name, owner, year, freq_spr, freq_sum1, freq_sum2, freq_fal, freq_spr_l, freq_sum1_l, freq_sum2_l, freq_fal_l, owner, token)
         )
      db.commit()
      sections.create_sections(db, data_j, token)
      db.close()
      admin.create_log(request, course_id + " added to courses")
      return jsonify({'message': 'course added'}), 200
   except:
      admin.create_log(request, "Error caught in add_course() located in courses.py")
      return jsonify({'message': 'error encountered, please contact server administrator'})

def delete_course():
   try:
      data_j = json.loads(request.data)
      token = data_j['token']
      course_id = data_j['course_id']
      db = get_db()
      db.execute('DELETE FROM courses WHERE (course_id = ' + '"' + course_id + '"' 
		+ ' AND token = ' + '"' + token + '")')
      db.execute('DELETE FROM sections WHERE (course_id = ' + '"' + course_id + '"'
		+ ' AND token = ' + '"' + token + '")')
      db.commit()
      db.close()
      admin.create_log(request, course_id + " deleted from courses")
      return jsonify({'message': 'course deleted'}), 200
   except:
      admin.create_log(request, "Error caught in delete_course() located in courses.py")
      return jsonify({'message': 'error encountered, please contact server administrator'})

def get_course():
   try:
      data_j = json.loads(request.data)
      course_id = data_j['course_id']
      year = data_j['year']
      token = data_j['token']
      db = get_db()
      if (admin.check_admin(token) == False):
         db_course = db.execute(
           'SELECT name, course_id, owner, year, freq_spr, freq_sum1, freq_sum2, freq_fal, freq_spr_l, freq_sum1_l, freq_sum2_l, freq_fal_l, owner, token'
           ' FROM courses'
	   ' WHERE (year = ' + '"' + year + '"' + 
	      ' AND course_id = ' + '"' + course_id + '"'
              ' AND token = ' + '"' + token + 
              '")')
      else:
         db_course = db.execute(
           'SELECT name, course_id, owner, year, freq_spr, freq_sum1, freq_sum2, freq_fal, freq_spr_l, freq_sum1_l, freq_sum2_l, freq_fal_l, owner, token'
           ' FROM courses'
	   ' WHERE (year = ' + '"' + year + '"' + 
	      ' AND course_id = ' + '"' + course_id + '")')
      desc = db_course.description
      column_names = [col[0] for col in desc]
      data = [dict(zip(column_names, row))
            for row in db_course.fetchall()]
      if(len(data) == 0):
           return jsonify({"message": "bad"})
      return json.dumps(data[0])
   except:
      admin.create_log(request, "Error caught in get_course() located in courses.py")
      return jsonify({'message': 'error encountered, please contact server administrator'})

def get_courses(prev=False):
   try:
      data_j = json.loads(request.data)
      year = data_j['year']
      token = data_j['token']
      if(prev==True):
         year = str(int(data_j["year"])-1)
      db = get_db()
      if (admin.check_admin(token) == False):
         db_courses = db.execute(
            'SELECT name, course_id, owner, year, freq_spr, freq_sum1, freq_sum2, freq_fal, freq_spr_l, freq_sum1_l, freq_sum2_l, freq_fal_l'
            ' FROM courses WHERE year =' + '"' + year + '"' + 'AND token=' + '"' + token + '"'
         )
      else:
         db_courses = db.execute(
            'SELECT name, course_id, owner, year, freq_spr, freq_sum1, freq_sum2, freq_fal, freq_spr_l, freq_sum1_l, freq_sum2_l, freq_fal_l'
            ' FROM courses WHERE year =' + '"' + year + '"')
      desc = db_courses.description
      column_names = [col[0] for col in desc]
      data = [dict(zip(column_names, row))
         for row in db_courses.fetchall()]
      return json.dumps(data)
   except:
      create_log(request, "Error caught in get_courses() located in courses.py")
      return jsonify({'message': 'error encountered, please contact server administrator'})

def get_course_names():
   data_j = json.loads(request.data)
   year = data_j['year']
   db = get_db()
   db_courses = db.execute(
      'SELECT name'
      ' FROM courses WHERE year = "' + str(year) + '"'
   )
   desc = db_courses.description
   column_names = [col[0] for col in desc]
   data = [dict(zip(column_names, row))
      for row in db_courses.fetchall()]
   return json.dumps(data)

def edit_course():
   data_j = json.loads(request.data)
   if request.method == 'POST':
      course_id = data_j['course_id']
      name = data_j['name']
      owner = data_j['owner']
      year = data_j['year']
      freq_spr = data_j['freq_spr']
      freq_sum1 = data_j['freq_sum1']
      freq_sum2 = data_j['freq_sum2']
      freq_fal = data_j['freq_fal']
      freq_spr_l = data_j['freq_spr_l']
      freq_sum1_l = data_j['freq_sum1_l']
      freq_sum2_l = data_j['freq_sum2_l']
      freq_fal_l = data_j['freq_fal_l']
      token = data_j['token']
      db = get_db()
      db_courses = db.execute(
         'SELECT course_id'
         ' FROM courses'
      )
      desc = db_courses.description
      column_names = [col[0] for col in desc]
      data= [dict(zip(column_names, row))
         for row in db_courses.fetchall()]
      db.execute(
         'DELETE FROM courses WHERE course_id=' + '"' + course_id + '"' +' AND year = "' + str(year) + '"' + ' AND token = "' + token + '"'
         )
      db.execute(
         'DELETE FROM sections WHERE course_id=' + '"' + course_id + '"' +' AND year = "' + str(year) + '"' + ' AND token = "' + token + '"'
         )
      db.execute(
         'INSERT INTO courses (course_id, name, owner, year, freq_spr, freq_sum1, freq_sum2, freq_fal, freq_spr_l, freq_sum1_l, freq_sum2_l, freq_fal_l, token)'
         ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
         (course_id, name, owner, year, freq_spr, freq_sum1, freq_sum2, freq_fal, freq_spr_l, freq_sum1_l, freq_sum2_l, freq_fal_l, token)
         )
      db.commit()
      sections.create_sections(db, data_j, token)
      db.close()
      return jsonify({'message': 'good'}), 200
   return jsonify({'message': 'bad'}), 200
   
def turn_courses_to_objects(year):
   course_objects = {}
   db = get_db()
   db_courses = db.execute(
        'SELECT name, course_id, owner, year, freq_spr, freq_sum1, freq_sum2, freq_fal, freq_spr_l, freq_sum1_l, freq_sum2_l, freq_fal_l'
        ' FROM courses WHERE year =' + '"' + year + '"'
    )
   desc = db_courses.description
   column_names = [col[0] for col in desc]
   courses = [dict(zip(column_names, row))
      for row in db_courses.fetchall()]
   for c in courses:
      course_objects[c["course_id"]] = Course(c['course_id'], c["name"], c["owner"], c["year"], c["freq_spr"], c["freq_sum1"], c["freq_sum2"], c["freq_fal"], c["freq_spr_l"], c["freq_sum1_l"], c["freq_sum2_l"], c["freq_fal_l"])
   return course_objects.values()
