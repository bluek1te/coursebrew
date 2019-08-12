import datetime
import random
from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort
from sqlitedb.db import get_db
from flask_cors import CORS, cross_origin


def create_log(request, message):
	print("Writing to log")
	f = open("log.txt", "a+")
	f.write(request.remote_addr + " (" + str(datetime.datetime.now()) + ")" + ": " + message+"\n")
	f.close()

def create_user():
	try:
		data_j = json.loads(request.data)
		username = data_j["username"]
		test_password = data_j["test_password"]
		random.seed()
		token = str(random.random()) + username
		db = get_db()
		db.execute(
			'INSERT INTO users (username, test_password)'
			' VALUES (?, ?)',
			(username, test_password)
			)
		db.commit()
		db.close()
		return jsonify({'message': 'user added!'}), 200
		create_log(request, username + " added to users")
	except:
		create_log(request, "Error caught in create_user() located in admin.py")

def check_admin(token):
	try:
		db = get_db()
		db_admins = db.execute(
			'SELECT token FROM admins WHERE token = ' + '"' + token + '"')
		desc = db_admins.description
		column_names = [col[0] for col in desc]
		data = [dict(zip(column_names, row))  
			for row in db_admins.fetchall()]
		if len(data) != 0:
			return True
			print("This is an admin")
		else:
			return False
	except:
		create_log(request, "Error caught in check_admin() located in admin.py")

def get_log():
	try:
		with open('log.txt', 'r') as file:
			data = file.read().replace('\n', '<br>')
		return jsonify({'content': data}), 200
	except:
		print("Error in get_log")
		create_log(request, "Error caught in get_log() located in admin.py")
		return jsonify({'message': 'Error caught in get_log(), please contact server administrator'}), 200

		 
	
	
