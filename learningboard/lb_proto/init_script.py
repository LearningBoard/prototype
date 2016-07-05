from lb.models import *
Staff.objects.create(username = "admin", password = "adminadmin")
Student.objects.create(username = "argon", password = "123456")
LearningBoard.objects.create(author = Staff.objects.all()[0], title = "second board", description = 'join us!', status = 1)

