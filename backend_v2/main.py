# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python37_app]
import os
from flask import Flask
import requests
from google.cloud import firestore


# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)


@app.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    return 'Hello World!'


@app.route('/test')
def test():
    # Fetch from production
    url = 'http://www.goingwalkabout.net/export/events/'

    response = requests.get(url=url)

    print(response.status_code)
    print(response.headers)
    print(response.content)

    return "Dit is een test"


@app.route('/dbtest')
def dbtest():

    credential_path = os.path.join(os.path.dirname(__file__), 'secrets/gwa-net-13e914d23139.json')
    db = firestore.Client.from_service_account_json(credential_path)

    users_ref = db.collection(u'users')
    docs = users_ref.get()

    for doc in docs:
        print(u'{} => {}'.format(doc.id, doc.to_dict()))

    return "This is a DB test"


@app.route("/task")
def task():
    print("Go and start a task")


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python37_app]
