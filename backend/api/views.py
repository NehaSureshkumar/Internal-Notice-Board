from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from notices.models import Notice
from knowledge.models import Article, Category, Comment
from notices.serializers import UserSerializer

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_stats(request):
    """
    Get statistics for the dashboard.
    """
    total_notices = Notice.objects.count()
    total_articles = Article.objects.count()
    total_categories = Category.objects.count()
    total_comments = Comment.objects.count()
    
    # Get 5 most viewed articles
    top_articles = Article.objects.order_by('-view_count')[:5]
    top_articles_data = [
        {
            'id': article.id,
            'title': article.title,
            'view_count': article.view_count,
            'category': article.category.name
        }
        for article in top_articles
    ]
    
    # Get latest notices
    latest_notices = Notice.objects.order_by('-created_at')[:5]
    latest_notices_data = [
        {
            'id': notice.id,
            'title': notice.title,
            'priority': notice.priority,
            'created_at': notice.created_at
        }
        for notice in latest_notices
    ]
    
    return Response({
        'total_notices': total_notices,
        'total_articles': total_articles,
        'total_categories': total_categories,
        'total_comments': total_comments,
        'top_articles': top_articles_data,
        'latest_notices': latest_notices_data
    })


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]