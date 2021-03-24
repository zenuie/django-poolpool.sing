import django_filters
from django_filters import DateFilter, CharFilter
from music_player.models import Song
from .models import *


class OrderFilter(django_filters.FilterSet):
    start_date = DateFilter(field_name="date_created", lookup_expr='gte')
    end_date = DateFilter(field_name="date_created", lookup_expr='lte')
    note = CharFilter(field_name='note', lookup_expr='icontains')

    class Meta:
        model = Song
        fields = '__all__'
        exclude = ['customer', 'date_created']
