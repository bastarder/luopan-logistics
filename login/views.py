#coding=utf-8
from django.shortcuts import render,render_to_response
from django.http import HttpResponseRedirect #跳转
from login.models import Person,Position,Department
from django.contrib.auth.models import User,Group
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.core.cache import cache
from django.contrib.sessions.models import Session
from django.template import RequestContext
# ----------------------------- 视图 函数-----------------------------

# 登陆 视图函数
def logins(request):
    #ss=Session.objects.all()
    #ss.delete()
    if not request.POST:
        if request.user.is_authenticated():
            try:
                test = request.user.person_set.all()[0]
            except:
                logout(request)
            return HttpResponseRedirect('/welcome/')
        else:
            return render_to_response('login.html')
    else:
        username = request.POST['username']
        password = request.POST['password']
        errors=[]
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request,user)
                return HttpResponseRedirect('/welcome/')
            else:
                errors.append('该账号已被禁用！请联系管理员！')
        else:
            errors.append('账号或密码错误，登陆失败！')
            return render_to_response('login.html',{'errors':errors})

# 注册 视图函数
def register(request):
    if not request.POST:
        # 如果 不是 POST 则 初始化 空白 表单
        position = Position.objects.all()
        department = Department.objects.all()
        return render_to_response('register.html',{'position':position,
                                                    'department':department,})
    else:
        # 如果 接收到 POST 则 进入 表单信息验证
        items = request.POST
        errors = []
        # 判断是否 有错误信息
        if not items['name']:
            errors.append('请输入姓名')
        if not items['username']:
            errors.append('请输入账号')
        if not items['password']:
            errors.append('请输入密码')
        user = User.objects.all()
        for a in user:
            if a.username == items['username']:
                errors.append('此账号已存在！')
            if a.last_name == items['name']:
                errors.append('此人已存在！')
        # 如果有错误信息，初始化 空白 表单 ，显示错误 项
        if errors:
            position = Position.objects.all()
            department = Department.objects.all()
            return render_to_response('register.html',{'position':position,
                                                        'department':department,
                                                        'errors':errors})
        # 如果没有错误信息 创建 用户 以及 对应 person ，加入 指定 组 ，返回到 login 页面
        else:
            newUser=User.objects.create_user(items['username'],'',items['password'])
            newUser.last_name=items['name']
            newUser.save()
            newperson=Person(user=newUser,
                              name=items['name'],
                              department=items['department'],
                              position=items['position'],
                              person_number=items['person_number'],
                             )
            newperson.save()
            # 加入 指定的权限 组
            add_group(newUser,newperson.department)
            add_group(newUser,newperson.position)
            return render_to_response('login.html')

# 退出登陆 视图函数
def signouts(request):
    logout(request)
    return render_to_response('login.html')

# 登陆成功 我的信息 视图函数
@login_required(login_url='/login/')
def welcome(request):
    #获取账户所对的person的信息
    person = request.user.person_set.all()[0]
    return render_to_response('welcome.html',{'person':person},context_instance=RequestContext(request))


# ----------------------------- 自定义 操作 函数-----------------------------

#函数：添加 某用户 到 某组
def add_group(user,groupname):
    try:
        a=Group.objects.get(name=groupname)
        user.groups.add(a)
        return True
    except:
        print "【添加失败】错误代码：do not find this group: "+groupname
        return False
#函数：判断某用户是否在某组内 true 在 false不在
def is_in_group(user,name):
    if len(user.groups.filter(name=name))==1:
        return True
    else:
        return False
#函数：判断某用户是否有某个权限 true 有 false 没有
def if_can_do(user,permission):
    a = user.has_perm(permission)
    if a:
        return True
    else:
        return False
