# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0009_leavepaper'),
    ]

    operations = [
        migrations.CreateModel(
            name='BugDetail',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('issue_id', models.CharField(max_length=50)),
                ('finish_date', models.DateField()),
                ('pub_date', models.DateTimeField(default=django.utils.timezone.now, verbose_name=b'date published')),
                ('person', models.ForeignKey(to='login.Person')),
            ],
        ),
    ]
