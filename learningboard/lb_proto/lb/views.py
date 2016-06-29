from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.forms.models import model_to_dict
from django.utils.text import slugify
from django.core.files.base import ContentFile
import tools, json, base64
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
def category_getAll(request):
    category = Category.objects.all()
    if len(category) < 1:
        return JsonResponse({'category': []})
    else:
        category = [ model_to_dict(obj) for obj in category ]
        return JsonResponse({'category': category});

@csrf_exempt
def lb_get(request, board_id):
    print request.GET
    board = LearningBoard.objects.get(pk = board_id)
    if board is None:
        return HttpResponse("not found", status = 404)
    else:
        board_dict = model_to_dict(board, fields=[], exclude=[])
        try:
            board_dict['image'] = board_dict['image'].url
        except:
            board_dict['image'] = None
        tag =  [ model_to_dict(obj) for obj in board.tags.all() ]
        activity =  [ model_to_dict(obj) for obj in Activity.objects.filter(lb = board_id).order_by('order') ]
        return JsonResponse({'board': board_dict, 'activity': activity, 'tag': tag});

def lb_load(request):
    board_list = list(LearningBoard.objects.all().select_related('author'))
    leng = len(board_list)
    for i in range(leng):
        ele = model_to_dict(board_list[i])
        if ele['image']:
            ele['image'] = ele['image'].url
        else:
            ele['image'] = None
        ele['following_num'] = ele.followed_by.count()
        ele['endorsed_num'] = ele.endorsed_by.count()
        ele['completed_num'] = ele.completed_by.count()
        ele['activities_num'] = ele.activities.count()
        ele['author'] = ele.author.username
        ele['author_id'] = ele.author.id
        board_list[i] = ele

    return JsonResponse({"board_list": board_list})

@csrf_exempt
@method_required("get")
def lb_activity_load(request):
    pk_board = request.GET.get('pk_board')
    acts = list(Activity.objects.all(lb__pk = pk_board))
    for i in range(len(acts)):
        acts[i] = model_to_dict[acts[i]]
    return JsonResponse({"activity": acts})

@csrf_exempt
def lb_add(request):
    print request.POST
    board = LearningBoard.objects.create(
        author_id = request.POST["author_id"],
        title = request.POST['title'],
        description = request.POST['description'],
        category = tools.get_or_None(Category, pk = request.POST.get('category', None)),
        level = request.POST.get('contentLevel', 0)
    )
    # Assign board id to tag
    if request.POST.getlist('tag_list[]', None) is not None:
        board.tags.add(*Tag.objects.filter(pk__in = request.POST.getlist('tag_list[]')))
        board.save()
    # Assign board id to previous saved activity
    if request.POST.getlist('activity_list[]', None) is not None:
        Activity.objects.filter(pk__in = request.POST.getlist('activity_list[]')).update(lb = board.id)
    # Cover image
    if request.POST.get('cover_img', None) is not None:
        format, img = request.POST.get('cover_img').split(';base64,')
        ext = format.split('/')[-1]
        board.image.save('cover.' + ext, ContentFile(base64.decodestring(img)), save=True)
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
        board.category = tools.get_or_None(Category, pk = request.POST.get('category', None))
        board.level = request.POST.get('contentLevel', 0)
        if request.POST.getlist('tag_list[]', None) is not None:
            board.tags.exclude(pk__in = request.POST.getlist('tag_list[]')).delete()
            for tag in Tag.objects.filter(pk__in = request.POST.getlist('tag_list[]')):
                board.tags.add(tag.id);
        board.save()
        if request.POST.get('cover_img', None) is not None:
            if request.POST['cover_img'].startswith('data:'):
                format, img = request.POST.get('cover_img').split(';base64,')
                ext = format.split('/')[-1]
                board.image.save('cover.' + ext, ContentFile(base64.decodestring(img)), save=True)
        else:
            board.image.delete()
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
def activity_add(request):
    print request.POST
    data = json.dumps({key: request.POST.dict()[key] for key in request.POST.dict() if key not in ['pk', 'title', 'description', 'type', 'activity_id', 'order']})
    # pk = board_id
    if request.POST.get('pk', None) is None:
        act = Activity.objects.create(
            title = request.POST['title'],
            description = request.POST['description'],
            type = request.POST['type'],
            data = data,
            order = request.POST['order']
        )
    else:
        act = Activity.objects.create(
            title = request.POST['title'],
            description = request.POST['description'],
            type = request.POST['type'],
            data = data,
            order = request.POST['order'],
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
        data = json.dumps({key: request.POST.dict()[key] for key in request.POST.dict() if key not in ['pk', 'title', 'description', 'type', 'activity_id', 'order']})
        act.title = request.POST['title']
        act.description = request.POST['description']
        act.data = data
        act.order = request.POST['order']
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
def activity_orderchange(request):
    for key, value in request.POST.iteritems():
        act = Activity.objects.get(pk = key)
        act.order = value
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

@csrf_exempt
@method_required("post")
def tag_getAll(request):
    tag = Tag.objects.all()
    if len(tag) < 1:
        return JsonResponse({'tags': []})
    else:
        tag = [ model_to_dict(obj) for obj in tag ]
        return JsonResponse({'tags': tag});

@csrf_exempt
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
