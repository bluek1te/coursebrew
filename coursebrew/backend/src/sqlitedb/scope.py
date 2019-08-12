import json
import pandas as pd
from . import classes
from . import warnings
from . import instructors
from . import courses

from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort
from sqlitedb.db import get_db
from flask_cors import CORS, cross_origin

def get_years():
   db = get_db()
   data_j = json.loads(request.data)
   token = data_j["token"]
   print(token)
   db_year = db.execute(
      'SELECT years'
      ' FROM users'
      ' WHERE token = ' + '"' + token + '"' 
   )
   desc = db_year.description
   column_names = [col[0] for col in desc]
   data = [dict(zip(column_names, row))  
           for row in db_year.fetchall()]
   if(len(data) == 0):
      return jsonify({ "message" : "no years"})
   return json.dumps(data[0])

def delete_year():
   #try:
      data_j = json.loads(request.data)
      token = data_j["token"]
      year = data_j["year"]
      db = get_db()
      db.execute('DELETE FROM instructors WHERE (year = ' + '"' + year + '"'
                + ' AND token = ' + '"' + token + '")')
      db.execute('DELETE FROM courses WHERE (year = ' + '"' + year + '"'
                + ' AND token = ' + '"' + token + '")')
      db.execute('DELETE FROM sections WHERE (year = ' + '"' + year + '"'
                + ' AND token = ' + '"' + token + '")')
      db_years = db.execute('SELECT years FROM users WHERE token =' + '"' + token + '"')
      desc = db_years.description
      column_names = [col[0] for col in desc]
      data = [dict(zip(column_names, row))  
           for row in db_years.fetchall()]
      buffer = data[0]["years"].split()
      buffer.remove(year)
      db.execute('UPDATE users' 
              ' SET years =' + '"' + (" ".join(buffer)) + '"' + 
	      ' WHERE token =' + '"' + token + '"')
      db.commit()
      db.close()
      return jsonify({'message': 'Year Deleted'}), 200
   #except:
      return jsonify({'message': 'Error'}), 500

def add_year_copy():
   data_j = json.loads(request.data)
   db = get_db()
   token = data_j["token"]
   username = data_j["username"]
   year = str(int(data_j["year"])-1)
   for instructor in json.loads(get_instructors(prev=True)):
      if instructor['available_courses'] == None:
         instructor['available_courses'] = "Test"
      if instructor['preferred_courses'] == None:
         instructor['preferred_courses'] = "Test"
      if instructor['summer'] == None:
         instructor['summer'] = "Test"
      available_courses_buffer = instructor['available_courses']
      preferred_courses_buffer = instructor['preferred_courses']
      added_instructor = Instructor(instructor['net_id'], 
                                    instructor['name'], instructor['year'], 
                                    instructor['rank'], instructor['preps'], 
                                    instructor['wl_credits'], instructor['wl_courses'], 
                                    instructor['summer'], instructor['preferred_courses'].split(), 
                                    instructor['available_courses'].split())
     
      db.execute(
         'INSERT INTO instructors (name, net_id, rank, preps, year, wl_credits, wl_courses, summer, available_courses, preferred_courses, owner, token)'
         ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
         (added_instructor.name, 
          added_instructor.net_id, 
          added_instructor.rank, 
          added_instructor.preps, 
          str(int(added_instructor.year)+1), 
          added_instructor.wl_credits, 
          added_instructor.wl_courses, 
          added_instructor.summer, 
          available_courses_buffer, 
          preferred_courses_buffer,
	  username,
	  token)
         )
   db.commit()
   for course in json.loads(get_courses(prev=True)):
      course['year'] = str(int(course['year'])+1)
      added_course = Course(course['course_id'], course['name'],
                            course['owner'], course['year'],
                            course['freq_spr'], course['freq_sum1'],
                            course['freq_sum2'], course['freq_fal'],
                            course['freq_spr_l'], course['freq_sum1_l'],
                            course['freq_sum2_l'], course['freq_fal_l']
                           )
      db.execute(
         'INSERT INTO courses (course_id, name, owner, year, freq_spr, freq_sum1, freq_sum2, freq_fal, freq_spr_l, freq_sum1_l, freq_sum2_l, freq_fal_l, owner, token)'
         ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
         (added_course.course_id, 
          added_course.name, 
          added_course.owner, 
          added_course.year, 
          added_course.freq_spr, 
          added_course.freq_sum1, 
          added_course.freq_sum2, 
          added_course.freq_fal, 
          added_course.freq_spr_l, 
          added_course.freq_sum1_l, 
          added_course.freq_sum2_l, 
          added_course.freq_fal_l,
	  username,
	  token)
         )
      create_sections(db, course, token)
   buffer = " " + str(int(year) + 1)
   db_users = db.execute('SELECT years FROM users WHERE token =' + '"' + token + '"')
   desc = db_users.description
   column_names = [col[0] for col in desc]
   data = [dict(zip(column_names, row))  
           for row in db_users.fetchall()]
   buffer = data[0]["years"] + buffer
   db.execute('UPDATE users' 
              ' SET years =' + '"' + buffer + '"' + 
	      ' WHERE token =' + '"' + token + '"')
   db.commit()
   db.close()
   return jsonify({'message': 'good'}), 200



