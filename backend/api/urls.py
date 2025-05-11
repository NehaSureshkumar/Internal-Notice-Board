from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from notices.views import NoticeViewSet
from knowledge.views import CategoryViewSet, ArticleViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'notices', NoticeViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'articles', ArticleViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', views.get_stats, name='stats'),
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
]