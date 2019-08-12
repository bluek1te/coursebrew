import json
import pandas as pd
from . import admin
from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort
from sqlitedb.db import get_db
from flask_cors import CORS, cross_origin

def login():
   try:
      db = get_db()
      data_j = json.loads(request.data)
      username = data_j["username"]
      test_password = data_j["test_password"]

      #Scan user login table for matching credentials

      db_user = db.execute(
	'SELECT username, token, default_year'
	' FROM users WHERE (username = ' + '"' + username + '"' +
	' AND test_password = ' + '"' + test_password + '")')
      desc = db_user.description
      column_names = [col[0] for col in desc]
      data = [dict(zip(column_names, row))  
           for row in db_user.fetchall()]
      if(len(data) == 0):

         # If no username/password match, return empty login

         return jsonify({ "username" : " ", "test_password" : " "})
         create_log(request, "Invalid user login attempted (No matching credentials)")
      else:
         ip = request.remote_addr

         # Update user into login cache

         update_login_cache(ip, data[0]["username"], data[0]["token"], data[0]["default_year"])
         admin.create_log(request, "User successfully logged in as " + data[0]["username"]) 
      db.close()
      return json.dumps(data[0])
   except:
      admin.create_log(request, "Error caught in login() located in login.py")
      return jsonify({"message": "Error logging in, please contact server administrators"})

def update_login_cache(ip, username, token, default_year):
   try:
      db = get_db()
      db.execute('DELETE from login_cache WHERE ip ='+ '"' + ip + '"')
      db.execute('INSERT INTO login_cache (ip, username, token, default_year)'
		' VALUES (?, ?, ?, ?)', (ip, username, token, default_year)
		)
      db.commit()
      db.close()
      return
   except:
      admin.create_log(request, "Error caught in update_login_cache() located in login.py")

def check_login_cache():
   try:
      db = get_db()
      ip = request.remote_addr
      db_user = db.execute(
	'SELECT username, token, default_year'
	' FROM login_cache WHERE ip=' + '"' + ip + '"')
      desc = db_user.description
      column_names = [col[0] for col in desc]
      data = [dict(zip(column_names, row))  
           for row in db_user.fetchall()]
      db.close()
      if(len(data) == 0):
         return jsonify({ "username" : " ", "test_password" : " "})
      return json.dumps(data[0])
   except:
      admin.create_log(request, "Error caught in check_login_cache() located in login.py")

def logout():
   try:
      print("Logging Out")
      ip = request.remote_addr
      db = get_db()
      db.execute('DELETE from login_cache WHERE ip ='+ '"' + ip + '"')
      db.commit()
      db.close()
      admin.create_log(request, "Successfully logged out")
      return jsonify({ "username": " ", "token": " " })
   except:
      admin.create_log(request, "Error caught in logout() located in login.py")




