from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.forms.models import model_to_dict
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
        return JsonResponse(model_to_dict(board, fields=[], exclude=['image']));

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
def lb_edit(request):
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
def activity_add(request):
    print request.POST
    if request.POST.get('pk', None) is None: # board_pk
        act = Activity.objects.create(
            name = request.POST['title'],
            video_link = request.POST['video_link'],
            desc = request.POST['description']
        )
    else:
        act = Activity.objects.create(
            name = request.POST['title'],
            video_link = request.POST['video_link'],
            desc = request.POST['description'],
            lb = LearningBoard.objects.get(pk = request.POST['pk'])
        )
    return JsonResponse({"pk": act.id});

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

@csrf_exempt
@method_required("get")
def load_activity(request):
    pk_board = request.GET.get('pk_board')
    acts = list(Activity.objects.all(lb__pk = pk_board))
    for i in len(acts):
        acts[i] = model_to_dict[acts[i]]
    return JsonResponse({"activity": acts})



