from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.forms.models import model_to_dict
import tools, json
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
    stu = Student.objects.create(
        username = request.POST['username'],
        password = request.POST['password']
    )
    if stu.id is not None:
      return JsonResponse({"pk": stu.id});
    else:
      return HttpResponse("register error", status = 401);

@csrf_exempt
def lb_get(request, pk):
    print request.GET
    board = LearningBoard.objects.get(pk = pk)
    if board is None:
        return HttpResponse("not found", status = 404)
    else:
        # TODO output image field
        activity =  [ model_to_dict(obj) for obj in Activity.objects.filter(lb = pk) ]
        return JsonResponse({'board': model_to_dict(board, fields=[], exclude=['image']), 'activity': activity});

@csrf_exempt
def lb_add(request):
    data = dict(request.POST.iterlists())
    print request.POST
    board = LearningBoard.objects.create(
        title = request.POST['title'],
        description = request.POST['description']
    )
    if request.POST.getlist('activity_list[]', None) is not None:
        Activity.objects.filter(pk__in = request.POST.getlist('activity_list[]')).update(lb = board.id)
    return JsonResponse({"pk": board.id});

@csrf_exempt
def lb_edit(request, pk):
    print request.POST
    board = LearningBoard.objects.get(pk = request.POST['pk'])
    if board is None:
        return HttpResponse("not found", status = 404)
    else:
        board.title = request.POST['title']
        board.description = request.POST['description']
        board.save()
        return JsonResponse({"pk": board.id});

@csrf_exempt
def lb_delete(request, pk):
    print request.GET
    LearningBoard.objects.filter(pk = pk).delete()
    return HttpResponse("done")

@csrf_exempt
def lb_publish(request, pk):
    board = LearningBoard.objects.get(pk = pk)
    board.status = "PB"
    board.save()
    return HttpResponse("done")

@csrf_exempt
def lb_unpublish(request, pk):
    board = LearningBoard.objects.get(pk = pk)
    board.status = "UP"
    board.save()
    return HttpResponse("done")

@csrf_exempt
def activity_add(request):
    print request.POST
    data = json.dumps({key: request.POST.dict()[key] for key in request.POST.dict() if key not in ['pk', 'title', 'description', 'type']})
    if request.POST.get('pk', None) is None:
        act = Activity.objects.create(
            title = request.POST['title'],
            description = request.POST['description'],
            type = request.POST['type'],
            data = data
        )
    else:
        act = Activity.objects.create(
            title = request.POST['title'],
            description = request.POST['description'],
            type = request.POST['type'],
            data = data,
            lb = LearningBoard.objects.get(pk = request.POST['pk'])
        )
    return JsonResponse({"pk": act.id});

@csrf_exempt
def activity_delete(request, pk):
    Activity.objects.filter(pk = pk).delete()
    return HttpResponse("done")

@csrf_exempt
def user_login(request):
    print request.GET
    usr = request.GET['username']
    pwd = request.GET['password']

    stu = tools.get_or_None(Student, username = usr)
    if stu is None:
        return HttpResponse("auth error", status = 401);

    if stu.password != pwd:
        return HttpResponse("auth error", status = 401);
    return JsonResponse({"pk": stu.id});
