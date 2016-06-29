# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-29 04:06
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('type', models.CharField(max_length=255)),
                ('data', models.TextField(blank=True, null=True)),
                ('status', models.CharField(choices=[(b'PB', b'published'), (b'UP', b'unpublished')], default=b'PB', max_length=127)),
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
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Completion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Endorsement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Follow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='LearningBoard',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to=b'')),
                ('title', models.CharField(max_length=127)),
                ('description', models.CharField(blank=True, max_length=1023, null=True)),
                ('status', models.CharField(choices=[(b'PB', b'published'), (b'UP', b'unpublished')], default=b'UP', max_length=127)),
                ('level', models.PositiveSmallIntegerField(choices=[(0, b'Beginner'), (1, b'Intermediate'), (2, b'Advanced')], default=0)),
                ('completed', models.BooleanField(default=False)),
                ('following', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lb', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='liked_by', to='lb.LearningBoard')),
            ],
        ),
        migrations.CreateModel(
            name='Staff',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=30, unique=True)),
                ('password', models.CharField(max_length=30)),
                ('office', models.CharField(max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=30, unique=True)),
                ('password', models.CharField(max_length=30)),
                ('major', models.CharField(max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='like',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='lb.Student'),
        ),
        migrations.AddField(
            model_name='learningboard',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lb.Staff'),
        ),
        migrations.AddField(
            model_name='learningboard',
            name='category',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='lb.Category'),
        ),
        migrations.AddField(
            model_name='learningboard',
            name='tags',
            field=models.ManyToManyField(to='lb.Tag'),
        ),
        migrations.AddField(
            model_name='follow',
            name='lb',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='followed_by', to='lb.LearningBoard'),
        ),
        migrations.AddField(
            model_name='follow',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follows', to='lb.Student'),
        ),
        migrations.AddField(
            model_name='endorsement',
            name='board',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='endorsed_lb', to='lb.LearningBoard'),
        ),
        migrations.AddField(
            model_name='endorsement',
            name='endorser',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='endorsed_by', to='lb.Staff'),
        ),
        migrations.AddField(
            model_name='completion',
            name='lb',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='completed_by', to='lb.LearningBoard'),
        ),
        migrations.AddField(
            model_name='completion',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='completes', to='lb.Student'),
        ),
        migrations.AddField(
            model_name='activity',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='activities', to='lb.Staff'),
        ),
        migrations.AddField(
            model_name='activity',
            name='lb',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='activities', to='lb.LearningBoard'),
        ),
    ]
