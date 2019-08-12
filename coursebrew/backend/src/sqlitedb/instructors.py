import json
import pandas as pd
from . import classes
from . import sections
from . import admin
from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort
from sqlitedb.db import get_db
from flask_cors import CORS, cross_origin

def delete_instructor():
   data_j = json.loads(request.data)
   net_id = data_j['net_id']
   token = data_j['token']
   year = data_j['year']
   db = get_db()
   db.execute('UPDATE sections'
              ' SET instructor_id = "Unassigned", instructor_name = "Unassigned"'
              ' WHERE (year = ' + '"' + year + '"' + 
	      ' AND instructor_id = ' + '"' + net_id + '"' +
              ' AND token = ' + '"' + token + 
              '")')
   db.execute('DELETE FROM instructors WHERE (net_id = ' + '"' + net_id + '"' + 
              ' AND year = ' + '"' + year +  '"' +
	      ' AND token = ' + '"' + token + 
              '")')
   db.commit()
   db.close()
   return jsonify({'message': 'instructor deleted!'}), 200

def get_instructors(prev=False):
   data_j = json.loads(request.data)
   year = data_j['year']
   token = data_j['token']
   if(prev==True):
      year = str(int(data_j["year"])-1)
   instructors = {}
   db = get_db()

   if (admin.check_admin(token) == False): 
      print("Check Admin is False")
      db_instructors = db.execute(
         'SELECT name, net_id, preps, rank, wl_credits, wl_courses, summer, year, preferred_courses, available_courses, owner, token'
         ' FROM instructors WHERE (year = ' + '"' + year + '"' + 
         ' AND token = ' + '"' + token + '")')
   else:
      print("Check Admin is True")
      db_instructors = db.execute(
         'SELECT name, net_id, preps, rank, wl_credits, wl_courses, summer, year, preferred_courses, available_courses, owner, token'
         ' FROM instructors WHERE year = ' + '"' + year + '"')

   desc = db_instructors.description
   column_names = [col[0] for col in desc]
   data = [dict(zip(column_names, row))  
           for row in db_instructors.fetchall()]
   return json.dumps(data)

def get_instructor():
    data_j = json.loads(request.data)
    net_id = data_j['net_id']
    year = data_j['year']
    token = data_j['token']
    db = get_db()
    if (admin.check_admin(token) == False):
       db_instructor = db.execute(
           'SELECT name, net_id, preps, rank, wl_credits, wl_courses, summer, preferred_courses, available_courses, year, owner, token'
           ' FROM instructors WHERE (net_id = ' + '"' + net_id + '"' + 
           ' AND year = ' + '"' + year + '"' + 
           ' AND token = ' + '"' + token + '")')
    else:
       db_instructor = db.execute(
           'SELECT name, net_id, preps, rank, wl_credits, wl_courses, summer, preferred_courses, available_courses, year, owner, token'
           ' FROM instructors WHERE (net_id = ' + '"' + net_id + '"' + 
           ' AND year = ' + '"' + year + '")')
    desc = db_instructor.description
    column_names = [col[0] for col in desc]
    data = [dict(zip(column_names, row))
            for row in db_instructor.fetchall()]
    return json.dumps(data[0])

def add_instructor():
   data_j = json.loads(request.data)
   if request.method == 'POST':
      name = data_j['name']
      net_id = data_j['net_id']
      year = data_j['year']
      owner = data_j['owner']
      preps = data_j['preps']
      wl_credits = data_j['wl_credits']
      wl_courses = data_j['wl_courses']
      print(type(data_j['available_courses']))
      available_courses = data_j['available_courses']
      available_courses = [str(r) for r in available_courses]
      available_courses = " ".join(available_courses)
      print(available_courses)
      token = data_j['token']
      db = get_db()
      db_instructors = db.execute(
         'SELECT name, net_id FROM instructors WHERE year = "' + year + '"'
      )
      desc = db_instructors.description
      column_names = [col[0] for col in desc]
      data = [dict(zip(column_names, row))
         for row in db_instructors.fetchall()]

      for i in data:
         if(name == i['name'] or net_id == i['net_id']):
            db.close()
            return jsonify({'message': 'duplicate instructor!'}), 200    
      db.execute(
         'INSERT INTO instructors (name, net_id, preps, year, wl_credits, wl_courses, available_courses, token)'
         ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
         (name, net_id, preps, year, wl_credits, wl_courses, available_courses, token)
         )
      db.commit()
      db.close()
      return jsonify({'message': 'instructor added!'}), 200
   return jsonify({'message': "I don't know what happened! Sorry."}), 200

def edit_instructor():
   data_j = json.loads(request.data)
   if request.method == 'POST':
      name = data_j['name']
      net_id = data_j['net_id']
      year = data_j['year']
      preps = data_j['preps']
      wl_credits = data_j['wl_credits']
      wl_courses = data_j['wl_courses']
      token = data_j['token']
      available_courses = data_j['available_courses'][0]
      for course in data_j['available_courses']:
         if available_courses != course:
            available_courses = available_courses + " " + course
      print(available_courses)
      db = get_db()
      db.execute(
         'DELETE FROM instructors WHERE (net_id = ' + '"' + net_id + '"' + 
        ' AND year = ' + '"' + year + '"' + 
        ' AND token = ' + '"' + token + '")')
      db.execute(
         'INSERT INTO instructors (name, net_id, preps, year, wl_credits, wl_courses, available_courses, token)'
         ' VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
         (name, net_id, preps, year, wl_credits, wl_courses, available_courses, token)
         )
      db.commit()
      db.close()
      return jsonify({'message': 'instructor edited!'}), 200
   return jsonify({'message': "I don't know what happened! Sorry."}), 200


def turn_instructors_to_objects(year, token):
    instructor_objects = {}
    db = get_db()
    db_instructors = db.execute(
      'SELECT name, net_id, rank, year, preps, wl_credits, wl_courses, summer, preferred_courses, available_courses'
      ' FROM instructors WHERE year = "' + year + '" AND token = "' + token + '"'
      )
    desc = db_instructors.description
    column_names = [col[0] for col in desc]
    instructorsList = [dict(zip(column_names, row))  
       for row in db_instructors.fetchall()]
    for i in instructorsList:
       instructor_objects[i["net_id"]] = classes.Instructor(i["net_id"], i["name"], i["year"], i["rank"], i["preps"], i["wl_credits"], i["wl_courses"], i["summer"], i["preferred_courses"], i["available_courses"])
    return instructor_objects.values()

def filter_instructors():
  data_j = json.loads(request.data)
  course_id = data_j['course_id']
  year = data_j['year']
  token = data_j['token']
  instructors_list = turn_instructors_to_objects(year, token)
  sections_list = sections.turn_sections_to_objects(year, token)
  weights = {}
  filtered_ids = []
  for i in instructors_list:
    courses_taught = []
    numCredits = float(i.wl_credits)
    for s in sections_list:
      if(s.instructor_id == i.net_id):
        if(s.section_number[0] == 'L'):
          numCredits -= 1.5
        else:
          numCredits -= 3
        courses_taught.append(s.course_id)
    weights[i.net_id] = numCredits
    try:
      if(course_id in i.preferred_courses):
        weights[i.net_id] = weights[i.net_id] + 5
    except:
        pass
    if(course_id in courses_taught):
      weights[i.net_id] = weights[i.net_id] + 2
    if(course_id not in i.available_courses):
      weights[i.net_id] = 0

  top_weights = sorted(weights, key=weights.get, reverse=True)[:3]
  for w in top_weights:
    for i in instructors_list:
      if(w == i.net_id):
        filtered_ids.append(w)

  db = get_db()
  db_instructors = db.execute(
    'SELECT name, net_id, preps, wl_credits, wl_courses, summer, preferred_courses, available_courses'
    ' FROM instructors WHERE year = ' + '"' + year + '"' + ' AND token = ' + '"' + token + '"'
  )
  desc = db_instructors.description
  column_names = [col[0] for col in desc]
  data = [dict(zip(column_names, row))  
    for row in db_instructors.fetchall()]
  
  filtered_instructors=[]
  for ID in filtered_ids:
    for i in data:
      if i['net_id'] == ID:
        filtered_instructors.append(i)
  return json.dumps(filtered_instructors)


