from lb.models import *
Staff.objects.create(username = "admin", password = "adminadmin")
LearningBoard.objects.create(author = Staff.objects.all()[0], title = "first board", description = 'join us!')

