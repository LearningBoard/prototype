from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
import tools
from models import *
# Create your views here.

@csrf_exempt
def method_required(required_method):
    ''' returns a decorator specifing the method required for a request '''
    # parameters of the decorator
    def _decorator(func):
        def _wrapper(request, *args, **kwargs):
            if request.method != required_method.upper():
                return HttpResponse(required_method + ' request is required')
            else:
                return func(request, *args, **kwargs)
        return _wrapper
    return _decorator

@csrf_exempt
def account_add(request):
    print request.POST
    return HttpResponse("done")

@csrf_exempt
def lb_add(request):
    data = dict(request.POST.iterlists())
    print request.POST
    LearningBoard.objects.create(title = request.POST['title'])
    return HttpResponse("done")

@csrf_exempt
def activity_add(request):
    return HttpResponse("done")

@csrf_exempt
def user_login(request):
    print request.GET
    usr = request.GET['username']
    pwd = request.GET['password']

    stu = tools.get_or_None(Student, username = usr)

    if stu.password != pwd:
        return HttpResponse("auth error", status = 401);
    return JsonResponse({"pk": stu.id});

