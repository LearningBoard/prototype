# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(null=True, blank=True)),
                ('type', models.CharField(max_length=255)),
                ('data', models.TextField(null=True, blank=True)),
                ('status', models.CharField(default=b'PB', max_length=127, choices=[(b'PB', b'published'), (b'UP', b'unpublished')])),
                ('order', models.PositiveIntegerField(default=0)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('post_time', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name_plural': 'activities',
            },
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Completion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
        ),
        migrations.CreateModel(
            name='Endorsement',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
        ),
        migrations.CreateModel(
            name='Follow',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
        ),
        migrations.CreateModel(
            name='LearningBoard',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('image', models.ImageField(null=True, upload_to=b'', blank=True)),
                ('title', models.CharField(max_length=127)),
                ('description', models.CharField(max_length=1023, null=True, blank=True)),
                ('status', models.PositiveSmallIntegerField(default=0, choices=[(0, b'Unpublished'), (1, b'Published')])),
                ('level', models.PositiveSmallIntegerField(default=0, choices=[(0, b'Beginner'), (1, b'Intermediate'), (2, b'Advanced')])),
                ('completed', models.BooleanField(default=False)),
                ('following', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('lb', models.ForeignKey(related_name='liked_by', to='lb.LearningBoard')),
            ],
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=255)),
                ('text', models.TextField()),
                ('post_time', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Staff',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('username', models.CharField(unique=True, max_length=30)),
                ('password', models.CharField(max_length=30)),
                ('office', models.CharField(max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('username', models.CharField(unique=True, max_length=30)),
                ('password', models.CharField(max_length=30)),
                ('major', models.CharField(max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('tag', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='news',
            name='author',
            field=models.ForeignKey(to='lb.Staff'),
        ),
        migrations.AddField(
            model_name='news',
            name='lb',
            field=models.ForeignKey(to='lb.LearningBoard'),
        ),
        migrations.AddField(
            model_name='like',
            name='user',
            field=models.ForeignKey(related_name='likes', to='lb.Student'),
        ),
        migrations.AddField(
            model_name='learningboard',
            name='author',
            field=models.ForeignKey(to='lb.Staff'),
        ),
        migrations.AddField(
            model_name='learningboard',
            name='category',
            field=models.ForeignKey(to='lb.Category', null=True),
        ),
        migrations.AddField(
            model_name='learningboard',
            name='tags',
            field=models.ManyToManyField(to='lb.Tag'),
        ),
        migrations.AddField(
            model_name='follow',
            name='lb',
            field=models.ForeignKey(related_name='followed_by', to='lb.LearningBoard'),
        ),
        migrations.AddField(
            model_name='follow',
            name='user',
            field=models.ForeignKey(related_name='follows', to='lb.Student'),
        ),
        migrations.AddField(
            model_name='endorsement',
            name='board',
            field=models.ForeignKey(related_name='endorsed_by', to='lb.LearningBoard'),
        ),
        migrations.AddField(
            model_name='endorsement',
            name='endorser',
            field=models.ForeignKey(related_name='endorsed', to='lb.Staff'),
        ),
        migrations.AddField(
            model_name='completion',
            name='lb',
            field=models.ForeignKey(related_name='completed_by', to='lb.LearningBoard'),
        ),
        migrations.AddField(
            model_name='completion',
            name='user',
            field=models.ForeignKey(related_name='completes', to='lb.Student'),
        ),
        migrations.AddField(
            model_name='activity',
            name='author',
            field=models.ForeignKey(related_name='activities', to='lb.Staff', null=True),
        ),
        migrations.AddField(
            model_name='activity',
            name='lb',
            field=models.ForeignKey(related_name='activities', blank=True, to='lb.LearningBoard', null=True),
        ),
    ]
