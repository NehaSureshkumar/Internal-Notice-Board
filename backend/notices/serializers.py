from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Notice, NoticeAttachment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class NoticeAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoticeAttachment
        fields = ['id', 'file', 'filename', 'upload_date']


class NoticeSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    attachments = NoticeAttachmentSerializer(many=True, read_only=True)
    author_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Notice
        fields = '__all__'
        
    def create(self, validated_data):
        attachments_data = self.context.get('request').FILES
        
        notice = Notice.objects.create(**validated_data)
        
        for attachment in attachments_data.values():
            NoticeAttachment.objects.create(
                notice=notice,
                file=attachment,
                filename=attachment.name
            )
        
        return notice