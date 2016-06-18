# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lb', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='activity',
            options={'verbose_name_plural': 'activities'},
        ),
        migrations.AlterModelOptions(
            name='staff',
            options={'verbose_name': 'staff'},
        ),
        migrations.AlterModelOptions(
            name='student',
            options={'verbose_name': 'student'},
        ),
        migrations.AlterField(
            model_name='learningboard',
            name='image',
            field=models.ImageField(null=True, upload_to=b''),
        ),
        migrations.AlterField(
            model_name='staff',
            name='office',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='student',
            name='major',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
