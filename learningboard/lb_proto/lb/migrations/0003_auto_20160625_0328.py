# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lb', '0002_auto_20160625_0231'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staff',
            name='username',
            field=models.CharField(unique=True, max_length=30),
        ),
    ]
