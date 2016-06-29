# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lb', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='endorsement',
            name='board',
            field=models.ForeignKey(related_name='endorsed_by', to='lb.LearningBoard'),
        ),
        migrations.AlterField(
            model_name='endorsement',
            name='endorser',
            field=models.ForeignKey(related_name='endorsed', to='lb.Staff'),
        ),
        migrations.AlterField(
            model_name='learningboard',
            name='status',
            field=models.PositiveSmallIntegerField(default=0, choices=[(0, b'Unpublished'), (1, b'Published')]),
        ),
    ]
