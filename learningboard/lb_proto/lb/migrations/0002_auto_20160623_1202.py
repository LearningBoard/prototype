# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lb', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='learningboard',
            name='description',
            field=models.CharField(max_length=1023, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='learningboard',
            name='image',
            field=models.ImageField(null=True, upload_to=b'', blank=True),
        ),
        migrations.AlterField(
            model_name='learningboard',
            name='status',
            field=models.CharField(default=b'UP', max_length=127, choices=[(b'PB', b'published'), (b'UP', b'unpublished')]),
        ),
    ]
