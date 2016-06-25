from lb.models import *
try:
    Staff.objects.create(username = "admin", password = "adminadmin")
except:
    pass
