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
from django.conf.urls import include, url
from django.contrib import admin
from lb import views

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accts/add/$', views.account_add),
    url(r'^accts/login/$', views.user_login),
    url(r'^lb/get/(?P<pk>\d+)/$', views.lb_get),
    url(r'^lb/add/$', views.lb_add),
    url(r'^lb/edit/(?P<pk>\d+)/$', views.lb_edit),
    url(r'^lb/delete/(?P<pk>\d+)/$', views.lb_delete),
    url(r'^lb/publish/(?P<pk>\d+)/$', views.lb_publish),
    url(r'^lb/unpublish/(?P<pk>\d+)/$', views.lb_unpublish),
    url(r'^activity/add/$', views.activity_add),
    url(r'^activity/delete/(?P<pk>\d+)/$', views.activity_delete),
]
