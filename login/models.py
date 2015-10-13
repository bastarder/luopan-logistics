#coding=utf-8
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
import datetime

class Person(models.Model):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=25)
    department = models.CharField(max_length=20)
    position = models.CharField(max_length=20)
    person_number = models.CharField(max_length=30)
    def __unicode__(self):
			return self.name
    class Meta:
        permissions = (
            ('can_cy','can cy'),
            ('can_bmjl','can bmj'),
            ('can_Coo','can Coo'),
        )

class Department(models.Model):
    name = models.CharField(max_length=10)
    def __unicode__(self):
			return self.name

class Position(models.Model):
    name = models.CharField(max_length=10)
    def __unicode__(self):
			return self.name

class BugDetail(models.Model):
    person = models.ForeignKey(Person)
    issue_id = models.CharField(max_length=50)
    finish_date = models.DateField()
    pub_date = models.DateTimeField('date published',default=timezone.now)
    def __unicode__(self):
            return self.person.name
            
class LeavePaper(models.Model):
    person = models.ForeignKey(Person)
    entry_time =  models.CharField(max_length=50,blank=True)
    employee_number = models.CharField(max_length=50,blank=True)
    position = models.CharField(max_length=50,blank=True)
    department = models.CharField(max_length=50,blank=True)
    filling_date = models.CharField(max_length=50,blank=True)
    start_date = models.CharField(max_length=50,blank=True)
    end_date = models.CharField(max_length=50,blank=True)
    reinstatement_date = models.CharField(max_length=50,blank=True)
    total_pay = models.CharField(max_length=50,blank=True)
    remarks = models.CharField(max_length=200,blank=True)
    vacation_type_employee = models.CharField(max_length=50,blank=True)
    vacation_type = models.CharField(max_length=50,blank=True)
    should_enjoy = models.CharField(max_length=50,blank=True)
    extracted = models.CharField(max_length=50,blank=True)
    this_times = models.CharField(max_length=50,blank=True)
    left_times = models.CharField(max_length=50,blank=True)
    effective_date = models.CharField(max_length=50,blank=True)
    pub_date = models.DateTimeField('date published',default=timezone.now)
    employee_signature = models.CharField(max_length=50,blank=True)
    manager_signature = models.CharField(max_length=50,blank=True)
    coo_signature = models.CharField(max_length=50,blank=True)
	#返回'1'代表不符合提前 '0'代表符合提前
    def is_right(self):
		filltime = datetime.datetime.strptime(self.filling_date,"%Y-%m-%d").date()
		starttime = datetime.datetime.strptime(self.start_date,"%Y-%m-%d").date()
		endtime = datetime.datetime.strptime(self.end_date,"%Y-%m-%d").date()
		day1 = (endtime-starttime).days
		diffDays= (starttime-filltime).days
		remainDay= diffDays % 7
		weeks = diffDays / 7
		weekends = 2 * weeks
		weekDay = int(filltime.weekday())+1
		if weekDay == 8:
			weekDay = 0
		i=0
		while(i<remainDay):
			if ((weekDay + i) ==6) or ((weekDay + i) ==0) or ((weekDay + i) ==7):
				weekends = weekends + 1
			i=i+1
		day2=diffDays-weekends
		if day1>day2:
			if self.manager_signature and self.coo_signature:
				return '1'
			else:
				return '0'
		else:
			if self.manager_signature:
				return '1'
			else:
				return '0'
    def __unicode__(self):
            return self.employee_number
