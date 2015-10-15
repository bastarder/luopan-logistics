# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0006_auto_20151012_2040'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='person',
            options={'permissions': (('\u6210\u5458', '\u6210\u5458'), ('\u90e8\u95e8\u7ecf\u7406', '\u90e8\u95e8\u7ecf\u7406'), ('Coo', 'Coo'))},
        ),
    ]
