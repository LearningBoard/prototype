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
                ('name', models.CharField(max_length=255)),
            ],
            options={
                'verbose_name_plural': 'activities',
            },
        ),
        migrations.CreateModel(
            name='Endorsement',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
        ),
        migrations.CreateModel(
            name='LearningBoard',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('image', models.ImageField(null=True, upload_to=b'')),
                ('title', models.CharField(max_length=127)),
                ('description', models.CharField(max_length=1023)),
                ('status', models.CharField(max_length=127, choices=[(b'PB', b'published'), (b'UP', b'unpublished')])),
                ('completed', models.BooleanField(default=False)),
                ('following', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Staff',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('username', models.CharField(max_length=30)),
                ('password', models.CharField(max_length=30)),
                ('office', models.CharField(max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('username', models.CharField(max_length=30)),
                ('password', models.CharField(max_length=30)),
                ('major', models.CharField(max_length=255, null=True)),
            ],
        ),
        migrations.AddField(
            model_name='endorsement',
            name='board',
            field=models.ForeignKey(related_name='endorsed_lb', to='lb.LearningBoard'),
        ),
        migrations.AddField(
            model_name='endorsement',
            name='endorser',
            field=models.ForeignKey(related_name='endorsed_by', to='lb.Staff'),
        ),
        migrations.AddField(
            model_name='activity',
            name='lb',
            field=models.ForeignKey(to='lb.LearningBoard'),
        ),
    ]
