# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0004_auto_20151012_2034'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='person',
            options={'permissions': (('\u4e2d\u6587\u6d4b\u8bd5', '\u4e2d\u6587\u6d4b\u8bd5'), ('\u4e2d\u6587\u6d4b\u8bd52', '\u4e2d\u6587\u6d4b\u8bd52'))},
        ),
    ]
