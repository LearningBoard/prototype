from django.contrib import admin

# Register your models here.

import models as lb

class StudentAdmin(admin.ModelAdmin):
    model = lb.Student
    list_display = ('username', 'major')

class StaffAdmin(admin.ModelAdmin):
    model = lb.Staff
    list_display = ('username', 'office')

class ActivityInline(admin.StackedInline):
    model = lb.Activity

admin.site.register(lb.Student, StudentAdmin)
admin.site.register(lb.Staff, StaffAdmin)
admin.site.register(lb.Tag)
admin.site.register(lb.Category)
admin.site.register(lb.LearningBoard)
admin.site.register(lb.Endorsement)
admin.site.register(lb.Activity)
admin.site.register(lb.News)
