#coding=utf-8
from django.contrib import admin
from django.contrib.auth.models import Permission
from login.models import Person,Position,Department,LeavePaper
# Register your models here.
class LeavePaperInline(admin.StackedInline):
    model = LeavePaper
    fieldsets = [("UpTime",{'fields':['pub_date'],'classes':['collapse']})]
    extra = 0

class PersonAdmin(admin.ModelAdmin):
    fieldsets = [
                ('对应用户',{'fields': ['user']}),
                ("姓名",{'fields': ['name']}),
                ("部门",{'fields': ['department']}),
                ("员工号",{'fields': ['person_number']}),
                ("职位",{'fields': ['position']}),
                ]
    inlines = [LeavePaperInline]
    search_fields = ['name']

admin.site.register(Person, PersonAdmin)
admin.site.register(Position)
admin.site.register(Department)
admin.site.register(Permission)
