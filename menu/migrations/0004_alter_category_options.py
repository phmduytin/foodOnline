# Generated by Django 3.2.15 on 2022-11-11 23:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('menu', '0003_auto_20221105_1631'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='category',
            options={'verbose_name': 'category', 'verbose_name_plural': 'categories'},
        ),
    ]