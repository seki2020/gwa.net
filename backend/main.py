import webapp2
from google.appengine.api import taskqueue
from google.appengine.api import urlfetch
from google.cloud import firestore
from flask import Flask, render_template, request
import json
import os
import logging

app = Flask(__name__)


@app.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    return 'Hello World!'


@app.route("/task")
def task():

    url = "/run-task"
    params = {'stuff': 'aadje'}
    taskqueue.add(queue_name='default', url=url, params=params,
                  retry_options=taskqueue.TaskRetryOptions(task_retry_limit=0))

    logging.warning("Set a task")

    return ""


@app.route("/run-task", methods=['post'])
def run_task():
    logging.warning("Running a task")

    return ""


@app.route("/migrate")
def migrate():
    logging.warning("Migrate stuff")

    url = 'http://www.goingwalkabout.net/export/events/'

    response = urlfetch.fetch(url=url)
    result = json.loads(response.content)

    print(result)
    trips = result["response"]["events"]
    for trip in trips:
        print(trip["name"])

    return "Done doing migration"


@app.route("/dbtest")
def dbtest():
    credential_path = os.path.join(os.path.dirname(__file__), '../secrets/gwa-net-13e914d23139.json')
    db = firestore.Client.from_service_account_json(credential_path)

    users_ref = db.collection(u'users')
    docs = users_ref.get()

    for doc in docs:
        print(u'{} => {}'.format(doc.id, doc.to_dict()))

    return "This is a DB test"

@app.errorhandler(500)
def server_error(e):
    # Log the error and stacktrace.
    logging.exception('An error occurred during a request.')
    return 'An internal error occurred.', 500



# Webapp
# class MainPage(webapp2.RequestHandler):
#     def get(self):
#         self.response.headers['Content-Type'] = 'text/plain'
#         self.response.write('Hello, World!')
#
#
# class Task(webapp2.RedirectHandler):
#     def get(self):
#         self.response.write("Go and set a task")
#
#         url = "/run-task"
#         params = {'stuff': 'aadje'}
#         taskqueue.add(queue_name='default', url=url, params=params,
#                       retry_options=taskqueue.TaskRetryOptions(task_retry_limit=0))
#
#         logging.warning("Set a task")
#
#
# class RunTask(webapp2.RedirectHandler):
#     def post(self):
#         logging.warning("Running a task")
#
#
# app = webapp2.WSGIApplication([
#     ('/', MainPage),
#     ('/task', Task),
#     ('/run-task', RunTask)
# ], debug=True)
