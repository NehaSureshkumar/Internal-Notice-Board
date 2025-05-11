from django.contrib import admin
from .models import Notice, NoticeAttachment

class NoticeAttachmentInline(admin.TabularInline):
    model = NoticeAttachment
    extra = 1

@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'priority', 'created_at', 'pinned')
    list_filter = ('priority', 'pinned', 'category')
    search_fields = ('title', 'content', 'category')
    date_hierarchy = 'created_at'
    inlines = [NoticeAttachmentInline]

@admin.register(NoticeAttachment)
class NoticeAttachmentAdmin(admin.ModelAdmin):
    list_display = ('filename', 'notice', 'upload_date')
    search_fields = ('filename', 'notice__title')