# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lb', '0002_completion'),
    ]

    operations = [
        migrations.AddField(
            model_name='learningboard',
            name='author',
            field=models.ForeignKey(default=1, to='lb.Staff'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='activity',
            name='lb',
            field=models.ForeignKey(related_name='activities', blank=True, to='lb.LearningBoard', null=True),
        ),
    ]
