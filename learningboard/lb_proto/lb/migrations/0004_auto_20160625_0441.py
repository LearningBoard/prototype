# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('lb', '0003_auto_20160625_0328'),
    ]

    operations = [
        migrations.CreateModel(
            name='Follow',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('lb', models.ForeignKey(related_name='followed_by', to='lb.LearningBoard')),
                ('user', models.ForeignKey(related_name='follows', to='lb.Student')),
            ],
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('lb', models.ForeignKey(related_name='liked_by', to='lb.LearningBoard')),
                ('user', models.ForeignKey(related_name='likes', to='lb.Student')),
            ],
        ),
        migrations.AlterField(
            model_name='activity',
            name='author',
            field=models.ForeignKey(related_name='activities', to='lb.Staff', null=True),
        ),
    ]
