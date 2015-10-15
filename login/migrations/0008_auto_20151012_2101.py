# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0007_auto_20151012_2042'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='person',
            options={'permissions': (('can_cy', 'can cy'), ('can_bmjl', 'can bmj'), ('can_Coo', 'can Coo'))},
        ),
    ]
