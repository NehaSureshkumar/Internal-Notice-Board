from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, F
from .models import Category, Article, ArticleAttachment, Comment
from .serializers import (
    CategorySerializer, 
    ArticleSerializer, 
    ArticleAttachmentSerializer,
    CommentSerializer
)
from api.permissions import IsAuthorOrReadOnly, IsAdminOrReadOnly

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]
    
    def get_queryset(self):
        queryset = Article.objects.all()
        
        # Filter by category
        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
            
        # Filter by search term
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(content__icontains=search) |
                Q(tags__icontains=search)
            )
            
        # Filter by published status
        published = self.request.query_params.get('published')
        if published is not None:
            is_published = published.lower() == 'true'
            queryset = queryset.filter(is_published=is_published)
            
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Increment view count
        instance.view_count = F('view_count') + 1
        instance.save()
        instance.refresh_from_db()  # Refresh to get the updated view_count
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_attachment(self, request, pk=None):
        article = self.get_object()
        
        for file in request.FILES.values():
            attachment = ArticleAttachment.objects.create(
                article=article,
                file=file,
                filename=file.name
            )
            
        return Response({'status': 'attachments added'})
        
    @action(detail=True, methods=['delete'])
    def remove_attachment(self, request, pk=None):
        article = self.get_object()
        attachment_id = request.data.get('attachment_id')
        
        if attachment_id:
            try:
                attachment = ArticleAttachment.objects.get(id=attachment_id, article=article)
                attachment.delete()
                return Response({'status': 'attachment removed'})
            except ArticleAttachment.DoesNotExist:
                return Response({'error': 'Attachment not found'}, status=404)
                
        return Response({'error': 'attachment_id not provided'}, status=400)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]
    
    def get_queryset(self):
        article_id = self.request.query_params.get('article_id')
        if article_id:
            return Comment.objects.filter(article_id=article_id)
        return Comment.objects.all()