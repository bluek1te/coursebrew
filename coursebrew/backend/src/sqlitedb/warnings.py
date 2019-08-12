import json
from . import classes
from . import instructors
from . import courses
from . import sections
from collections import namedtuple, Counter

from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort
from sqlitedb.db import get_db
from flask_cors import CORS, cross_origin

def create_warnings():
    client_warnings = classes.Warnings()
    client_warnings.clear()
    db = get_db()
    data_j = json.loads(request.data)
    print('hi')
    for instructor in json.loads(instructors.get_instructors()):
       instructor_object = namedtuple("Instructor", instructor.keys())(*instructor.values())
       course_mismatch_warnings(client_warnings, instructor, instructor_object, data_j)
       sections_limit_warnings(client_warnings, instructor, instructor_object, data_j)
       preps_limit_warnings(client_warnings, instructor, instructor_object, data_j)
    for course in json.loads(courses.get_courses()):
       course_object = namedtuple("Course", course.keys())(*course.values())
       section_assignment_warnings(client_warnings, course, course_object, data_j)
    return client_warnings

def section_assignment_warnings(client_warnings, course, course_object, data_j):
    db = get_db()
    readable_list = {"spr" : "spring", "sum1" : "summer I", "sum2" : "summer II", "fal" : "fall",
                     "spr_l": "spring labs", "sum1_l": "summer I labs", "sum2_l": "summer II labs", "fal_l": "fall labs"}
    count_list = {"spr":0, "sum1":0, "sum2":0, "fal":0, "spr_l":0, "sum1_l":0, "sum2_l":0, "fal_l":0}
    for section in get_course_sections(course['course_id'], data_j['year'], data_j['token']):
       if (section["instructor_id"] != "Unassigned"):
          if section["is_lab"] == "True":
             string_add="_l"
          else:
             string_add=""
          if section["sem"] == "Spr":
             count_list["spr" + string_add] += 1
          if section["sem"] == "Sum1":
             count_list["sum1" + string_add] += 1
          if section["sem"] == "Sum2":
             count_list["sum2" + string_add] += 1
          if section["sem"] == "Fal":
             count_list["fal" + string_add] += 1
    if(course['name']=="Ceramics"):
       print(count_list)
    for key in count_list:
       if(course['name']=="Ceramics"):
          print("Ceramics")
          print(key)
          print(count_list[key])
          print("compared to")
          print(course["freq_"+key])
       if (count_list[key] < int(course["freq_"+key])):
          client_warnings.generate(course_object, 
                                   course["course_id"] 
                                   + " " + str(count_list[key]) 
                                   + " /" + " " + course["freq_"+key]
                                   + " (" + readable_list[key] + ")"
                                   + " assigned.", 2)

def preps_limit_warnings(client_warnings, instructor, instructor_object, data_j):
    db = get_db()
    course_list_spr = []
    course_list_fal = []
    for section in get_instructor_sections(instructor['net_id'], data_j['year'], data_j['token']):
       if section["sem"] == "Spr":
          course_list_spr.append(section['course_name'])
       if section["sem"] == "Fal":
          course_list_fal.append(section['course_name'])
    course_list_spr = list(set(course_list_spr))
    course_list_fal = list(set(course_list_fal))
    if(len(course_list_spr) > int(instructor['preps'])):
       client_warnings.generate(instructor_object, instructor["name"] + " - assigned too many unique classes (spring)",1)
    if(len(course_list_fal) > int(instructor['preps'])):
       client_warnings.generate(instructor_object, instructor["name"] + " - assigned too many unique classes (fall)",1)
    
def course_mismatch_warnings(client_warnings, instructor, instructor_object, data_j):
    db = get_db()
    if instructor['available_courses'] is None:
       instructor['available_courses'] = "Nothing"
    for section in get_instructor_sections(instructor['net_id'], data_j['year'], data_j['token']):
       if section['course_id'] not in instructor['available_courses'].split():
           if section['sem'] == "Fal":
              client_warnings.generate(instructor_object, instructor['name'] + " - assigned unavailable course (fall): " + section['course_name'], 3)
           elif section['sem'] == "Spr":
              client_warnings.generate(instructor_object, instructor['name'] + " - assigned unavailable course (spring): " + section['course_name'], 3)

def sections_limit_warnings(client_warnings, instructor, instructor_object, data_j):
    db = get_db()
    wl_dict = {"lec": 3.0, "lab": 1.5}
    wl_inc = 0
    count_list = {"Spr":0, "Sum1":0, "Sum2":0, "Fal":0}
    for section in get_instructor_sections(instructor['net_id'], data_j['year'], data_j['token']):
       if section["is_lab"] == "True":
          wl_inc = 1.5
       else:
          wl_inc = 3.0
       if section["sem"] == "Spr":
          count_list["Spr"] += wl_inc
       if section["sem"] == "Sum1":
          count_list["Sum1"] += wl_inc
       if section["sem"] == "Sum2":
          count_list["Sum2"] += wl_inc
       if section["sem"] == "Fal":
          count_list["Fal"] += wl_inc
    if(float(instructor['wl_credits']) > count_list["Spr"]):
       client_warnings.generate(instructor_object, instructor["name"] + " - underloaded (spring)", 1)
    elif(float(instructor['wl_credits']) < count_list["Spr"]):
       client_warnings.generate(instructor_object, instructor["name"] + " - overloaded (spring)", 2)
    if(float(instructor['wl_credits']) > count_list["Fal"]):
       client_warnings.generate(instructor_object, instructor["name"] + " - underloaded (fall)", 1)
    elif(float(instructor['wl_credits']) < count_list["Fal"]):
       client_warnings.generate(instructor_object, instructor["name"] + " - overloaded (fall)", 2)

def get_instructor_sections(net_id, year, token):
    db = get_db()
    db_sections = db.execute(
      'SELECT id, course_id, section_number, instructor_id, instructor_name, sem, year, course_name, is_lab'
      ' FROM sections'
      ' WHERE instructor_id = ' + '"' + net_id + '"'
      ' AND year = "' + year + '"'
      ' AND token = "' + token + '"'
    )
    desc = db_sections.description
    column_names = [col[0] for col in desc]
    data = [dict(zip(column_names, row))
       for row in db_sections.fetchall()]
    return data

def get_course_sections(course_id, year, token):
    db = get_db()
    db_sections = db.execute(
      'SELECT id, course_id, section_number, instructor_id, instructor_name, sem, year, course_name, is_lab'
      ' FROM sections'
      ' WHERE course_id = ' + '"' + course_id + '"'
      ' AND year = "' + year + '"'
    )
    desc = db_sections.description
    column_names = [col[0] for col in desc]
    data = [dict(zip(column_names, row))
       for row in db_sections.fetchall()]
    return data

def get_warnings():
    return json.dumps(create_warnings().warningLog)
