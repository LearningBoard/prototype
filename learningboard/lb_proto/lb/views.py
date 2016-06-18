from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def method_required(required_method):
    ''' returns a decorator specifing the method required for a request '''
    # parameters of the decorator
    def _decorator(func):
        def _wrapper(request, *args, **kwargs):
            if request.method != required_method.upper():
                return HttpResponse(requrired_method+' request is required')
            else:
                return func(request, *args, **kwargs)
        return _wrapper
    return _decorator

@method_required("post")
def account_add(request):
    return HttpResponse("done");

@method_required("post")
def lb_add(request):
    return HttpResponse("done");

@method_required("post")
def activity_add(request):
    return HttpResponse("done");

