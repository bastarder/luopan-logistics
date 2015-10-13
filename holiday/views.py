#coding=utf-8
from django.shortcuts import render,render_to_response
from django.http import HttpResponseRedirect #跳转
from login.models import Person,Position,Department,LeavePaper
from django.contrib.auth.models import User,Group
from django.contrib.auth import authenticate,login
from django.contrib.auth.decorators import login_required
from django.core.cache import cache
from django.template import RequestContext
from django.db.models import Q
from itertools import chain
import time
import datetime
import calendar
@login_required(login_url='/login/')
def public(request):
    person = request.user.person_set.all()[0]
    user = request.user
    leavenote_special_coo=[]
    leavenote=[]
    leavenote_renshi=[]
    leavenote_jingli=[]
    print user.has_perm('login.can_bmjl')
    print user.has_perm('login.can_rs')
    print user.has_perm('login.can_Coo')
    if user.has_perm('login.can_bmjl'):
            leavenote= LeavePaper.objects.filter(department=person.department).exclude(person__name=person.name).filter(manager_signature="")
    if user.has_perm('login.can_rs'):
            leavenote= LeavePaper.objects.filter(vacation_type="")
    if user.has_perm('login.can_Coo'):
            leavenotes= LeavePaper.objects.filter(coo_signature="")
            leavenote=is_date_overload(leavenotes)
            #此参数：维护【谁】处理【人事部】的请假单
            leavenote_renshi= LeavePaper.objects.filter(department="人事行政部").filter(Q(manager_signature="")|Q(coo_signature=""))
            leavenote_jingli= LeavePaper.objects.filter(person__position='部门经理').filter(Q(manager_signature="")|Q(coo_signature=""))
            leavenote_special_coo=chain(leavenote_renshi,leavenote_jingli)
    #显示请假条不同状态数据
    #今天是否 已经 签到【bug修复】TodaySignature
    #Today=datetime.datetime.now().strftime("%Y-%m-%d");
    #TodaySignature = BugDetail.objects.filter(finish_date=Today)
    #已提交请假条数量 has_leave
    has_leave = LeavePaper.objects.filter(person__name=person.name)
    #待处理的请假条
    wait_leave1 = LeavePaper.objects.filter(person__name=person.name).filter(vacation_type="")
    wait_leave2 = LeavePaper.objects.filter(person__name=person.name).exclude(vacation_type="").filter(coo_signature="")
    wait_leave3 = is_date_overload(wait_leave2)
    wait_leave = len(wait_leave1)+len(wait_leave3)
    #已经通过的请假单
    success_leave=len(has_leave)-wait_leave
    return render_to_response('public.html',{'leavenote_special_coo':leavenote_special_coo,  #Coo的特殊处理视角
                                                  'leavenote':leavenote,   #满足权限-共享参数 参数：查询集  单个为 一个LeavePaper
                                                  #'TodaySignature':TodaySignature,
                                                  'has_leave':len(has_leave),
                                                  'wait_leave':wait_leave,
                                                  'success_leave':success_leave,
                                                     },context_instance=RequestContext(request))

@login_required(login_url='/login/')
def post_leave(request):
    person = request.user.person_set.all()[0]
    if not request.POST:
        return render_to_response('post_leave.html',{'person':person},context_instance=RequestContext(request))
        #return render_to_response('post_view.html',{'user':signperson,'person':person,'departments':departments,'postname':postname})
    else:
        items = request.POST
        ADD = LeavePaper(person = person,
                         entry_time =  items['entry_time'],
                         employee_number = items['employee_number'],
                         position = items['position'],
                         department = items['department'],
                         filling_date = items['filling_date'],
                         start_date = items['start_date'],
                         end_date = items['end_date'],
                         reinstatement_date = items['reinstatement_date'],
                         total_pay = items['total_pay'],
                         remarks = items['remarks'],
                         vacation_type_employee = items['vacation_type_employee'],
                         vacation_type = items['vacation_type'],
                         should_enjoy = items['should_enjoy'],
                         extracted = items['extracted'],
                         this_times = items['this_times'],
                         left_times = items['left_times'],
                         effective_date = items['effective_date'],
                         employee_signature = items['employee_signature'],
                         manager_signature = items['manager_signature'],
                         coo_signature = items['coo_signature'])
        ADD.save()
        return render_to_response('post_success.html',context_instance=RequestContext(request))

@login_required(login_url='/login/')
def my_leave(request):
    MyLeave = LeavePaper.objects.filter(person__name=request.user.last_name)
    return render_to_response('my_leave.html',{'MyLeave':MyLeave},context_instance=RequestContext(request))

@login_required(login_url='/login/')
def change_leave(request):
    if not request.POST:
        LeaveID = request.GET['id']
        detail = LeavePaper.objects.get(id=LeaveID)
        return render_to_response('change_leave.html',{'detail':detail},context_instance=RequestContext(request))
    else:
        LeaveID = request.POST['change_id']
        items = request.POST
        detail = LeavePaper.objects.get(id=LeaveID)
        detail.entry_time = items['entry_time']
        detail.employee_number = items['employee_number']
        detail.position = items['position']
        detail.department = items['department']
        detail.filling_date = items['filling_date']
        detail.start_date = items['start_date']
        detail.end_date = items['end_date']
        detail.reinstatement_date = items['reinstatement_date']
        detail.total_pay = items['total_pay']
        detail.remarks = items['remarks']
        detail.vacation_type_employee = items['vacation_type_employee']
        detail.vacation_type = items['vacation_type']
        detail.should_enjoy = items['should_enjoy']
        detail.extracted = items['extracted']
        detail.this_times = items['this_times']
        detail.left_times = items['left_times']
        detail.effective_date = items['effective_date']
        detail.employee_signature = items['employee_signature']
        detail.manager_signature = items['manager_signature']
        detail.coo_signature = items['coo_signature']
        detail.save()
        return render_to_response('change_success.html',context_instance=RequestContext(request))

@login_required(login_url='/login/')
def all_leave(request):
    person = Person.objects.all()
    return render_to_response('all_leave.html',{'person':person},context_instance=RequestContext(request))

@login_required(login_url='/login/')
def all_leave_for_one(request):
    PersonID = request.GET['PersonID']
    person = Person.objects.get(id=PersonID)
    LeaveList = person.leavepaper_set.all()
    print LeaveList
    return render_to_response('all_leave_for_one.html',{'LeaveList':LeaveList},context_instance=RequestContext(request))

@login_required(login_url='/login/')
def all_leave_delete(request):
    LeaveID=request.GET['LeaveID']
    Leave = LeavePaper.objects.get(id=LeaveID)
    PersonID = Leave.person.id
    Leave.delete()
    return render_to_response('all_leave_delete.html',{'PersonID':PersonID},context_instance=RequestContext(request))

#--------------- 处理函数 -----------------------
#函数：提交日期是否为及时 返回为:及时的Querset
def is_date_overload(leavenotes):
    leavenote=[]
    for s in leavenotes:
        if s.filling_date and s.start_date and s.end_date:
            filltime =datetime.datetime.strptime(s.filling_date,"%Y-%m-%d").date()
            starttime =datetime.datetime.strptime(s.start_date,"%Y-%m-%d").date()
            endtime =datetime.datetime.strptime(s.end_date,"%Y-%m-%d").date()
            day1= (endtime-starttime).days
            #提前的工作日
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
                leavenote.append(s);
    return leavenote
