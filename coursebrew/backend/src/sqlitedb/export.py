import json
import pandas as pd
from . import sections
from . import instructors
from . import classes
from fpdf import FPDF

from flask import (Blueprint, send_file, flash, g, redirect, render_template, request, url_for, jsonify)
from werkzeug.exceptions import abort
from sqlitedb.db import get_db
from flask_cors import CORS, cross_origin

year = '2019'

class CustomPDF(FPDF):
  
  def header(self):
    # Set up a logo
    self.image('logo.png', w=220)
    self.set_font('Arial', 'B', 18)
    self.cell(0, 0, year, 0, 0, 'R')
    self.ln(20)

  def footer(self):
    self.set_y(-10)

    self.set_font('Arial', 'I', 8)

    # Add a page number
    page = 'Page ' + str(self.page_no()) + '/{nb}'
    self.cell(0, 10, page, 0, 0, 'C')


def generate_pdf():
    
    #data_j = json.loads(request.data)
    #year = data_j['year']
    year = '%'
    token = '%'
    
    secciones = sections.turn_sections_to_objects(year, token)
    instructores = instructors.turn_instructors_to_objects(year, token)
    instr_names = {}
    sem = ''
    for i in instructores:
      instr_names[i.net_id] = i.name

    instr_names['Unassigned'] = 'NO INSTRUCTOR'

    sorted(secciones, key=lambda x: (x.course_id, x.section_number))

    filePath = './pdfExport.pdf'
    pdf = CustomPDF('L', 'pt', 'Letter')
    pdf.set_title('PDF Course Assignment Export')
    pdf.set_author('Coursebrew')
    pdf.add_page()
    pdf.set_font('Times', '', 14)
    pdf.cell(60, 14, '', 0, 0, 'L')
    pdf.cell(180, 14, 'COURSE NAME','B',0,'C')
    pdf.cell(106, 14, 'COURSE ID','B',0,'C')
    pdf.cell(92, 14, 'SECTION','B',0,'C')
    pdf.cell(92, 14, 'SEMESTER','B',0,'C')
    pdf.cell(150, 14, 'INSTRUCTOR','B',0,'C')
    pdf.cell(60, 14, '', 0, 1, 'L')
    for s in secciones:
      if s.sem == 'Fal':
        sem = 'Fall'
      elif s.sem == 'Spr':
        sem = 'Spring'
      elif s.sem == 'Sum1':
        sem = 'Summer I'
      elif s.sem == 'Sum2':
        sem = 'Summer II'
      else:
        sem = 'What!?!?'
        print('You should not be here')
      pdf.cell(60, 14, '', 0, 0, 'L')
      pdf.cell(180, 14, s.course_name,'B',0,'C')
      pdf.cell(106, 14, s.course_id,'B',0,'C')
      pdf.cell(92, 14, s.section_number,'B',0,'C')
      pdf.cell(92, 14, sem,'B',0,'C')
      pdf.cell(150, 14, instr_names[s.instructor_id],'B',0,'C')
      pdf.cell(60, 14, '', 0, 1, 'L')
    pdf.output(filePath, 'F')
    print(filePath)
    return send_file('pdfExport.pdf', attachment_filename='pdfExport.pdf')
