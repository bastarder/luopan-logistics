import sae
import sys
import os
from newDjango import wsgi
root = os.path.dirname(__file__)
sys.path.insert(0, os.path.join(root, 'site-packages'))
application = sae.create_wsgi_app(wsgi.application)
