#coding=utf-8
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import Context
from django.shortcuts import render_to_response
from login.models import Person,LeavePaper,Department,BugDetail
from django.core.cache import cache
from django.http import StreamingHttpResponse
from django.template import RequestContext
import time
import datetime
import calendar
import xlwt
import httplib, urllib,json

def filter_version(request):
    if request.GET:
        start_time=request.GET['start_time']
        end_time=request.GET['end_time']
        project_id = request.GET['project_id']
        if request.GET['finish_name']:
            finish_name_str = True
            finish_name = request.GET['finish_name']
            f_name = finish_name
        else:
            finish_name_str = False
            f_name = '所有人'
    else:
        return render_to_response('filter_version.html')

    start_time=datetime.datetime.strptime(start_time,"%Y-%m-%d").date()
    end_time=datetime.datetime.strptime(end_time,"%Y-%m-%d").date()
    customer_bug=[]

    params = urllib.urlencode({'login':'钱杰','email': '85257684@qq.com', 'password': '85257684'})
    conn = httplib.HTTPConnection("180.97.80.177:8087")
    conn.request("POST", "/api/v3/session", params)
    response = conn.getresponse().read()
    user_more = json.loads(response)
    private_token = user_more['private_token']
    print private_token
    conn.close()
    def get_json_to_dict(a):
        conn = httplib.HTTPConnection("180.97.80.177:8087")
        conn.request("GET", a)
        response = conn.getresponse().read()
        issues_more = json.loads(response)
        conn.close()
        return issues_more
    page=1
    x=0
    print "--------customer----------"
    while(1):
        a="/api/v3/projects/" + project_id + "/issues?state=closed&order_by=updated_at&per_page=20&private_token="+private_token+"&page="+str(page)
        project_customer = get_json_to_dict(a)
        if len(project_customer)<1:
                break
        for a in project_customer:
            issues_title = a['title']
            issues_create = a['created_at'][0:10]
            issues_update = a['updated_at'][0:10]
            issues_iid = a['iid']
            if a['assignee']:
                issues_cname = a['assignee']['name']
            else:
                issues_cname = 'none'
            if a['author']:
                issues_fname = a['author']['name']
            else:
                issues_fname = 'none'
            labels = a['labels']
            issues_labels = []
            for la in labels:
                issues_labels.append(la)
            update_time=datetime.datetime.strptime(issues_create,"%Y-%m-%d").date()
            if update_time >= start_time and update_time <= end_time:
                if finish_name_str:
                    if finish_name == issues_fname:
                        customer_bug.append([issues_title,issues_labels,issues_iid,issues_create,issues_update,issues_cname,issues_fname])
                else:
                    customer_bug.append([issues_title,issues_labels,issues_iid,issues_create,issues_update,issues_cname,issues_fname])
        page=page+1
    return render_to_response('filter_version.html',{'customer_bug':customer_bug,
                                                     'start_time':start_time,
                                                     'end_time':end_time,
                                                     'f_name':f_name})
    #return render_to_response('filter_version.html',context_instance=RequestContext(request))

def customer_view(request):
    if not request.GET:
        c_page='1'
        project_id='1'
    else:
        if request.GET['project_id']:
            project_id = request.GET['project_id']
            request.session['project_id'] = project_id
            request.session['project_change'] = 1
        else:
            request.session['project_id'] = project_id
            request.session['project_change'] = 0
        if request.GET['page']:
            c_page=request.GET['page']
        else:
            c_page='1'
    customer_bug=[]
    page_all=[]
    try:
        private_token = request.session['private_token']
    except:
        params = urllib.urlencode({'login':'钱杰','email': '85257684@qq.com', 'password': '85257684'})
        conn = httplib.HTTPConnection("180.97.80.177:8087")
        conn.request("POST", "/api/v3/session", params)
        response = conn.getresponse().read()
        user_more = json.loads(response)
        private_token = user_more['private_token']
        request.session['private_token'] = private_token
        print private_token
        conn.close()
    def get_json_to_dict(a):
        conn = httplib.HTTPConnection("180.97.80.177:8087")
        conn.request("GET", a)
        response = conn.getresponse().read()
        issues_more = json.loads(response)
        conn.close()
        return issues_more
    #返回所有project的 name 和 id
    #a="/api/v3/projects?private_token="+private_token
    #issues_more = get_json_to_dict(a)
    #for a in issues_more:
            #print a['id'],a['name']
    #返回计算customer的页数
    try:
        ss1 = request.session['page_customer']
        ss2 = request.session['project_change']
        print "ss2:",ss2
        if int(ss2) == 0:
            page = ss1
        else:
            request.session['nonessssss']
    except:
        a="/api/v3/projects/" + project_id + "/issues?state=closed&per_page=1&private_token="+private_token
        project_customer = get_json_to_dict(a)
        for a in project_customer:
            page = (int(a['iid']) / 20)
            request.session['page_customer'] = page
    #返回customer的所有bug
    a="/api/v3/projects/" + project_id + "/issues?state=closed&per_page=20&order_by=updated_at&private_token="+private_token+"&page="+str(c_page)
    project_customer = get_json_to_dict(a)
    for index,a in  enumerate(project_customer):
        issues_title = a['title']
        issues_create = a['created_at'][0:10]
        issues_update = a['updated_at'][0:10]
        if a['assignee']:
            issues_cname = a['assignee']['name']
        else:
            issues_cname = 'none'
        if a['author']:
            issues_fname = a['author']['name']
        else:
            issues_fname = 'none'
        labels = a['labels']
        issues_labels = []
        issues_iid = a['iid']
        for la in labels:
            issues_labels.append(la)
        customer_bug.append([issues_title,issues_labels,issues_iid,issues_create,issues_update,issues_cname,issues_fname])
    i=1
    while(i<=(page+1)):
        page_all.append(i)
        i=i+1
    if project_id == '1':
        system_name = '客户系统'
    if project_id == '2':
        system_name = '客服系统'
    return render_to_response('customer_view.html',{'customer_bug':customer_bug,
                                                    'page_all':page_all,
                                                    'up_page': (int(c_page)-1),
                                                    'down_page': (int(c_page)+1),
                                                    'project_id':project_id,
                                                    'system_name':system_name,
                                                    'now_page':c_page,
                                                    },context_instance=RequestContext(request))
