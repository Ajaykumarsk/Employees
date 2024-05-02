from django.db import models
from datetime import date

class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Location(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    gender = models.CharField(max_length=255)
    department = models.CharField(max_length=100, default=' ')
    location = models.CharField(max_length=100, default=' ')
    dateOfJoining = models.DateField(default=date.today)

    def __str__(self):
        return self.name
