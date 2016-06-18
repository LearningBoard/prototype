
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'm*26^kl%d61oeyk4#a0%@g%@qr8k+@o(i@n6d5zkyw002_sn9a'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mit',
        'HOST': 'localhost',
        'USER': 'root',
        'PASSWORD': 'yixuxi5625',
        'PORT': '3306',
        'CHARSET': 'utf8'
    }
}
