from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

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
    return HttpResponse("done");

@csrf_exempt
def lb_add(request):
    return HttpResponse("done");

@csrf_exempt
def activity_add(request):
    return HttpResponse("done");

