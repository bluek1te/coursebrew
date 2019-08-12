import os
import logging
logging.basicConfig(level=logging.INFO)

from . import handlebars
from . import db
from flask import Flask
from flask_cors import CORS, cross_origin

def create_app(test_config=None):
    # create and configure the app
	app = Flask(__name__, instance_relative_config=True)
	CORS(app)
	app.config['CORS_HEADERS'] = 'Content-Type'
	#logging.getLogger('flask_cors').level = logging.DEBUG
	app.config.from_mapping(
    	SECRET_KEY='dev',
   	DATABASE=os.path.join(app.instance_path, 'sqlitedb.sqlite'),
	)

	if test_config is None:
        # load the instance config, if it exists, when not testing
    		app.config.from_pyfile('config.py', silent=True)
	else:
        # load the test config if passed in
    		app.config.from_mapping(test_config)

    # ensure the instance folder exists
	try:
   		os.makedirs(app.instance_path)
	except OSError:
		pass

    # a simple page that says hello
	@app.route('/hello')
	def hello():
		return 'Hello, World!'

	db.init_app(app)

	app.register_blueprint(handlebars.bp)
	app.add_url_rule('/', endpoint='index')

	return app


