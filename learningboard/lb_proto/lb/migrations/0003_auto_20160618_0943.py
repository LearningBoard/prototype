# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lb', '0002_auto_20160618_0810'),
    ]

    operations = [
        migrations.CreateModel(
            name='Endorsement',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='learningboard',
            name='endorsed',
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
    ]
