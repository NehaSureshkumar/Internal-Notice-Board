from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .models import Notice, NoticeAttachment
from .serializers import NoticeSerializer, NoticeAttachmentSerializer
from api.permissions import IsAuthorOrReadOnly, IsAdminOrReadOnly

class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]
    
    def get_queryset(self):
        queryset = Notice.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
            
        # Filter by search term
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(content__icontains=search)
            )
            
        # Filter by priority
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
            
        # Filter by active notices (not expired)
        active_only = self.request.query_params.get('active_only')
        if active_only and active_only.lower() == 'true':
            now = timezone.now()
            queryset = queryset.filter(
                Q(expires_at__gt=now) | Q(expires_at__isnull=True)
            )
            
        return queryset
    
    @action(detail=True, methods=['post'])
    def add_attachment(self, request, pk=None):
        notice = self.get_object()
        
        for file in request.FILES.values():
            attachment = NoticeAttachment.objects.create(
                notice=notice,
                file=file,
                filename=file.name
            )
            
        return Response({'status': 'attachments added'})
        
    @action(detail=True, methods=['delete'])
    def remove_attachment(self, request, pk=None):
        notice = self.get_object()
        attachment_id = request.data.get('attachment_id')
        
        if attachment_id:
            try:
                attachment = NoticeAttachment.objects.get(id=attachment_id, notice=notice)
                attachment.delete()
                return Response({'status': 'attachment removed'})
            except NoticeAttachment.DoesNotExist:
                return Response({'error': 'Attachment not found'}, status=404)
                
        return Response({'error': 'attachment_id not provided'}, status=400)