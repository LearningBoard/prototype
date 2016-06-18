from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Student(User):

    class Meta:    
        verbose_name = "student"

    major = models.CharField(max_length = 255, null=True)

class Staff(User):

    class Meta:
        verbose_name = "staff"
        
    account = models.OneToOneField(User)
    office = models.CharField(max_length = 255, null=True)
    is_staff = True

class LearningBoard(models.Model):
    image = models.ImageField(null=True)
    title = models.CharField(max_length = 127)
    description = models.CharField(max_length = 1023)
    PUB = "PB"
    UNPUB = "UP"
    status = models.CharField(
        choices=(
            (PUB, 'published'), 
            (UNPUB, 'unpublished')
        ), max_length = 127
    )
    endorsed = models.ForeignKey(Staff)
    completed = models.BooleanField(default = False)
    following = models.BooleanField(default = False)

class Activity(models.Model):

    class Meta:
        verbose_name_plural = "activities"

    name = models.CharField(max_length = 255)
    lb = models.ForeignKey(LearningBoard)
