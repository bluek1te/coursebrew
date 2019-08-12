import json
import pandas as pd
from . import classes
from . import instructors
from . import courses
from . import warnings
from . import test
from . import sections

from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort
from sqlitedb.db import get_db
from flask_cors import CORS, cross_origin

bp = Blueprint('handlebars', __name__)

def pull_from_csv():
   section = 1
   db = get_db()
   df = pd.DataFrame.from_csv("instructors.csv")
   for row in df.iterrows():
      db.execute(
         'INSERT INTO instructors (name, net_id, preps, wl_credits, wl_courses, year, preferred_courses, available_courses, owner, token)'
         ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
         (row[1]['name'], row[0], row[1]['preps'], row[1]['wl_credits'], row[1]['wl_courses'], row[1]['year'], row[1]['preferred_courses'], row[1]['available_courses'], row[1]['owner'], row[1]['token'])
         )
      db.commit()
   df = pd.DataFrame.from_csv("courses.csv")
   for row in df.iterrows():
      data_j = {}
      data_j["course_id"] = row[0]
      data_j["name"] = row[1]['name']
      data_j["owner"] = row[1]['owner']
      data_j["freq_spr"] = row[1]['freq_spr']
      data_j["freq_sum1"] = row[1]['freq_sum1']
      data_j["freq_sum2"] = row[1]['freq_sum2']
      data_j["freq_fal"] = row[1]['freq_fal']
      data_j["freq_spr_l"] = row[1]['freq_spr_l']
      data_j["freq_sum1_l"] = row[1]['freq_sum1_l']
      data_j["freq_sum2_l"] = row[1]['freq_sum2_l']
      data_j["freq_fal_l"] = row[1]['freq_fal_l']
      data_j["year"] = row[1]['year']
      data_j["owner"] = row[1]['owner']
      data_j["token"] = row[1]['token']
      create_sections(db, data_j, data_j["token"])
      db.execute(
         'INSERT INTO courses (course_id, name, owner, freq_spr, freq_sum1, freq_sum2, freq_fal, freq_spr_l, freq_sum1_l, freq_sum2_l, freq_fal_l, year, owner, token)'
         ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
         (row[0], row[1]['name'], row[1]['owner'], row[1]['freq_spr'], row[1]['freq_sum1'], row[1]['freq_sum2'], row[1]['freq_fal'], row[1]['freq_spr_l'], row[1]['freq_sum1_l'], row[1]['freq_sum2_l'], row[1]['freq_fal_l'], row[1]['year'], row[1]['owner'], row[1]['token'])
         )
      db.commit()
   db.execute('INSERT INTO users (username, token, test_password, years, default_year) VALUES ("pqt3", "test", "test", "2019", "2019")')
   db.execute('INSERT INTO users (username, token, test_password, years, default_year) VALUES ("kcm91", "test2", "test2", "2019", "2019")')
   db.execute('INSERT INTO users (username, token, test_password, years, default_year) VALUES ("daj65", "test3", "test3", "2019", "2019")')
   db.execute('INSERT INTO users (username, token, test_password, years, default_year) VALUES ("stan", "test4", "test4", "2019", "2019")')
   db.execute('INSERT INTO admins (token) VALUES ("test4")')


   db.commit()
   db.close()
   return jsonify({'message': 'bad'}), 200
