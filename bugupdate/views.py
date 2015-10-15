#coding=utf-8
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.template import Context
from django.shortcuts import render_to_response
from login.models import Person,LeavePaper,Department,BugDetail
from django.core.cache import cache
from django.http import StreamingHttpResponse
import time
import datetime
import calendar
import xlwt
from django.contrib.auth import authenticate,login
from django.contrib.auth.decorators import login_required
from django.template import RequestContext

#bugview
@login_required(login_url='/login/')
def bug_view(request):
    bugname=request.user.last_name
    if request.GET:
        l=request.GET
        #[0123-56]
        choice_date=l['yearmonth']
        choice_year = int(choice_date[0:4])
        choice_month = int(choice_date[-2:])
    else:
        today = datetime.date.today()
        choice_year = int(today.year)
        choice_month = int(today.month)
    result={}
    text=[]
    this_month_day = calendar.monthrange(choice_year,choice_month)
    #当前月份天数 this_month_day
    this_month_day=this_month_day[1]
    #当前月份第一天为周几 first_day
    first_day=datetime.datetime(choice_year,choice_month,1).strftime("%w");
    #上个月的天数 last_month_day
    last_year = choice_year
    last_month = choice_month-1
    if last_month == 0:
        last_year=last_year-1
        last_month=12
    last_month_day=calendar.monthrange(last_year,last_month)
    last_month_day=last_month_day[1]
    #尝试输出元组
    i=int(first_day)-1
    while(i>0):
        day_date=-(int(last_month_day)-i+1)
        result[day_date]=text
        i=i-1
    i=1
    while(i<=int(this_month_day)):
        text=[]
        day_date=i
        if i<10:
            j="0"+str(i)
        else:
            j=str(i)
        daydate=str(choice_year)+'-'+str(choice_month)+'-'+j
        gi=BugDetail.objects.filter(finish_date=daydate)
        for a in gi:
            text.append(a.person.name)
        result[day_date]=text
        i=i+1
    i=1
    endbox=42-int(this_month_day)-int(first_day)+1
    while(i<=endbox):
        day_date=100+i
        result[day_date]=text
        i=i+1
    tabledate=sorted(result.iteritems(),key=lambda asd:asd[0] ,reverse = False)
    if int(choice_month)<10:
        choice_month='0'+str(choice_month)
    return render_to_response('bugview/bug_view.html',{'tabledate':tabledate,
                                                        'choice_year':choice_year,
                                                        'choice_month':choice_month,
                                                        'bugname':bugname},context_instance=RequestContext(request))

def close_view(request):
    if request.POST:
        b = request.POST
        person = request.user.person_set.all()[0]
        ADD = BugDetail(issue_id=b['issue_id'],finish_date=b['finish_date'],person=person)
        ADD.save()
        return render_to_response('bugview/close_view.html',context_instance=RequestContext(request))
    else:
        return render_to_response('bugview/close_view.html',context_instance=RequestContext(request))

def Report_view(request):
    l=request.GET
    PrintOutExcel=l['OutExcel']
    getyear=l['getyear']
    getmonth=l['getmonth']
    print getyear
    print getmonth
    i=1
    report={}
    while(i<32):
        if i<10:
            j="0"+str(i)
        else:
            j=str(i)
        daydate= str(getyear)+'-'+str(getmonth)+'-'+str(j)
        def is_valid_date(str):
            try:
                time.strptime(str, "%Y-%m-%d")
                return True
            except:
                return False
        a=is_valid_date(daydate)
        if a:
            gi=BugDetail.objects.filter(finish_date=daydate)
            if gi:
                report[daydate]=gi
        i=i+1
    reports=sorted(report.iteritems(),key=lambda asd:asd[0] ,reverse = False)
    if PrintOutExcel == '1':
        workbook = xlwt.Workbook()
        sheet = workbook.add_sheet("report")
        sheet.write(0, 0, "Date")
        sheet.write(0, 1, "name")
        sheet.write(0, 2, "bug")
        sort=1
        for a,b in report.items():
            sheet.write(sort, 0, str(a))
            for i,x in enumerate(b):
                sheet.write(int(sort)+int(i)+1, 1, x.person.name)
                if not x.issue_id:
                    sheet.write(int(sort)+int(i)+1, 2, '------------')
                else:
                    sheet.write(int(sort)+int(i)+1, 2, x.issue_id)
            sort=int(len(b))+sort+1
             # row, column, value
        workbook.save("monthReport.xls")
        the_file_name = "monthReport.xls"
        def file_iterator(file_name, chunk_size=512):
            with open(file_name) as f:
                while True:
                    c = f.read(chunk_size)
                    if c:
                        yield c
                    else:
                        break
        response = StreamingHttpResponse(file_iterator(the_file_name))
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="{0}"'.format(the_file_name)
        return response
    return render_to_response('bugview/Report_view.html',{'report':reports,'getyear':getyear,'getmonth':getmonth},context_instance=RequestContext(request))






#
