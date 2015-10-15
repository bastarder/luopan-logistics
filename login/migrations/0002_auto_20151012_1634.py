# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='person',
            name='asad',
        ),
        migrations.RemoveField(
            model_name='person',
            name='en_department',
        ),
        migrations.RemoveField(
            model_name='person',
            name='level',
        ),
        migrations.AddField(
            model_name='person',
            name='department',
            field=models.CharField(default=123, max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='person',
            name='person_number',
            field=models.CharField(default=123, max_length=30),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='person',
            name='position',
            field=models.CharField(default=123, max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='person',
            name='name',
            field=models.CharField(max_length=25),
        ),
    ]
