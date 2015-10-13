# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0008_auto_20151012_2101'),
    ]

    operations = [
        migrations.CreateModel(
            name='LeavePaper',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('entry_time', models.CharField(max_length=50, blank=True)),
                ('employee_number', models.CharField(max_length=50, blank=True)),
                ('position', models.CharField(max_length=50, blank=True)),
                ('department', models.CharField(max_length=50, blank=True)),
                ('filling_date', models.CharField(max_length=50, blank=True)),
                ('start_date', models.CharField(max_length=50, blank=True)),
                ('end_date', models.CharField(max_length=50, blank=True)),
                ('reinstatement_date', models.CharField(max_length=50, blank=True)),
                ('total_pay', models.CharField(max_length=50, blank=True)),
                ('remarks', models.CharField(max_length=200, blank=True)),
                ('vacation_type_employee', models.CharField(max_length=50, blank=True)),
                ('vacation_type', models.CharField(max_length=50, blank=True)),
                ('should_enjoy', models.CharField(max_length=50, blank=True)),
                ('extracted', models.CharField(max_length=50, blank=True)),
                ('this_times', models.CharField(max_length=50, blank=True)),
                ('left_times', models.CharField(max_length=50, blank=True)),
                ('effective_date', models.CharField(max_length=50, blank=True)),
                ('pub_date', models.DateTimeField(default=django.utils.timezone.now, verbose_name=b'date published')),
                ('employee_signature', models.CharField(max_length=50, blank=True)),
                ('manager_signature', models.CharField(max_length=50, blank=True)),
                ('coo_signature', models.CharField(max_length=50, blank=True)),
                ('person', models.ForeignKey(to='login.Person')),
            ],
        ),
    ]
