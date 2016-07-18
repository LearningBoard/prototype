from django.db import models
from django.forms.models import model_to_dict

# Create your models here.

class Student(models.Model):

    username = models.CharField(max_length = 30, unique=True)
    password = models.CharField(max_length = 30)
    major = models.CharField(max_length = 255, null=True)

class Staff(models.Model):

    username = models.CharField(max_length = 30, unique = True)
    password = models.CharField(max_length = 30)
    office = models.CharField(max_length = 255, null=True)
    # is_staff = True

    def __str__(self):
        return self.username

class Tag(models.Model):
    tag = models.CharField(max_length = 255)
    slug = models.SlugField(max_length = 255)

    def __str__(self):
        return self.tag

class Category(models.Model):
    name = models.CharField(max_length = 255)

class LearningBoard(models.Model):
    author = models.ForeignKey(Staff, related_name="lbs")
    image = models.ImageField(null=True, blank=True)
    title = models.CharField(max_length = 127)
    description = models.CharField(max_length = 1023, null=True, blank=True)
    status = models.PositiveSmallIntegerField(
        choices=(
            (0, "Unpublished"),
            (1, "Published"),
        ), default = 0
    )
    category = models.ForeignKey(Category, null=True, blank=True)
    level = models.PositiveSmallIntegerField(
        choices=(
            (0, 'Beginner'),
            (1, 'Intermediate'),
            (2, 'Advanced'),
        ), default=0
    )
    tags = models.ManyToManyField(Tag, blank=True)
    completed = models.BooleanField(default = False)
    following = models.BooleanField(default = False)

    def __str__(self):
        return self.title

    def serialize(self, user_id = None):
        ele = model_to_dict(self)
        if user_id != None:
            if self.followed_by.filter(user__id = user_id).exists():
                ele['followed'] = True
            else:
                ele['followed'] = False
        if ele['image']:
            ele['image_url'] = ele.pop('image').url
        else:
            ele.pop('image')
            ele['image'] = None
            ele['image_url'] = "/media/image-not-found.png"
        ele['following_num'] = self.followed_by.count()
        ele['endorsed_num'] = self.endorsed_by.count()
        ele['completed_num'] = self.completed_by.count()
        ele['activity_num'] = self.activity_set.filter(status = 1).count()
        try:
          if int(user_id) == ele['author']:
            ele['activity_num_all'] = self.activity_set.count()
        except:
          pass
        ele['author'] = self.author.username
        ele['author_id'] = self.author.id
        return ele

class Endorsement(models.Model):
    endorser = models.ForeignKey(Staff, related_name = "endorses")
    board = models.ForeignKey(LearningBoard, related_name = "endorsed_by")

class Activity(models.Model):

    class Meta:
        verbose_name_plural = "activities"

    def __str__(self):
        return self.title

    def serialize(self):
        return dict(model_to_dict(self).items() + {'post_time': self.post_time}.items());

    title = models.CharField(max_length = 255)
    description = models.TextField(null = True, blank = True)
    type = models.CharField(max_length = 255)
    data = models.TextField(null = True, blank = True)
    lb = models.ForeignKey(LearningBoard, related_name="activity_set", null=True, blank=True)
    status = models.PositiveSmallIntegerField(
        choices=(
            (0, "Unpublished"),
            (1, "Published"),
        ), default = 1
    )
    order = models.PositiveIntegerField(default=0)
    author = models.ForeignKey(Staff, null=True, related_name="activities")
    last_modified = models.DateTimeField(auto_now = True)
    post_time = models.DateTimeField(auto_now_add = True)

class News(models.Model):
    class Meta:
        verbose_name_plural = "news"

    title = models.CharField(max_length = 255)
    text = models.TextField()
    author = models.ForeignKey(Staff)
    lb = models.ForeignKey(LearningBoard)
    post_time = models.DateTimeField(auto_now_add = True)

class Follow(models.Model):
    user = models.ForeignKey(Student, related_name="follows")
    lb = models.ForeignKey(LearningBoard, related_name="followed_by")

class Like(models.Model):
    user = models.ForeignKey(Student, related_name="likes")
    lb = models.ForeignKey(LearningBoard, related_name="liked_by")

class Completion(models.Model):
    user = models.ForeignKey(Student, related_name="completes")
    lb = models.ForeignKey(LearningBoard, related_name="completed_by")
