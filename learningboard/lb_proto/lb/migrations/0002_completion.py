# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lb', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Completion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('lb', models.ForeignKey(related_name='completed_by', to='lb.LearningBoard')),
                ('user', models.ForeignKey(related_name='completes', to='lb.Student')),
            ],
        ),
    ]
