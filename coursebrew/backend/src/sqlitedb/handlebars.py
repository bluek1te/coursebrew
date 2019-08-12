import json
import pandas as pd
from . import classes
from . import instructors
from . import courses
from . import warnings
from . import test
from . import scope
from . import login
from . import export
from . import admin
from . import sections

import click
from flask import current_app, g
from flask.cli import with_appcontext


from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, jsonify
)
from werkzeug.exceptions import abort
from sqlitedb.db import get_db
from flask_cors import CORS, cross_origin

bp = Blueprint('handlebars', __name__)

@bp.route('/get_instructors', methods=['GET', 'POST'])
def bp_get_instructors():
  return instructors.get_instructors()

@bp.route('/get_instructor', methods=['GET', 'POST'])
def bp_get_instructor():
  return instructors.get_instructor()

@bp.route('/add_instructor', methods=['POST', 'GET'])
def bp_add_instructor():
  return instructors.add_instructor()

@bp.route('/edit_instructor', methods=['POST', 'GET'])
def bp_edit_instructor():
  return instructors.edit_instructor()

@bp.route('/filter_instructors', methods=['GET', 'POST'])
def bp_filter_instructors():
  return instructors.filter_instructors()

@bp.route('/get_courses', methods=['GET', 'POST'])
def bp_get_courses():
  return courses.get_courses()

@bp.route('/get_course', methods=['GET', 'POST'])
def bp_get_course():
  return courses.get_course()

@bp.route('/get_course_names', methods=['GET', 'POST'])
def bp_get_course_names():
  return courses.get_course_names()

@bp.route('/add_course', methods=['POST', 'GET'])
def bp_add_course():
  return courses.add_course()

@bp.route('/edit_course', methods=['POST', 'GET'])
def bp_edit_course():
  return courses.edit_course()

@bp.route('/delete_course', methods=['POST'])
def bp_delete_course():
  return courses.delete_course()

@bp.route('/get_all_sections', methods=['POST', 'GET'])
def bp_get_all_sections():
  return sections.get_all_sections()

@bp.route('/get_sections_spr', methods=['POST', 'GET'])
def bp_get_sections_spr():
  return sections.get_sections_spr()

@bp.route('/get_sections_sum1', methods=['POST', 'GET'])
def bp_get_sections_sum1():
  return sections.get_sections_sum1()

@bp.route('/get_sections_sum2', methods=['POST', 'GET'])
def bp_get_sections_sum2():
  return sections.get_sections_sum2()

@bp.route('/get_sections_fal', methods=['POST', 'GET'])
def bp_get_sections_fal():
  return sections.get_sections_fal()

@bp.route('/assign_course', methods=['POST'])
def bp_assign_course():
  return sections.assign_course()

@bp.route('/get_warnings', methods=['POST', 'GET'])
def bp_get_warnings():
  return warnings.get_warnings()

@bp.route('/pull_from_csv', methods=['GET'])
def bp_pull_from_csv():
  return test.pull_from_csv()

@bp.route('/add_year_copy', methods=['POST', 'GET'])
def bp_add_year_copy():
  return scope.add_year_copy()

@bp.route('/get_years', methods=['POST', 'GET'])
def bp_get_years():
  return scope.get_years()

@bp.route('/generate_pdf', methods = ['POST', 'GET'])
def bp_generate_pdf():
  return export.generate_pdf()

@bp.route('/delete_year', methods = ['POST'])
def bp_delete_year():
  return scope.delete_year()

@bp.route('/delete_instructor', methods = ['POST'])
def bp_delete_instructor():
  return instructors.delete_instructor()

@bp.route('/login', methods = ['POST'])
def bp_login():
  return login.login()

@bp.route('/check_login_cache', methods = ['GET'])
def bp_check_login_cache():
  return login.check_login_cache()

@bp.route('/logout', methods = ['GET'])
def bp_logout():
  return login.logout()

@bp.route('/get_log', methods = ['GET', 'POST'])
def bp_get_log():
  return admin.get_log()

