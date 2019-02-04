import webapp2
from google.appengine.api import taskqueue
from flask import Flask, render_template, request
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
