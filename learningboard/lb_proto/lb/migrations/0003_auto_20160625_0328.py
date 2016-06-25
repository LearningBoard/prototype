# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-25 08:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lb', '0002_auto_20160625_0231'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='learningboard',
            name='tags',
            field=models.ManyToManyField(to='lb.Tag'),
        ),
    ]
