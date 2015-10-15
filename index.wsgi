import sae

from newDjango import wsgi
application = sae.create_wsgi_app(wsgi.application)
