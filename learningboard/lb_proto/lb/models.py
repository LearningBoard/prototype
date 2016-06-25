from django.db import models

# Create your models here.

class Student(models.Model):

    username = models.CharField(max_length = 30)
    password = models.CharField(max_length = 30)
    major = models.CharField(max_length = 255, null=True)

class Staff(models.Model):

    username = models.CharField(max_length = 30)
    password = models.CharField(max_length = 30)
    office = models.CharField(max_length = 255, null=True)
    is_staff = True

class LearningBoard(models.Model):
    image = models.ImageField(null=True, blank=True)
    title = models.CharField(max_length = 127)
    description = models.CharField(max_length = 1023, null=True, blank=True)
    PUB = "PB"
    UNPUB = "UP"
    status = models.CharField(
        choices=(
            (PUB, 'published'),
            (UNPUB, 'unpublished')
        ), max_length = 127, default=UNPUB
    )
    level = models.PositiveSmallIntegerField(
        choices=(
            (0, 'Beginner'),
            (1, 'Intermediate'),
            (2, 'Advanced')
        ), default=0
    )
    completed = models.BooleanField(default = False)
    following = models.BooleanField(default = False)

class Endorsement(models.Model):
    endorser = models.ForeignKey(Staff, related_name = "endorsed_by")
    board = models.ForeignKey(LearningBoard, related_name = "endorsed_lb")

class Activity(models.Model):

    class Meta:
        verbose_name_plural = "activities"

    def __str__(self):
        return self.name


    title = models.CharField(max_length = 255)
    description = models.TextField(null = True, blank = True)
    type = models.CharField(max_length = 255)
    data = models.TextField(null = True, blank = True)
    lb = models.ForeignKey(LearningBoard, null=True, blank=True)
    PUB = "PB"
    UNPUB = "UP"
    status = models.CharField(
        choices=(
            (PUB, 'published'),
            (UNPUB, 'unpublished')
        ), max_length = 127, default=PUB
    )
    author = models.ForeignKey(Staff, null=True)
    last_modified = models.DateTimeField(auto_now = True)
    post_time = models.DateTimeField(auto_now_add = True)
