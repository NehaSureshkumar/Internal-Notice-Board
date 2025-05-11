from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Article, ArticleAttachment, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ArticleAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleAttachment
        fields = ['id', 'file', 'filename', 'upload_date']


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Comment
        fields = '__all__'


class ArticleSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    attachments = ArticleAttachmentSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    author_id = serializers.IntegerField(write_only=True)
    category_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Article
        fields = '__all__'
        
    def create(self, validated_data):
        attachments_data = self.context.get('request').FILES
        
        article = Article.objects.create(**validated_data)
        
        for attachment in attachments_data.values():
            ArticleAttachment.objects.create(
                article=article,
                file=attachment,
                filename=attachment.name
            )
        
        return article