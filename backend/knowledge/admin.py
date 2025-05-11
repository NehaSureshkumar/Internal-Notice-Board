from django.contrib import admin
from .models import Category, Article, ArticleAttachment, Comment

class ArticleAttachmentInline(admin.TabularInline):
    model = ArticleAttachment
    extra = 1

class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'created_at', 'updated_at', 'is_published', 'view_count')
    list_filter = ('is_published', 'category')
    search_fields = ('title', 'content', 'tags')
    date_hierarchy = 'created_at'
    inlines = [ArticleAttachmentInline, CommentInline]
    readonly_fields = ('view_count',)

@admin.register(ArticleAttachment)
class ArticleAttachmentAdmin(admin.ModelAdmin):
    list_display = ('filename', 'article', 'upload_date')
    search_fields = ('filename', 'article__title')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'article', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'author__username', 'article__title')
    date_hierarchy = 'created_at'