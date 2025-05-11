from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow authors of an object to edit it.
    Read-only permissions are allowed for any request.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write permissions are only allowed to the author
        return obj.author == request.user
        
        
class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow only admins to edit objects.
    Read-only permissions are allowed for any request.
    """
    
    def has_permission(self, request, view):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write permissions are only allowed for admin users
        return request.user and request.user.is_staff