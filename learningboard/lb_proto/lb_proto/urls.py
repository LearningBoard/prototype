"""lb_proto URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import include, url
from django.contrib import admin
from lb import views

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accts/register/$', views.user_register),
    url(r'^accts/login/$', views.user_login),
    url(r'^category/getAll/$', views.category_getAll),
    url(r'^lb/get/(?P<board_id>\d+)/$', views.lb_get),
    url(r'^lb/load/$', views.lb_load),
    url(r'^lb/user_load/$', views.lb_user_load),
    url(r'^lb/add/$', views.lb_add),
    url(r'^lb/edit/(?P<board_id>\d+)/$', views.lb_edit),
    url(r'^lb/delete/(?P<board_id>\d+)/$', views.lb_delete),
    url(r'^lb/publish/(?P<board_id>\d+)/$', views.lb_publish),
    url(r'^lb/unpublish/(?P<board_id>\d+)/$', views.lb_unpublish),
    url(r'^activity/get/(?P<activity_id>\d+)/$', views.activity_get),
    url(r'^activity/add/$', views.activity_add),
    url(r'^activity/edit/(?P<activity_id>\d+)/$', views.activity_edit),
    url(r'^activity/delete/(?P<activity_id>\d+)/$', views.activity_delete),
    url(r'^activity/publish/(?P<activity_id>\d+)/$', views.activity_publish),
    url(r'^activity/unpublish/(?P<activity_id>\d+)/$', views.activity_unpublish),
    url(r'^activity/orderchange/$', views.activity_orderchange),
    url(r'^activity/follow/$', views.activity_follow),
    url(r'^activity/unfollow/$', views.activity_unfollow),
    url(r'^tag/getAll/$', views.tag_getAll),
    url(r'^tag/add/$', views.tag_add),
    url(r'^news/getAll/$', views.news_getAll),
    url(r'^news/add/$', views.news_add),
    url(r'^media/upload/$', views.media_upload),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
