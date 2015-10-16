"""newDjango URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from login import views as login_view
from holiday import views as holiday_view
from bugupdate import views as bugupdate_view
from newversion import views as newversion_view
urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    #APP[login]
    url(r'^login/', login_view.logins),
    url(r'^$', login_view.logins),
    url(r'^register/', login_view.register),
    url(r'^signout/', login_view.signouts),
    url(r'^welcome/', login_view.welcome),
    #APP[holiday]
    url(r'^public/', holiday_view.public),
    url(r'^post_leave/', holiday_view.post_leave),
    url(r'^my_leave/', holiday_view.my_leave),
    url(r'^change_leave/', holiday_view.change_leave),
    url(r'^all_leave/', holiday_view.all_leave),
    url(r'^all_leave_for_one', holiday_view.all_leave_for_one),
    url(r'^all_leave_delete', holiday_view.all_leave_delete),
    #APP[bugupdate]
    url(r'^bugview/bug_view/$', bugupdate_view.bug_view),
    url(r'^bugview/close_view/$', bugupdate_view.close_view),
    url(r'^bugview/Report_view/$', bugupdate_view.Report_view),
    #APP[updateverson]
    url(r'^customer_view/$',newversion_view.customer_view),
    url(r'^filter_version/$',newversion_view.filter_version),
]
