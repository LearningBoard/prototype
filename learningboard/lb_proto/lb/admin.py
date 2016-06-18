from django.contrib import admin

# Register your models here.

import models as lb

class StudentAdmin(admin.ModelAdmin):
    model = lb.Student

class StaffAdmin(admin.ModelAdmin):
    model = lb.Staff

class ActivityInline(admin.StackedInline):
    model = lb.Activity

admin.site.register(lb.Student, StudentAdmin)
admin.site.register(lb.Staff, StaffAdmin)
admin.site.register(lb.LearningBoard)
admin.site.register(lb.Endorsement)
admin.site.register(lb.Activity)
