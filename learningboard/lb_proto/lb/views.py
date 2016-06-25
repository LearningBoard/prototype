from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.forms.models import model_to_dict
from django.utils.text import slugify
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
def lb_get(request, board_id):
    print request.GET
    board = LearningBoard.objects.get(pk = board_id)
    if board is None:
        return HttpResponse("not found", status = 404)
    else:
        # TODO output image field
        tag =  [ model_to_dict(obj) for obj in board.tags.all() ]
        activity =  [ model_to_dict(obj) for obj in Activity.objects.filter(lb = board_id) ]
        return JsonResponse({'board': model_to_dict(board, fields=[], exclude=['image']), 'activity': activity, 'tag': tag});

@csrf_exempt
def lb_add(request):
    data = dict(request.POST.iterlists())
    print request.POST
    board = LearningBoard.objects.create(
        title = request.POST['title'],
        description = request.POST['description']
    )
    # Assign board id to tag
    if request.POST.getlist('tag_list[]', None) is not None:
        board.tags.add(*Tag.objects.filter(pk__in = request.POST.getlist('tag_list[]')))
        board.save()
    # Assign board id to previous saved activity
    if request.POST.getlist('activity_list[]', None) is not None:
        Activity.objects.filter(pk__in = request.POST.getlist('activity_list[]')).update(lb = board.id)
    return JsonResponse({"pk": board.id});

@csrf_exempt
def lb_edit(request, board_id):
    print request.POST
    board = LearningBoard.objects.get(pk = board_id)
    if board is None:
        return HttpResponse("not found", status = 404)
    else:
        board.title = request.POST['title']
        board.description = request.POST['description']
        board.level = request.POST['contentLevel']
        if request.POST.getlist('tag_list[]', None) is not None:
            board.tags.exclude(pk__in = request.POST.getlist('tag_list[]')).delete()
            for tag in Tag.objects.filter(pk__in = request.POST.getlist('tag_list[]')):
                board.tags.add(tag.id);
        board.save()
        return JsonResponse({"pk": board.id});

@csrf_exempt
def lb_delete(request, board_id):
    # pk = board id
    print request.GET
    LearningBoard.objects.filter(pk = board_id).delete()
    return HttpResponse("done")

@csrf_exempt
def lb_publish(request, board_id):
    # pk = board id
    board = LearningBoard.objects.get(pk = board_id)
    board.status = "PB"
    board.save()
    return HttpResponse("done")

@csrf_exempt
def lb_unpublish(request, board_id):
    board = LearningBoard.objects.get(pk = board_id)
    board.status = "UP"
    board.save()
    return HttpResponse("done")

@csrf_exempt
def activity_get(request, activity_id):
    act = Activity.objects.get(pk = activity_id)
    if act is None:
        return HttpResponse("not found", status = 404)
    else:
        return JsonResponse(model_to_dict(act, fields=[], exclude=[]))

@csrf_exempt
@method_required("get")
def lb_load_activity(request):
    pk_board = request.GET.get('pk_board')
    acts = list(Activity.objects.all(lb__pk = pk_board))
    for i in len(acts):
        acts[i] = model_to_dict[acts[i]]
    return JsonResponse({"activity": acts})

@csrf_exempt
def activity_add(request):
    print request.POST
    data = json.dumps({key: request.POST.dict()[key] for key in request.POST.dict() if key not in ['pk', 'title', 'description', 'type', 'activity_id']})
    # pk = board_id
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
def activity_edit(request, activity_id):
    print request.POST
    act = Activity.objects.get(pk = activity_id)
    if act is None:
        return HttpResponse("not found", status = 404)
    else:
        data = json.dumps({key: request.POST.dict()[key] for key in request.POST.dict() if key not in ['pk', 'title', 'description', 'type', 'activity_id']})
        act.title = request.POST['title']
        act.description = request.POST['description']
        act.data = data
        act.save()
        return JsonResponse({"pk": act.id});

@csrf_exempt
def activity_delete(request, activity_id):
    Activity.objects.filter(pk = activity_id).delete()
    return HttpResponse("done")

@csrf_exempt
def activity_publish(request, activity_id):
    act = Activity.objects.get(pk = activity_id)
    act.status = "PB"
    act.save()
    return HttpResponse("done")

@csrf_exempt
def activity_unpublish(request, activity_id):
    act = Activity.objects.get(pk = activity_id)
    act.status = "UP"
    act.save()
    return HttpResponse("done")

@csrf_exempt
@method_required("post")
def activity_follow(request):
    lb_id = request.POST.get('activity_id')
    u_id = request.POST.get('user_id')
    if Follow.objects.filter(lb_id = lb_id, stu_id = u_id).exists():
        Follow.objects.create(lb_id = lb_id, stu_id = u_id)
        return JsonResponse({"ok": True})
    return JsonResponse({"ok": False})

@csrf_exempt
@method_required("post")
def activity_unfollow(request):
    lb_id = request.POST.get('activity_id')
    u_id = request.POST.get('user_id')
    if Follow.objects.filter(lb_id = lb_id, stu_id = u_id).exists():
        Follow.objects.delete(lb_id = lb_id, stu_id = u_id)
        return JsonResponse({"ok": True})
    return JsonResponse({"ok": False})
def tag_add(request):
    tag = tools.get_or_None(Tag, tag = request.POST['tag'])
    if tag is not None:
      return JsonResponse({"pk": tag.id});
    tag = Tag.objects.create(
        tag = request.POST['tag'],
        slug = slugify(request.POST['tag'])
    )
    return JsonResponse({"pk": tag.id});

@csrf_exempt
@method_required('post')
def user_register(request):
    usr = request.POST.get('username', None)
    pwd = request.POST.get('password', None)
    if usr != None and pwd != None:
        if Student.objects.filter(username = usr).exists() or Staff.objects.filter(username = usr).exists():
            return JsonResponse({"ok": False, "info": "user already exists"})
        else:
            stu = Student.objects.create(username = usr, password = pwd)
            return JsonResponse({"ok": True, "pk": stu.id, "is_staff": False})
    else:
        return JsonResponse({"ok": False})

@csrf_exempt
def user_login(request):
    print request.GET
    usr = request.GET['username']
    pwd = request.GET['password']

    stu = tools.get_or_None(Student, username = usr, password = pwd)
    if stu is None:
        staf = tools.get_or_None(Staff, username = usr, password = pwd)
        if staf is None:
            return JsonResponse({"ok": False, "info": "password not correct"})
        return JsonResponse({"pk": staf.id, "is_staff": True})

    return JsonResponse({"pk": stu.id, "is_staff": False});

@csrf_exempt
@method_required("get")
def load_activity(request):
    pk_board = request.GET.get('pk_board')
    acts = list(Activity.objects.all(lb__pk = pk_board))
    for i in len(acts):
        acts[i] = model_to_dict[acts[i]]
    return JsonResponse({"activity": acts})
